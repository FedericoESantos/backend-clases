import { generaHash } from '../utils.js';
import { isValidObjectId } from 'mongoose';
import { usuariosService } from '../service/Usuario.service.js';
import { Tipos_Error } from '../errors/Errors.js';
import { CustomError } from '../errors/CustomError.js';

import { logger } from '../utils/winston.js';

export class UsuariosController {

    static getUsers = async (req, res) => {
        let usuarios;
        try {
            usuarios = await usuariosService.getUsers();
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(200).json({ usuarios });
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return logger.error(error.message);
        }
    }

    static getUsersBy = async (req, res) => {
        let { id } = req.params;
        if (!isValidObjectId(id)) {
            return CustomError.generarError("Error cartController", "usuario invalido", `Ingrese un ID valido de Mongoose`, Tipos_Error.Codigo_http);
        }
        let usuario;
        try {
            usuario = await usuariosService.getUsersBy({ _id: id });
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(200).json({ usuario });
        } catch (error) {
            console.log(error.message);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({error:error.message});
        }
    }

    static createUsers = async (req, res) => {
        let { name, email, last_name, password } = req.body;
        if (!name || !last_name || !email || !password) {
            res.setHeader(`Content-Type`, `application/json`);
            return logger.debug("Faltan datos: Nombre, Apellido, Email Y Password");
        }

        let existe;
        try {
            existe = await usuariosService.getUsersByEmail({ email });
            if (existe) {
                return CustomError.generarError("Error cartController", "carrito existente", `El usuario con email ${email} ya existe en la base de datos`, Tipos_Error.Codigo_http);
            }
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return logger.error(error.message);
        }

        try {
            let nuevoUsuario = await usuariosService.createUser({ id, name, email, last_name, password: generaHash(password), rol: "user" });
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(200).json({ payload: nuevoUsuario });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return logger.error(error.message);
        }
    }

    static updateUsers = async (req, res) => {
        let { id } = req.params;
        if (!isValidObjectId(id)) {
            return CustomError.generarError("Error cartController", "usuario invalido", `Ingrese un ID valido de Mongoose`, Tipos_Error.Codigo_http);
        }

        let aModificar = req.body;

        if (aModificar._id) {
            delete aModificar._id;
        }

        if (aModificar.email) {
            let existe;
            try {
                existe = await usuariosService.getUsersBy({ _id: { $ne: id }, email: aModificar.email });
                if (existe) {
                    return CustomError.generarError("Error cartController", "usuario ya existente", `El usuario con email ${aModificar.email} ya existe en la base de datos`, Tipos_Error.Codigo_http);
                }
            } catch (error) {
                console.log(error);
                res.setHeader('Content-Type', 'application/json');
                return logger.error(error.message);
            }
        }

        try {
            let usuarioModificado = await usuariosService.updateUser(id, aModificar);
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(200).json({ usuarioModificado });
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return logger.error(error.message);
        }
    }

    static updateUserPremium = async (req,res) =>{
            let { uid } = req.params;
        
            if (!isValidObjectId(uid)) {
                return CustomError.generarError("Error cartController", "usuario invalido", `Ingrese un ID valido de Mongoose`, Tipos_Error.Codigo_http);
            }
        
            try {
                let usuario = await usuariosService.getUsersBy({ _id: uid });
                if (!usuario) {
                    return CustomError.generarError("Error cartController", "usuario inexistente", `Usuario no encontrado`, Tipos_Error.Codigo_http);
                }
                usuario.rol = usuario.rol === "premium" ? "user" : "premium";
                await usuariosService.updateUser(uid, { rol: usuario.rol });
                return res.status(200).json({ message: `Rol del usuario actualizado a ${usuario.rol}` });
            } catch (error) {
                console.log(error);
                return logger.error(error.message);
            }

    }

    static deleteUsers = async (req, res) => {
        let { id } = req.params;
        if (!isValidObjectId(id)) {
            return CustomError.generarError("Error cartController", "usuario invalido", `Ingrese un ID valido de Mongoose`, Tipos_Error.Codigo_http);
        }

        try {
            let resultado = await usuariosService.deleteUser(id);
            if (resultado.deletedCount > 0) {
                res.setHeader(`Content-Type`, `application/json`);
                return logger.debug({ payload: `Usuario con ID ${id} eliminado` });
            } else {
                return CustomError.generarError("Error cartController", "usuario inexistente", `No existen usuarios con id ${id}`, Tipos_Error.Codigo_http);
            }
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return logger.error(error.message);
        }
    }

}