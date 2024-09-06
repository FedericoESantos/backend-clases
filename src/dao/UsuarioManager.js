import { usuariosModelo } from "./models/usuariosModelo.js";

export class UsuarioManager{

    async getUsuarios(){
        return await usuariosModelo.find().lean();
    }

    async getAllPaginate(page=1){
        return await usuariosModelo.paginate({}, {limit:10, page, lean:true});
    }

    async addUsuario(usuario){
        let nuevoUsuario = await usuariosModelo.create(usuario);
        return nuevoUsuario.toJSON();
    }

    async getUsuarioByEmail(email){
        return await usuariosModelo.findOne(email);
    }

    async getUsuarioBy(filtro){
        return await usuariosModelo.findOne(filtro).lean();//.populate("carrito") y le agregue .lean()
    }

    async updateUser(id, usuario){
        return await usuariosModelo.findByIdAndUpdate(id, usuario, {runValidators:true, returnDocument:"after"});
    }

    async deleteUser(id){
        return await usuariosModelo.deleteOne({_id:id});
    }

}