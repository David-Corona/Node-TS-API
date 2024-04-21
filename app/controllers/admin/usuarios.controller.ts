const Usuario = require('../../models').Usuario;
const usuariosService = require('../../services/usuarios.service');

export const findAll: CustomRequestHandler = async (req, res, next) => {
    try {
        const result = await usuariosService.listAll();

        return res.status(200).json({
            message: "Usuarios listados correctamente.",
            data: result,
        });
    } catch(error) {
        next(error);
    }
};



