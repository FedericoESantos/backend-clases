import { UsuarioManager } from "../dao/UsuarioManager.js";

 class UsuariosService{
    constructor(dao){
        this.dao = dao;
    }

    getUsers = async()=>{
        return this.dao.getUsuarios();
    }

    getUsersBy = async(filtro)=>{
        return this.dao.getUsuarioBy(filtro); 
    }

    getUsersByEmail = async(email)=>{
        let usuarios = await this.dao.getUsuarios();
        let usuario = usuarios.find(us=>us.email === email);
        return usuario;
    }

    createUser = async(usuario)=>{
        return this.dao.addUsuario(usuario);
    }

    updateUser = async()=>{
        return this.dao.updateUser();
    }

    deleteUser = async(id)=>{
        return this.dao.deleteUser(id);
    }

}

export const usuariosService = new UsuariosService(new UsuarioManager());