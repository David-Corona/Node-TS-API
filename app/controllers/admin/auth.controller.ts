import authService from '../../services/auth.service';
import { RequestHandler } from 'express';


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