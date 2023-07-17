// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const db = require("../models");
// const Tutorial = db.tutorials;
// const Op = db.Sequelize.Op;

// const Usuario = require("../models/usuario");
const Usuario = require('../models').usuario;



// exports.index = (req, res, next) => {
//     res.status(200).json({
//         message: "Testeando desde usuarios controller",
//         // result: result
//     })
// };


exports.findAll = (req, res) => {
    
    Usuario.findAll() 
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al intentar obtener los usuarios."
            });
        });
};

// exports.createUser = (req, res, next) => {
//   bcrypt.hash(req.body.password, 10)
//     .then(hash => {
//       const user = new User({
//         email: req.body.email,
//         password: hash
//       });
//       user.save()
//         .then(result => {
//           res.status(201).json({
//             message: "User created!",
//             result: result
//           })
//           .catch(err => {
//             res.status(500).json({
//               message: "Invalid authentication credentials!"
//             });
//           });
//         });
//     });
// }

// exports.userLogin = (req, res, next) => {
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
//     .then(result => { // result will be true/false depending on previous compare
//       if (!result) {
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
// }

