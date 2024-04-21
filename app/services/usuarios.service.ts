import { Usuario } from '../models';
import { ErrorHandler } from '../helpers/error';
// const Usuario = require('../models').Usuario;
// const { ErrorHandler } = require('../helpers/error')



class UsuariosService {

  async listAll() {
    try {
      // const usuario = await Usuario.findOne({ where: { email }})
      const usuarios = await Usuario.findAll()
      return usuarios;

    } catch(error: any) {
      throw new ErrorHandler(500, "Error al listar usuarios", error.message)
    }
  }

  
}

// module.exports = new UsuariosService();
export default new UsuariosService();
