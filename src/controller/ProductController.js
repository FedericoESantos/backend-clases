import { CustomError } from '../errors/CustomError.js';
import { argumentosProductos } from '../errors/errorProductos.js';
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
            CustomError.createError("ID invalido", argumentosProductos(req.params),"ID invalido", Tipos_Error.Argumentos_invalidos);
        }
        let producto = await productService.getProductBy({ _id: id });
        if (!producto) {
            CustomError.createError("Argumentos Inexistentes", argumentosProductos(req.params),"producto inexistente", Tipos_Error.Argumentos_invalidos);
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: producto });
    }

    static create = async (req, res) => {
        let { name, description, image, stock, price, category, web } = req.body;
            
        if (req.file) {
            image = req.file;
        }

        if (!name || !description || !stock || !price || !category) {
            if (web) {
                return res.redirect("/cargaProductos?error=Faltan completar algunos campos")
            }
            CustomError.createError("Argumentos Faltantes", argumentosProductos(req.body),"complete las propiedades faltantes", Tipos_Error.Argumentos_invalidos);
        }

        let existe;
        try {
            existe = await productService.getProductBy({ name });
            if (existe) {
                if (web) {
                    return res.redirect("/cargaProductos?error=Ya existe el producto en la base de datos")
                }
                CustomError.createError("Argumentos ya existentes", argumentosProductos(req.body),"Ya existe el producto en la base de datos", Tipos_Error.Tipos_de_datos);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }

        let nuevoProducto;
        try {
            nuevoProducto = await productService.create({ image: `./img/products/${req.file.originalname}`, name, description, category, stock, price });
            req.io.emit("nuevoProd", nuevoProducto);
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return logger.error(error.message);
        }
        if (web) {
            return res.redirect("/productos"); 
        }
        
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ nuevoProducto });
    }


    static update = async (req, res) => {
        let { id } = req.params;
        let updates = req.body;

        if (!isValidObjectId(id)) {
            CustomError.createError("ID invalido", argumentosProductos(req.params),"ID invalido", Tipos_Error.Argumentos_invalidos);
        }

        let productoActualizado;
        try {
            productoActualizado = await productService.update({ _id: id }, updates);

            if (!productoActualizado) {
                CustomError.createError("Argumentos Inexistentes", argumentosProductos(req.params),"producto inexistente", Tipos_Error.Argumentos_invalidos);
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
            CustomError.createError("ID invalido", argumentosProductos(req.params),"ID invalido", Tipos_Error.Argumentos_invalidos);
        }

        let productoEliminado;
        try {
            productoEliminado = await productService.deleteProd({ _id: id });
        } catch (error) {
            console.log('error');
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: error.message });
        }

        let productos = await productService.getAll();
        req.io.emit('productoBorrado', productos);

        res.setHeader(`Content-Type`, `application/json`);
        res.status(200).json({ payload: 'producto eliminado' });
    }

}