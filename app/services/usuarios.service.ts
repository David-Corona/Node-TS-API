import Usuario from '../models/usuario.model';
import { ErrorHandler } from '../helpers/error';


class UsuariosService {

  async listAll() {
    try {
      const usuarios = await Usuario.findAll();
      return usuarios;
    } catch(error: any) {
      throw new ErrorHandler(500, "Error al listar usuarios", error.message)
    }
  }

  
}

export default new UsuariosService();