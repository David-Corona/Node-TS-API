import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ExtendedRequest } from '../helpers/types';
const { TokenExpiredError } = jwt;


export const checkAuth = async (req: ExtendedRequest, res: Response, next: NextFunction) => {

  // Only check accessToken => If 401 returned, the interceptor of frontend will call refreshToken.
  const accessToken = req.headers.authorization?.split(" ")[1]; // Bearer xxxxtokenxxxx
  if (!accessToken) { 
    return res.status(401).json({message: "No Autenticado: Access Token no encontrado."});
  }

  jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY as string, (err: any, decoded: any) => {
    if (err) {
      return catchError(err, res);
    }
    req.usuario_id = decoded.userId;
    next();
  });
}

const catchError = (err: Error, res: Response) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "No Autenticado: Acces Token expirado." });
  }
  return res.status(401).send({ message: "No Autenticado; Access Token inválido." });
}