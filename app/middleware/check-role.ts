import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../helpers/types';
import Usuario from '../models/usuario.model'


export const checkRole = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
        let usuario;
        if(req.usuario_id){
            usuario = await Usuario.findOne({where: {id: req.usuario_id}});
        } else if (req.body.email){
            usuario = await Usuario.findOne({where: {email: req.body.email}});
        }
        
        if (usuario && usuario.role == 'admin') {
            next();
        } else {
            return res.status(403).json({ message: "Sin permisos para acceder" });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Sin permisos" });
    }
};