const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require('../models').usuario;


exports.registro = (req, res) => {
    const usuario = Usuario.findOne({ email: req.body.email });
    if (usuario) {
      return res.status(400).json({message: "El email ya está en uso."});
    }

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
                { email: fetchedUser.email, userId: fetchedUser.id },
                process.env.JWT_PRIVATE_KET,
                { expiresIn: "1h" } // TODO: tiempo?
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600, // TODO: tiempo?
                usuario_id: fetchedUser.id
            })
        })
        .catch(e => {
            return res.status(404).json({
                message: "Error al intentar loguear.",
                error: e
            });
        });
};
