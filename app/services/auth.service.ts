import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from "sequelize";
import Usuario from '../models/usuario.model'
import RefreshToken from '../models/usuarioToken.model';
import ResetToken from '../models/usuarioResetPassword.model';
import { ErrorHandler } from '../helpers/error';
import sendEmail from '../utils/Emails/sendEmail';

const INVALID_REF_TOKEN = "invalid-refreshtoken";
const crypto_algorithm = "aes-128-cbc";



class AuthService {

  async register(nombre: string, email: string, password: string, role: string, is_active: boolean) {
    const usuario = await Usuario.findOne({ where: { email }})
    if (usuario) {
      throw new ErrorHandler(400, "El email ya está en uso.");
    }
    try {
      const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

      const newUsuario = new Usuario({
        nombre,
        email,
        password: hashedPassword,
        role,
        is_active
      });
      await newUsuario.save();
    } catch (error: any) {
      throw new ErrorHandler(500, "Server Error.", error.message);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      if(!user.is_active) {
        throw new Error("Cuenta desactivada.");
      }

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        throw new Error("Las credenciales son incorrectas.");
      }

      const accessToken = jwt.sign(
        { email: user.email, userId: user.id },
        process.env.JWT_PRIVATE_KEY!,
        { expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXP) }
      );
      const refreshToken = jwt.sign(
        { email: user.email, userId: user.id },
        process.env.JWT_PRIVATE_KEY!,
        { expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXP) }
      );

      // Encrypt the refresh token for storage in the database
      const init_vector = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        crypto_algorithm,
        process.env.BCRYPT_SECRET!,
        init_vector
      );
      const encriptedRefreshToken =
        cipher.update(refreshToken, 'utf8', 'base64') + cipher.final('base64');

      const refreshTokenExpiryDate = new Date(
        Date.now() + Number(process.env.JWT_REFRESH_TOKEN_EXP) * 1000
      );

      // Insert or update (if exists) refreshToken in the database
      const values = {
        token: encriptedRefreshToken,
        init_vector: init_vector.toString('base64'),
        expiryDate: refreshTokenExpiryDate,
        usuario_id: user.id,
      };
      // const options = {
      //   where: { usuario_id: user.id },
      // };
      // Sequelize knows if to find/update according to constraints
      await RefreshToken.upsert(values); //options

      return {
        accessToken,
        refreshToken,
        refreshTokenExpiryDate,
        userId: user.id,
        userRole: user.role,
        expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXP)
      };
    } catch (error: any) {
      throw new ErrorHandler(401, "Error al intentar loguear", error.message);
    }
  }

  // TODO: not throwing error, no need?
  async logout(usuario_id: number) {
    try {
      await RefreshToken.destroy({ where: { usuario_id } });
    } catch(error: any) {
      // OK aunque no se borre => Al hacer nuevo login, se sobrescribe.
      console.error("Error al eliminar refreshToken: ", error.message);
    }
  }

  // "invalid-refreshtoken" en 401, para que interceptor de Front no vuelva a llamar a refreshToken (llama cuando hay error 401).
  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY!) as JwtPayload; // TODO - Eliminar, ya lo hacemos en middleware => req.usuario_id
      const usuario_id = decoded.userId;

      const refreshTokenDB = await RefreshToken.findOne({ where: { usuario_id } });
      if (!refreshTokenDB) {
        throw new Error("El token de refresco no se encuentra en la Base de Datos.");
      }

      // Desencriptar y comprobar que el token es correcto
      const init_vector = Buffer.from(refreshTokenDB.init_vector, 'base64');
      const decipher = crypto.createDecipheriv(crypto_algorithm, process.env.BCRYPT_SECRET!, init_vector);
      const decryptedData = decipher.update(refreshTokenDB.token, 'base64', 'utf8') + decipher.final('utf8');
      if (decryptedData !== refreshToken) {
        await RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
        throw new Error("El token de refresco no es válido.");
      }

      // Comprobar expiración según expiryDate en BBDD
      if (refreshTokenDB.expiryDate.getTime() < new Date().getTime()) {
        await RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
        throw new Error("El token de refresco ha expirado.");
      }

      const usuario = await refreshTokenDB.$get('usuario');
      if(!usuario){
        throw new Error("El token de refresco no tiene un usuario válido.");
      }
      // const usuario = await refreshTokenDB.getUsuario(); // getUsuario() función de sequelize (por la relación)
      // const usuario = Usuario.findOne({ where: { id: refreshTokenDB.id } })
      const newAccessToken = jwt.sign(
        { email: usuario.email, userId: usuario.id },
        process.env.JWT_PRIVATE_KEY!,
        { expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXP) }
      );

      return {
        accessToken: newAccessToken,
        usuario_id: usuario.id,
        usuario_rol: usuario.role,
        expires_in: Number(process.env.JWT_ACCESS_TOKEN_EXP)
      };
    } catch (error: any) { // Catches errors, and reconverts+adds details
      throw new ErrorHandler(401, error.message, INVALID_REF_TOKEN)
    }
  }

  // TODO - Delete (checkRole middleware)
  // async isAdmin(email) {
  //   const user = await Usuario.findOne({ where: { email } });
  //   if (!user) {
  //     return false;
  //   }
  //   return user.role === "admin";
  // }

  async forgotPassword(email: string) {
    try {

      const user = await Usuario.findOne({ where: { email }})
      if (!user) {
        throw new ErrorHandler(404, "Usuario no encontrado.");
      }

      // TODO - Tambien se puede hacer crear o actualizar, para ahorrar un query
      // Si ya existe un token para el usuario, eliminarlo.
      let existingToken = await ResetToken.findOne({ where: { usuario_id: user.id } });
      if(existingToken){
        await existingToken.destroy();
      }

      // Generar string/token y hashear
      let token = crypto.randomBytes(32).toString("hex");
      const hashedToken = await bcrypt.hash(token, Number(process.env.BCRYPT_SALT));
      const tokenExpiryDate = new Date(Date.now() + (Number(process.env.RESET_PASS_TOKEN_EXP) * 1000));

      // Guardar token hasheado en BBDD
      const resetToken = new ResetToken({
        usuario_id: user.id,
        token: hashedToken,
        expiryDate: tokenExpiryDate
      })
      await resetToken.save()
        .catch(e => {
            console.log("Error al crear token de reseteo de contraseña: ", e);
            throw new ErrorHandler(500, "Error al guardar token", e);
        });

      // enviar Email (destinatario, asunto, variables a introducir en template, template)
      await sendEmail(
        user.email,
        "Reset Contraseña",
        { nombre: user.nombre, link: `${process.env.BASE_URL}/auth/reset-password/${user.id}/${token}` },
        "./Templates/resetPassword.handlebars"
      )
  
    } catch (error: any) {
      throw new ErrorHandler(500, "Error al enviar email.", error.message);
    }
  }

  async resetPassword(usuario_id: number, token: string, password: string) {
    try {

      let resetToken = await ResetToken.findOne({ where: { usuario_id, expiryDate: { [Op.gt]: new Date(Date.now()) } } });
      if(!resetToken) {
        throw new Error("Token inválido o caducado.");
      }  

      const isValidToken = await bcrypt.compare(token, resetToken.token);
      if (!isValidToken) {
        throw new Error("Token inválido.");
      }

      const hashedPass = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

      await Usuario.update({ password: hashedPass }, {
        where: {
          id: resetToken.usuario_id
        }
      })
      .then(async () => {
        // TODO - Enviar email de confirmación
        await resetToken.destroy();
      })

    } catch (error: any) {
      throw new ErrorHandler(500, "Error al resetear contraseña", error.message);
    }
  }
}


export default new AuthService();