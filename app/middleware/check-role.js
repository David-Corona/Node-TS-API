const Usuario = require('../models').Usuario;

module.exports = async (req, res, next) => {
    try {
        let usuario;
        if(req.body.usuario_id){
            usuario = await Usuario.findOne({where: {id: req.body.usuario_id}});
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