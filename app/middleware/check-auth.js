import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const { TokenExpiredError } = jwt;

export const checkAuthMiddleware = async (req, res, next) => {
  // TODO - ¿Devolver 401 para que Front llame a refreshToken o llamar desde aquí?
  // Comprueba sólo accessToken => Al devolver 401, interceptor de front llamará a refreshToken.
  const accessToken = req.headers.authorization?.split(" ")[1]; // Bearer sfdsfstoken
  if (!accessToken) { 
    return res.status(401).json({message: "No Autenticado: Access Token no encontrado."});
  }

  jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.usuario_id = decoded.userId; // TODO - añadir usuario_id al request
    console.log("Usuario ID: ", req.usuario_id);
    next();
  });
}

// const catchError = (err: Error, res: Response) => { 
const catchError = (err, res) => { 
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "No Autenticado: Acces Token expirado." });
  }
  return res.status(401).send({ message: "No Autenticado; Access Token inválido." });
}