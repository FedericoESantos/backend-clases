import { usuarioModel } from "./models/usuarioModels.js";

export class UsuariosManagerMONGO{

    async create(usuario){
        let nuevoUsuario = await usuarioModel.create(usuario);
        return nuevoUsuario.toJSON();
    }

    async getBy(filtro={}){
        return await usuarioModel.findOne(filtro).lean();
    }


}