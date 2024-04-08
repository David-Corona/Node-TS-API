// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const { Op } = require("sequelize");

const authService = require("../../services/auth.service");
// const Usuario = require('../../models').Usuario;
const RefreshToken = require('../../models').UsuarioToken;
// const ResetToken = require('../../models').UsuarioResetPassword;
// const sendEmail = require('../../utils/Emails/sendEmail');
const { ErrorHandler } = require('../../helpers/error')

const INVALID_REF_TOKEN = "invalid-refreshtoken";
// const crypto_algorithm = "aes-128-cbc";



exports.registro = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;
        const response = await authService.register(nombre, email, password, "user", true);

        return res.status(201).json({
            message: "Usuario creado correctamente.",
            data: response,
        });
    } catch(error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body.email, req.body.password);

        res.status(200)
        .cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            expires: result.refreshTokenExpiryDate,
        })
        .json({
            message: "Logueado correctamente.",
            data: {
                accessToken: result.accessToken,
                usuario_id: result.userId,
                usuario_rol: result.userRole,
                expires_in: result.expiresIn
            },
        });

    } catch(error) {
        next(error);
    }
};

// "invalid-refreshtoken" en 401, para que interceptor de Front no vuelva a llamar a refreshToken (llama cuando hay error 401).
exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new ErrorHandler(401, "No se ha adjuntado token de refresco.", INVALID_REF_TOKEN)
        }

        const result = await authService.refreshToken(refreshToken);

        return res.status(200).json({
            message: "Nuevo accessToken generado correctamente.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        if(req.body.usuario_id) { 
            RefreshToken.destroy({ where: { usuario_id: req.body.usuario_id } });
        }
        // OK aunque no se borre => Al hacer nuevo login, se sobrescribe.
        return res.status(200).json({
            message: "Deslogueado correctamente.",
        });
    } catch(error) {
        next(error);
    }
};

exports.forgotPassword = async (req, res, next) => { 
    try {
        await authService.forgotPassword(req.body.email);

        res.status(200).json({
            message: "Email enviado correctamente.",
        });
    } catch(error) {
        next(error);
    }
}

exports.resetPassword = async (req, res, next) => { 
    try {
        await authService.resetPassword(req.body.usuario_id, req.body.token, req.body.password);
        res.status(200).json({
            message: "Contraseña actualizada correctamente.",
        });
    } catch(error) {
        next(error);
    }
}



// TODO - Eliminar
// exports.refreshTokenOLD = async (req, res, next) => {

//     const refreshToken = req.cookies['refreshToken'];
//     if (!refreshToken) {
//         // return next(new ErrorHandler(401, 'No Autenticado: No se ha adjuntado token de refresco.', INVALID_REF_TOKEN))
//         return res.status(401).json({
//             message: "No se ha adjuntado token de refresco.",
//             error: INVALID_REF_TOKEN
//         });
//     }

//     try {
//         const decoded = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY); // TODO - Eliminar, ya lo hacemos en middleware => req.usuario_id
//         const usuario_id = decoded.userId;

//         let refreshTokenDB = await RefreshToken.findOne({ where: { usuario_id: usuario_id } });
//         if(!refreshTokenDB){
//             return res.status(401).json({ 
//                 message: "El token de refresco no se encuentra en la Base de Datos.",
//                 error: INVALID_REF_TOKEN
//             });
//         }

//         // Desencriptar y comprobar que el token es correcto
//         const init_vector = Buffer.from(refreshTokenDB.init_vector, 'base64');
//         const decipher = crypto.createDecipheriv(crypto_algorithm, process.env.BCRYPT_SECRET, init_vector);
//         const decryptedData = decipher.update(refreshTokenDB.token, 'base64', 'utf8') + decipher.final('utf8');
//         if(decryptedData !== refreshToken) {
//             RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
//             return res.status(401).json({
//                 message: "El token de refresco no es válido.",
//                 error: INVALID_REF_TOKEN
//             });
//         }

//         // Comprobar expiración según expiryDate en BBDD
//         if(refreshTokenDB.expiryDate.getTime() < new Date().getTime()) {
//             RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
//             return res.status(401).json({
//                 message: "El token de refresco ha expirado.",
//                 error: INVALID_REF_TOKEN
//             });
//         }     

//         const usuario = await refreshTokenDB.getUsuario(); // getUsuario() función de sequelize (por la relación)
//         // const usuario = Usuario.findOne({ where: { id: refreshTokenDB.id } })
//         const newAccessToken = jwt.sign(
//             { email: usuario.email, userId: usuario.id },
//             process.env.JWT_PRIVATE_KEY,
//             { expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXP) }
//         );

//         return res.status(200).json({
//             message: "Nuevo accessToken generado correctamente.",
//             data: {
//                 accessToken: newAccessToken,
//                 usuario_id: usuario.id,
//                 expires_in: Number(process.env.JWT_ACCESS_TOKEN_EXP) 
//             }
//         });

//     } catch(e) {
//         console.log("RefreshToken error: ", e);
//         // throw new ErrorHandler(500, 'Error en token de refresco.')
//         return res.status(500).json({
//             message: "Error en token de refresco.",
//             error: e 
//         });
//     }
// };

// exports.loginOLD = async (req, res) => {  
//     try {
//         const user = await Usuario.findOne({ where: { email: req.body.email }})
//         if (!user) {
//             return res.status(404).json({
//                 message: "Usuario no encontrado."
//             });
//         }

//         const validPass = await bcrypt.compare(req.body.password, user.password);
//         if (!validPass) {
//             return res.status(401).json({
//                 message: "Las credenciales son incorrectas."
//             });
//         }

//         const accessToken = jwt.sign(
//             { email: user.email, userId: user.id },
//             process.env.JWT_PRIVATE_KEY,
//             { expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXP) } 
//         );
//         const refreshToken = jwt.sign(
//             { email: user.email, userId: user.id },
//             process.env.JWT_PRIVATE_KEY,
//             { expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXP) } 
//         );

//         // Encriptar el refresh token para guardar en bbdd
//         const init_vector = crypto.randomBytes(16);
//         const cipher = crypto.createCipheriv(crypto_algorithm, process.env.BCRYPT_SECRET, init_vector);
//         const encriptedRefreshToken = cipher.update(refreshToken, 'utf8', 'base64') + cipher.final('base64');

//         const refreshTokenExpiryDate = new Date(Date.now() + (Number(process.env.JWT_REFRESH_TOKEN_EXP) * 1000));

//         // Insertar o actualizar (si existe) refresToken en BBDD.
//         const values = {
//             token: encriptedRefreshToken,
//             init_vector: init_vector.toString('base64'),
//             expiryDate: refreshTokenExpiryDate,
//             usuario_id: user.id
//         };
//         const options = {
//             where: { usuario_id: user.id },
//         };
//         RefreshToken.upsert(values, options)
//             .catch(e => console.log(e));

//         // res.cookie: http://expressjs.com/es/api.html#res.cookie
//         res.status(200)
//             .cookie(
//                 'refreshToken', 
//                 refreshToken, 
//                 { 
//                     httpOnly: true,
//                     sameSite: 'strict', //sameSite: 'None'
//                     expires: refreshTokenExpiryDate, // Si no se incluye, caduca con la sesión
//                     // secure=true // secure=true => Cookie sólo para HTTPS TODO
//                 }
//             ) 
//             .json({
//                 message: "Logueado correctamente.",
//                 data: {
//                     accessToken: accessToken,
//                     usuario_id: user.id,
//                     expires_in: Number(process.env.JWT_ACCESS_TOKEN_EXP) 
//                 }
//             })
//     } catch (e) {
//         console.log("Error al loguear: ", e);
//         return res.status(404).json({
//             message: "Error al intentar loguear.",
//             error: e
//         });
//     };
// };

// exports.registroOLD = async (req, res) => {
//     const usuario = await Usuario.findOne({ where: { email: req.body.email }})
//     if (usuario) {
//         console.log(usuario);
//       return res.status(400).json({message: "El email ya está en uso."})
//     }

//     bcrypt.hash(req.body.password, Number(process.env.BCRYPT_SALT))
//         .then(hash => {
//             const usuario = new Usuario({
//                 nombre: req.body.nombre,
//                 email: req.body.email,
//                 password: hash
//             });

//             usuario.save()
//                 .then(resp => {
//                     res.status(201).json({
//                         message: "Usuario creado correctamente.",
//                         data: resp
//                     });
//                 })
//                 .catch(e => {
//                     console.log("Error al registrar: ", e);
//                     res.status(500).json({
//                         message: "Error al crear usuario",
//                         error: e
//                     });
//                 });
//         });
// };

// exports.logoutOLD = async (req, res) => {
//     try {
//         // Si recibimos el cookie, se puede hacer de este modo (si no se envia solo a refreshToken)
//         // const refreshTokenDB = await RefreshToken.findOne({ where: { token: req.cookies['refreshToken'] } });
//         // if (refreshTokenDB) {
//         //     RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
//         // }

//         if(req.body.usuario_id) { 
//             RefreshToken.destroy({ where: { usuario_id: req.body.usuario_id } });
//         }

//         // OK aunque no se borre => Al hacer nuevo login, se sobrescribe.
//         return res.status(200).json({
//             message: "Deslogueado correctamente.",
//         });

//     } catch(e) {
//         console.log("Error en Logout: ", e);
//         return res.status(404).json({
//             message: "Error en Logout: ", e,
//         });
//     }
// };

// exports.forgotPasswordOLD = async (req, res) => { 

//     const user = await Usuario.findOne({ where: { email: req.body.email }})
//     if (!user) {
//         return res.status(404).json({
//             message: "Usuario no encontrado."
//         });
//     }

//     // TODO - Tambien se puede hacer crear o actualizar, para ahorrar un query
//     // Si ya existe un token para el usuario, eliminarlo.
//     let existingToken = await ResetToken.findOne({ where: { usuario_id: user.id } });
//     if(existingToken){
//         await existingToken.destroy();
//     }

//     // Generar string/token y hashear
//     let token = crypto.randomBytes(32).toString("hex");
//     const hashedToken = await bcrypt.hash(token, Number(process.env.BCRYPT_SALT));
//     const tokenExpiryDate = new Date(Date.now() + (Number(process.env.RESET_PASS_TOKEN_EXP) * 1000));

//     // Guardar token hasheado en BBDD
//     const resetToken = new ResetToken({
//         usuario_id: user.id,
//         token: hashedToken,
//         expiryDate: tokenExpiryDate
//     })
//     resetToken.save()
//         .catch(e => {
//             console.log("Error al crear token de reseteo de contraseña: ", e);
//             return res.status(500).json({
//                 message: "Error al guardar token",
//                 error: e
//             });
//         });

//     // enviar Email (destinatario, asunto, variables a introducir en template, template)
//     await sendEmail(
//         user.email,
//         "Reset Contraseña",
//         { nombre: user.nombre, link: `${process.env.BASE_URL}/auth/reset-password/${user.id}/${token}` },
//         "./Templates/resetPassword.handlebars"
//     )
//     .then(() => {
//         return res.status(200).json({
//             message: "Email enviado correctamente.",
//         });
//     })
//     .catch(e => {
//         return res.status(500).json({
//             message: "Error al enviar email.",
//             error: e
//         });
//     })
// }

// exports.resetPasswordOLD = async (req, res) => { 

//     let resetToken = await ResetToken.findOne({ where: { usuario_id: req.body.usuario_id, expiryDate: { [Op.gt]: new Date(Date.now()) } } });
//     if(!resetToken ){
//         return res.status(404).json({
//             message: "Token inválido o caducado."
//         });
//     }  

//     const isValidToken = await bcrypt.compare(req.body.token, resetToken.token);
//     if (!isValidToken) {
//         return res.status(404).json({
//             message: "Token inválido."
//         });
//     }

//     const hashedPass = await bcrypt.hash(req.body.password, Number(process.env.BCRYPT_SALT));

//     await Usuario.update({ password: hashedPass }, {
//         where: {
//           id: resetToken.usuario_id
//         }
//     })
//     .then(async () => {
//         // TODO - Enviar email de confirmación
//         await resetToken.destroy();
//         return res.status(200).json({
//             message: "Contraseña actualizada correctamente.",
//         });
//     })
//     .catch(e => {
//         console.log("Error al actualizar la contraseña: ", e);
//         return res.status(500).json({
//             message: "Error al actualizar la contraseña."
//         });
//     })

// }