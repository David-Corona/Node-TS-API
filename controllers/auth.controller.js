const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require('../models').usuario;


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
                process.env.JWT_PRIVATE_KET,
                { expiresIn: "1m" } //TODO: cambiar, esto para testeo 
            );
            const refreshToken = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser.id },
                process.env.JWT_PRIVATE_KET,
                { expiresIn: "3m" } //TODO: cambiar, esto para testeo, 1m por ejemplo
            );

            // guardar refreshToken en cookie (+seguridad)
            res.status(200)
            .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' }) //secure=true
            // .header('Authorization', accessToken)
            // .send(user);
            .json({
                accessToken: accessToken,
                usuario_id: fetchedUser.id,
                access_token_expires_in: 60, // TODO: cambiar
                refresh_token_expires_in: 180 // TODO: cambiar
            })
        })
        .catch(e => {
            console.log("Error al loguar: ", e);
            return res.status(404).json({
                message: "Error al intentar loguear.",
                error: e
            });
        });
};
