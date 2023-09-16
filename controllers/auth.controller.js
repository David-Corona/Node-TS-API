const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");

const Usuario = require('../models').Usuario;
const RefreshToken = require('../models').UsuarioToken;
const ResetToken = require('../models').UsuarioResetPassword;

const sendEmail = require('../app/utils/Emails/sendEmail');

const bcryptSalt = process.env.BCRYPT_SALT;


exports.registro = (req, res) => {
    const usuario = Usuario.findOne({ where: { email: req.body.email }})
    if (usuario) {
      return res.status(400).json({message: "El email ya está en uso."})
    }

    bcrypt.hash(req.body.password, Number(bcryptSalt))
        .then(hash => {
            const usuario = new Usuario({
                nombre: req.body.nombre,
                email: req.body.email,
                password: hash
            });

            usuario.save()
                .then(resp => {
                    res.status(201).json({
                        message: "Usuario creado correctamente.",
                        result: resp
                    });
                })
                .catch(e => {
                    console.log("Error al registrar: ", e);
                    res.status(500).json({
                        message: "Error al crear usuario",
                        error: e
                    });
                });
        });
};

exports.login = async (req, res) => {  
    try {
        const user = await Usuario.findOne({ where: { email: req.body.email }})
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado."
            });
        }

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            return res.status(401).json({
                message: "Las credenciales son incorrectas."
            });
        }

        const accessToken = jwt.sign(
            { email: user.email, userId: user.id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXP) } 
        );
        const refreshToken = jwt.sign(
            { email: user.email, userId: user.id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXP) } 
        );

        // Date.now() + milisegundos
        const refreshTokenExpiryDate = new Date(Date.now() + (Number(process.env.JWT_REFRESH_TOKEN_EXP) * 1000));
        // let expiryDate = new Date();
        // expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn); 

        // Insertar o actualizar (si existe) refresToken en BBDD.
        const values = {
            token: refreshToken,
            expiryDate: refreshTokenExpiryDate,
            usuario_id: user.id
        };
        const options = {
            where: { usuario_id: user.id },
            //returning: true,
        };
        RefreshToken.upsert(values, options)
            .catch(e => console.log(e));

        // res.cookie: http://expressjs.com/es/api.html#res.cookie
        res.status(200)
            .cookie(
                'refreshToken', 
                refreshToken, 
                { 
                    httpOnly: true,
                    sameSite: 'strict', //sameSite: 'None'
                    // expires: Date - Fecha expiración en GMT (Si no se incluye, caduca con la sesión).
                    expires: refreshTokenExpiryDate,
                    // maxAge: 30 * 1000 // Tiempo expiración en milisegundos
                    // secure=true // secure=true => Cookie sólo para HTTPS
                }
            ) 
            // .header('Authorization', accessToken)
            .json({
                accessToken: accessToken,
                usuario_id: user.id,
                // access_token_expires_in: Number(process.env.JWT_ACCESS_TOKEN_EXP) 
            })
    } catch (e) {
        console.log("Error al loguear: ", e);
        return res.status(404).json({
            message: "Error al intentar loguear.",
            error: e
        });
    };
};

// Se usa error 403, para que interceptor de Front no vuelva a llamar a refreshToken (llama cuando hay error 401).
exports.refreshToken = async (req, res) => {

    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
        return res.status(403).json({
            message: "No se ha adjuntado token de refresco."
        });
    }

    try {
        let refreshTokenDB = await RefreshToken.findOne({ where: { token: refreshToken } });
        if(!refreshTokenDB){
            return res.status(403).json({ 
                message: "El token de refresco no se encuentra en la Base de Datos." 
            });
        }

        // Comprobar expiración según expiryDate en BBDD
        if(refreshTokenDB.expiryDate.getTime() < new Date().getTime()) {
            RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
            return res.status(403).json({
                message: "El token de refresco ha expirado.",
            });
        }     

        const usuario = await refreshTokenDB.getUsuario(); // getUsuario() función de sequelize (por la relación)
        // const usuario = Usuario.findOne({ where: { id: refreshTokenDB.id } })
        const newAccessToken = jwt.sign(
            { email: usuario.email, userId: usuario.id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXP) }
        );

        return res.status(200).json({
            accessToken: newAccessToken,
            usuario_id: usuario.id,
            // access_token_expires_in: Number(process.env.JWT_ACCESS_TOKEN_EXP)
        });

    } catch(e) {
        console.log("RefreshToken error: ", e);
        return res.status(500).json({
            message: "Error en token de refresco.",
            error: e 
        });
    }
};

exports.logout = async (req, res) => {
    try {
        // Si recibimos el cookie, se puede hacer de este modo (si no se envia solo a refreshToken)
        // const refreshTokenDB = await RefreshToken.findOne({ where: { token: req.cookies['refreshToken'] } });
        // if (refreshTokenDB) {
        //     RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
        // }

        if(req.body.usuario_id) { 
            RefreshToken.destroy({ where: { usuario_id: req.body.usuario_id } });
        }

        // OK aunque no se borre => Al hacer nuevo login, se sobrescribe.
        return res.status(200).json({
            message: "Deslogueado correctamente.",
        });

    } catch(e) {
        console.log("Error en Logout: ", e);
        return res.status(404).json({
            message: "Error en Logout: ", e,
        });
    }
};

// TODO - manejar mejor errores
exports.forgotPassword = async (req, res) => { 

    const user = await Usuario.findOne({ where: { email: req.body.email }})
    if (!user) {
        return res.status(404).json({
            message: "Usuario no encontrado."
        });
    }

    // TODO - Tambien se puede hacer crear o actualizar, para ahorrar un query
    // Si ya existe un token para el usuario, eliminarlo.
    let existingToken = await ResetToken.findOne({ where: { usuario_id: user.id } });
    if(existingToken){
        await existingToken.destroy();
    }

    // Generar string/token y hashear
    let token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, Number(bcryptSalt));
    const tokenExpiryDate = new Date(Date.now() + (Number(process.env.RESET_PASS_TOKEN_EXP) * 1000));

    // Guardar token hasheado en BBDD
    const resetToken = new ResetToken({
        usuario_id: user.id,
        token: hashedToken,
        expiryDate: tokenExpiryDate
    })
    resetToken.save()
        .catch(e => {
            console.log("Error al crear token de reseteo de contraseña: ", e);
            return res.status(500).json({
                message: "Error al guardar token",
                error: e
            });
        });

    // enviar Email (destinatario, asunto, variables a introducir en template, template)
    await sendEmail(
        user.email,
        "Reset Contraseña",
        { nombre: user.nombre, link: `${process.env.BASE_URL}/auth/reset-password/${user.id}/${token}` },
        "./Templates/resetPassword.handlebars"
    )
    .then(() => {
        return res.status(200).json({
            message: "Email enviado correctamente.",
        });
    })
    .catch(e => {
        return res.status(500).json({
            message: "Error al enviar email.",
            error: e
        });
    })
}

exports.resetPassword = async (req, res) => { 

    let resetToken = await ResetToken.findOne({ where: { usuario_id: req.body.usuario_id, expiryDate: { [Op.gt]: new Date(Date.now()) } } });
    if(!resetToken ){
        return res.status(404).json({
            message: "Token inválido o caducado."
        });
    }  

    const isValidToken = await bcrypt.compare(req.body.token, resetToken.token);
    if (!isValidToken) {
        return res.status(404).json({
            message: "Token inválido."
        });
    }

    const hashedPass = await bcrypt.hash(req.body.password, Number(bcryptSalt));

    await Usuario.update({ password: hashedPass }, {
        where: {
          id: resetToken.usuario_id
        }
    })
    .then(async () => {
        // TODO - Enviar email de confirmación
        await resetToken.destroy();
        return res.status(200).json({
            message: "Contraseña actualizada correctamente.",
        });
    })
    .catch(e => {
        console.log("Error al actualizar la contraseña: ", e);
        return res.status(500).json({
            message: "Error al actualizar la contraseña."
        });
    })

}