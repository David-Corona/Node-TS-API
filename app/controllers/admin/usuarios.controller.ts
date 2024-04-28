import { RequestHandler } from 'express';
import usuariosService from '../../services/usuarios.service';


export const findAll: RequestHandler = async (req, res, next) => {
    try {
        const result = await usuariosService.listAll(); //findAndCountAll

        return res.status(200).json({
            message: "Usuarios listados correctamente.",
            data: result,
        });
    } catch(error) {
        next(error);
    }
};