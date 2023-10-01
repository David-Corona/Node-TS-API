const Usuario = require('../models').Usuario;

module.exports = async (req, res, next) => {
    try {
        const usuario = await Usuario.findOne({where: {id: req.usuario_id}});
        if (usuario.role == 'admin') {
            next();
        } else {
            return res.status(403).json({ message: "Sin permisos para acceder" });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Sin permisos" });
    }
};