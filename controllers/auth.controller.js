const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require('../models').Usuario;
const RefreshToken = require('../models').UsuarioToken;


exports.registro = (req, res) => {
    const usuario = Usuario.findOne({ where: { email: req.body.email }})
    if (usuario) {
      return res.status(400).json({message: "El email ya está en uso."})
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const usuario = new Usuario({
                nombre: req.body.nombre,
                email: req.body.email,
                password: hash
            });
            console.log(usuario);
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

exports.login = (req, res) => {
    let fetchedUser;
    Usuario.findOne({ where: { email: req.body.email }})
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "Usuario no encontrado."
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(validPass => { // boolean
            if (!validPass) {
                return res.status(401).json({
                    message: "Las credenciales son incorrectas."
                });
            }

            // TODO: se podria exportar
            const accessToken = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser.id },
                process.env.JWT_PRIVATE_KEY,
                { expiresIn: process.env.JWT_ACCESS_TOKEN_EXP } //TODO: cambiar, esto para testeo 
            );
            const refreshToken = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser.id },
                process.env.JWT_PRIVATE_KEY,
                { expiresIn: process.env.JWT_REFRESH_TOKEN_EXP } //TODO: cambiar, esto para testeo, 1m por ejemplo
            );

            let expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + 30); //TODO
            console.log("expiresAt", expiresAt);

            // TODO: Si ya existe, sobrescribir
            // RefreshToken.create({token: refreshToken, usuario_id: fetchedUser.id, expiryDate: expiresAt})
            //     .then(resp => console.log(resp))
            //     .catch(e => console.log(e))

            const values = {
                token: refreshToken,
                expiryDate: expiresAt,
                usuario_id: fetchedUser.id
            };
                
            const options = {
                where: { usuario_id: fetchedUser.id }, // Condition to find the record
                returning: true,                      // To return the updated record
            };
                
            RefreshToken.upsert(values, options)
                .then(([record, created]) => {
                    if (!created) {
                    console.log("Record already existed and was updated:", record.get());
                    } else {
                    console.log("Record created:", record.get());
                    }
                })
                .catch(e => console.log(e));

            // guardar refreshToken en cookie (+seguridad)
            res.status(200)
            .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' }) //secure=true
            // .header('Authorization', accessToken)
            // .send(user);
            .json({
                accessToken: accessToken,
                usuario_id: fetchedUser.id,
                // access_token_expires_in: 60, // TODO: cambiar
                // refresh_token_expires_in: 180 // TODO: cambiar
            })
        })
        .catch(e => {
            console.log("Error al loguear: ", e);
            return res.status(404).json({
                message: "Error al intentar loguear.",
                error: e
            });
        });
};

// TODO: Se está destruyendo/eliminando de la BD en caso de error? y cuando expira?
// Nota: Se usa error 403, para que interceptor de Front no vuelva a llamar a refreshToken
exports.refreshToken = async (req, res) => {

    const refreshToken = req.cookies['refreshToken'];
    console.log("RefreshToken - ", refreshToken);
    if (!refreshToken) {
        return res.status(403).json({
            message: "No se ha adjuntado token de refresco."
        });
    }

    try {
        let refreshTokenDB = await RefreshToken.findOne({ where: { token: refreshToken } });
        console.log("refreshTokenDB - ", refreshTokenDB);
        if(!refreshTokenDB){
            return res.status(403).json({ 
                message: "El token de refresco no se encuentra en la Base de Datos." 
            });
        }

        // TODO: mover al modelo
        // verifyExpiration = (token) => {
        //     return token.expiryDate.getTime() < new Date().getTime();
        //   };

        //   if (verifyExpiration(refreshToken)) {
        //     RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
            
        //     res.status(403).json({
        //       message: "Refresh token was expired. Please make a new signin request",
        //     });
        //     return;
        //   }

        // const decodedToken = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY)
        //     .catch(e => {
        //         RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
        //         return res.status(401).json({
        //             message: "El token de refresco ha expirado.",
        //         });
        //     })
        // console.log("DecodedToken", decodedToken);
        // if(!decodedToken) {
        //     return res.status(403).json({ 
        //         message: "Token de refresco no válido." 
        //     });
        // }

        // TODO refreshToken.expiryDate.getTime()
        if(refreshTokenDB.expiryDate.getTime() < new Date().getTime()){
            console.log("RefreshToken expirado");
            RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
            return res.status(403).json({
                message: "El token de refresco ha expirado.",
            });
        }     

        const usuario = await refreshTokenDB.getUsuario(); 
        // const usuario = Usuario.findOne({ where: { id: refreshTokenDB.id } })
        console.log("Usuario: " + usuario);
        const newAccessToken = jwt.sign(
            { email: usuario.email, userId: usuario.id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXP } //TODO: cambiar, esto para testeo 
        );

        return res.status(200).json({
            accessToken: newAccessToken,
            // refreshToken: refreshToken.token,
            usuario_id: usuario.id,
            // access_token_expires_in: 60 
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
        // const refreshToken = req.cookies['refreshToken'];
        // const refreshTokenDB = await RefreshToken.findOne({ where: { token: refreshToken } });
        // if (refreshTokenDB) {
        //     RefreshToken.destroy({ where: { id: refreshTokenDB.id } });
        // }
        // Ahora no recibimos el cookie, asi que pasamos el usuario_id desde el front
        RefreshToken.destroy({ where: { usuario_id: req.body.usuario_id } });
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