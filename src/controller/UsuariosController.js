import { generaHash } from '../utils.js';
import { isValidObjectId } from 'mongoose';
import { usuariosService } from '../service/Usuario.service.js';
import { Tipos_Error } from '../errors/Errors.js';
import { CustomError } from '../errors/CustomError.js';

import { logger } from '../utils/winston.js';

import { CartController } from './CartController.js';
import { cartsService } from '../service/Carts.service.js';

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
            return CustomError.generarError("Error cartController", "faltan datos", `Faltan completar datos`, Tipos_Error.Codigo_http);
        }

        if (!name || !email || !last_name || !password) {
            const errorMessage = "Faltan completar algunos campos";
            res.setHeader(`Content-Type`, `application/json`);
                return res.status(400).json({ error: errorMessage });

        }

        let existe;
        
        try {
            existe = await usuariosService.getUsersByEmail({ email });
            if (existe) {
                return res.status(400).json({ error: `Ya existe ${email} en la base de datos` });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
        let nuevoUsuario;
        let nuevoCarrito;
        try {
            nuevoCarrito = await cartsService.create({producto: []});
            nuevoUsuario = await usuariosService.createUser({ name, email, last_name, password: generaHash(password), rol: "user", carrito: nuevoCarrito._id });
            return res.status(201).json({ payload: nuevoUsuario });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static updateUsers = async (req, res) => {
        let { id } = req.params;
        let updates = req.body;  

        if (!isValidObjectId(id)) {
            return CustomError.generarError("Error cartController", "usuario invalido", `Ingrese un ID valido de Mongoose`, Tipos_Error.Codigo_http);
        }

        let usuarioActualizado;
        
        try {
            usuarioActualizado = await usuariosService.updateUser({ _id: id }, updates);
            if (!usuarioActualizado) {
                return CustomError.generarError("Error usuarioController", "Usuario no encontrado", `No se encontró el usuario con ID: ${id}`, Tipos_Error.Codigo_http);
            }
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: error.message });
        }
        
        res.setHeader(`Content-Type`, `application/json`);
        return res.status(200).json({ payload: 'Usuario actualizado', usuarioActualizado });

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

        let resultado;
        try {
            resultado = await usuariosService.deleteUser({_id:id});
        } catch (error) {
            console.log('error');
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: error.message });
        }
        let usuarios = await usuariosService.getUsers();
        res.setHeader(`Content-Type`, `application/json`);
        return res.status(200).json({ payload: 'usuario eliminado' });
    }

}