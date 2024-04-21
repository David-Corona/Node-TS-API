import authService from '../../services/auth.service';
import { RequestHandler } from 'express';
// const { ErrorHandler } = require('../../helpers/error')
// const RefreshToken = require('../../models').UsuarioToken;
// const INVALID_REF_TOKEN = "invalid-refreshtoken";


export const registro: RequestHandler = async (req, res, next) => {
  try {
      const { nombre, email, password } = req.body;
      const response = await authService.register(nombre, email, password, "admin", false);
      return res.status(201).json({
          message: "Usuario creado correctamente.",
          data: response,
        });
  } catch(error) {
      next(error);
  }
};

// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // TODO - Done from Middleware checkRole, so maybe reuse non admin

//     // const isAdmin = await authService.isAdmin(email);
//     // if (!isAdmin) {
//     //   throw new ErrorHandler(403, "No autorizado.", "No corresponde a un usuario admin")
//     // }

//     const result = await authService.login(email, password);

//     res.status(200)
//     .cookie("refreshToken", result.refreshToken, {
//       httpOnly: true,
//       sameSite: "strict",
//       expires: result.refreshTokenExpiryDate,
//     })
//     .json({
//       message: "Logueado correctamente.",
//       data: {
//         accessToken: result.accessToken,
//         usuario_id: result.userId,
//         usuario_rol: result.userRole,
//         expires_in: result.expiresIn
//       },
//     });

//   } catch(error) {
//     next(error);
//   }
// };

// exports.refreshToken = async (req, res, next) => {
//   try {
//     const refreshToken = req.cookies['refreshToken'];
//     if (!refreshToken) {
//       throw new ErrorHandler(401, "No se ha adjuntado token de refresco.", INVALID_REF_TOKEN)
//     }

//     const result = await authService.refreshToken(refreshToken);

//     return res.status(200).json({
//       message: "Nuevo accessToken generado correctamente.",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.logout = async (req, res, next) => {
//   try {
//       if(req.body.usuario_id) { 
//           RefreshToken.destroy({ where: { usuario_id: req.body.usuario_id } });
//       }
//       // OK aunque no se borre => Al hacer nuevo login, se sobrescribe.
//       return res.status(200).json({
//           message: "Deslogueado correctamente.",
//       });
//   } catch(error) {
//       next(error);
//   }
// };



// // TODO
// exports.forgotPassword = async (req, res, next) => {}
// exports.resetPassword = async (req, res, next) => {}