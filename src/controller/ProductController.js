import { CustomError } from '../errors/CustomError.js';
import { Tipos_Error } from '../errors/Errors.js';
import { productService } from '../service/Product.service.js';
import { logger } from '../utils/winston.js';
import { isValidObjectId } from 'mongoose';

export class ProductController {

    static getAll = async (req, res) => {
        let productos;

        try {
            productos = await productService.getAll();
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ productos });
        } catch (error) {
            console.log('error');
            res.setHeader('Content-Type', 'application/json');
            return logger.error(error.message);
        }

    }

    static getBy = async (req, res) => {
        let { id } = req.params;

        if (!isValidObjectId(id)) {
            return CustomError.generarError("Error productController", "ID producto invalido", "ID Producto Inválido", Tipos_Error.Codigo_http);
        }
        let producto = await productService.getProductBy({ _id: id });
        if (!producto) {
            return CustomError.generarError("Error productController", "producto inexistente", `No existe producto con ID:${id}`, Tipos_Error.Codigo_http);
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: producto });
    }

    static create = async (req, res) => {
        let { name, description, image, stock, price, web, category } = req.body;
    
        if (req.file) {
            image = req.file;
        }
    
        if (!name || !description || !stock || !price || !category) {
            const errorMessage = "Faltan completar algunos campos";
            if (web) {
                return res.status(400).json({ error: errorMessage });
            } else {
                return res.status(400).json({ error: errorMessage });
            }
        }
    
        let existe;
        try {
            existe = await productService.getProductBy({ name });
            if (existe) {
                return res.status(400).json({ error: `Ya existe ${name} en la base de datos` });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    
        let nuevoProducto;
        try {
            nuevoProducto = await productService.create({ image: `./img/products/${req.file.originalname}`, name, description, category, stock, price });
            req.io.emit("nuevoProd", nuevoProducto);
            return res.status(201).json({ nuevoProducto });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }
    

    static update = async (req, res) => {
        let { id } = req.params;
        let updates = req.body;  

        if (!isValidObjectId(id)) {
            return CustomError.generarError("Error productController", "ID producto invalido", "ID Producto Inválido", Tipos_Error.Codigo_http);
        }

        let productoActualizado;
        try {
            productoActualizado = await productService.update({ _id: id }, updates);

            if (!productoActualizado) {
                return CustomError.generarError("Error productController", "Producto no encontrado", `No se encontró el producto con ID: ${id}`, Tipos_Error.Codigo_http);
            }
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: error.message });
        }

        let productos = await productService.getAll();
        req.io.emit('productoActualizado', productos);

        res.setHeader(`Content-Type`, `application/json`);
        return res.status(200).json({ payload: 'Producto actualizado', productoActualizado });

    }

    static delete = async (req, res) => {
        let { id } = req.params;
        if (!isValidObjectId(id)) {
            return CustomError.generarError("Error productController", "ID producto invalido", "ID Producto Inválido", Tipos_Error.Codigo_http);
        }

        let productoEliminado;
        try {
            productoEliminado = await productService.deleteProd({ _id: id });
        } catch (error) {
            console.log('error');
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: error.message });
        }

        let productos = await productService.getAll();
        req.io.emit('productoBorrado', productos);

        res.setHeader(`Content-Type`, `application/json`);
        res.status(200).json({ payload: 'producto eliminado' });
    }

}