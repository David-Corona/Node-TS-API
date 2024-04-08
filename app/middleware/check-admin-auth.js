const Usuario = require('../models').Usuario;

module.exports = async (req, res, next) => {
    try {
        // TODO: Service - isAdmin(req.body.email)
        const usuario = await Usuario.findOne({ where: { email: req.body.email } });
        if (usuario && usuario.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: "No autorizado." });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Error en la autenticación." });
    }
};