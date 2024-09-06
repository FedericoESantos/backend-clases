import { Tipos_Error } from '../utils/Errors.js';
import { productService } from '../service/Product.service.js';
import { logger } from '../utils/winston.js';
import { isValidObjectId } from 'mongoose';

export class ProductController {

    static getAll = async (req, res) => {
        let productos;

        try {
            productos = await productService.getAll();
        } catch (error) {
            console.log('error');
            res.setHeader('Content-Type', 'application/json');
            return logger.error(error.message);
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productos });
    }

    static getBy = async (req, res) => {
        let { id } = req.params;
        
        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error:"ID Producto Inválido"});
        }
        let producto = await productService.getProductBy({_id:id});
        if(!producto){
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error:`No existe producto con ID:${id}`});
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({payload: producto});
    }

    static create = async (req, res) => {
        let { name, description,image, stock, price, web, category } = req.body;

        if (req.file){   
            image = req.file;
    }

        if (!name || !description || !stock || !price ) {
            if (web) {
                return res.redirect("/cargaProductos?error=faltan completar algunos campos")
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'Faltan completar algunos campos' });
            }
        }

        let existe;
        let owner;
        try {
            existe = await productService.getProductBy({ name });
            if (existe) {
                res.setHeader(`Content-Type`, `application/json`);
                return res.status(400).json({error:`Ya existe ${name} en la base de datos`});
            }

        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.json({error:error.message});
        }

        let nuevoProducto;

        try {
            nuevoProducto = await productService.create({ image:`./img/products/${req.file.originalname}`, name, description, category, stock, price });
            req.io.emit("nuevoProd", nuevoProducto);
            if (web) {
                return res.redirect(`/cargaProductos`);
            } else {
                console.log(nuevoProducto);
                res.setHeader(`Content-Type`, `application/json`);
                return res.status(200).json({ nuevoProducto });
            }
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.json({error:error.message});
        }
    }

    static delete = async (req, res) => {
        let { id } = req.params;
        
        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json');
            return res.json({error:'ID debe ser un ObjectId Válido'});
        }

        let productoEliminado;
        try {
            productoEliminado = await productService.deleteProd({ _id: id });
        } catch (error) {
            console.log('error');
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error:error.message});
        }

        let productos = await productService.getAll();
        req.io.emit('productoBorrado', productos);

        res.setHeader(`Content-Type`, `application/json`);
        res.status(200).json({ payload: 'producto eliminado' });
    }

}