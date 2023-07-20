const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const Op = db.Sequelize.Op;
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

exports.login = (req, res, next) => {



//   let fetchedUser;
//   User.findOne({ email: req.body.email})
//     .then(user => {
//       if (!user) { // if user doesn't exist, undefined
//         return res.status(401).json({
//           message: "Auth failed!"
//         });
//       }
//       fetchedUser = user;
//       return bcrypt.compare(req.body.password, user.password); // compare password is correct
//     })
//     .then(validPass => { // result will be true/false depending on previous compare
//       if (!validPass) {
//         return res.status(401).json({
//           message: "Auth failed, incorrect credentials."
//         });
//       }
//       const token = jwt.sign( // creates new token
//         { email: fetchedUser.email, userId: fetchedUser._id},
//         process.env.JWT_KEY, // string used to hash, should be a very long string
//         { expiresIn: "1h"}
//       );
//       res.status(200).json({
//         token: token,
//         expiresIn: 3600,
//         userId: fetchedUser._id
//       })
//     })
//     .catch(err => {
//       return res.status(401).json({
//         message: "Invalid authentication credentials!"
//       });
//     })

}
