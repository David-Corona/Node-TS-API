const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require('../models').usuario;


exports.registro = (req, res) => {
    // TODO: Comprobar email ya está en uso => throw new exception o return res.status(400).json().end()?
    bcrypt.hash(req.body.password, 10)
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
                    res.status(500).json({
                        message: "Error al crear usuario",
                        error: e
                    });
                });
        });
};

exports.login = (req, res) => {
    let fetchedUser;
    Usuario.findOne({ email: req.body.email })
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
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                "secret_or_private_key_provisional_a_modificar_y_agregar_a_env", // TODO: mover a env
                { expiresIn: "1h" } // TODO: tiempo?
            );
            return res.status(200).json({
                token: token,
                expiresIn: 3600, // TODO: tiempo?
                usuario_id: fetchedUser._id
            })
        })
        .catch(e => {
            return res.status(404).json({
                message: "Error al intentar loguear.",
                error: e
            });
        });
};
