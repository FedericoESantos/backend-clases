import { request, response } from "express"; // aca exportamos las propiedades del request y responde del express

import { isValidObjectId } from 'mongoose';
import { ProductManager } from "../dao/ProductManager.js";

const productManager = new ProductManager();
const req = request;
const res = response;

// Para llamar a todos los productos
export const getProducts = async (req, res) => {

    try {
        let productos = await productManager.getAll();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productos });
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde`,
                detalle: `${error.message}`
            }
        )
    }
}

// Para llamar a todos los productos por su ID de mongo

export const getProductById = async (req, res) => {
    let { id } = req.params;
    if (!isValidObjectId(id)) { // si el objeto Id de la base de datos no es valido
        return res.status(400).json({ error: 'Ingrese un ID valido de Mongo DB' });
    }
    try {
        let producto = await productManager.getProductBy({ _id: id });
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ producto });
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde`,
                detalle: `${error.message}`
            }
        )
    }
}

// Para crear un producto 

export const addProduct = async (req, res) => {
    let { description, code, price, stock } = req.body; // aca llamamos a todos los items requeridos desde el body
    if (!description || !code || !price) {
        return res.status(400).json({ error: `Faltan datos: Complete campos obligatorios!!!` });
    }

try {
        
        let nuevoProducto = await productManager.createProduct({ description, code, price}); // si el stock es undefines me completa con 0
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ nuevoProducto });

    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde`,
                detalle: `${error.message}`
            }
        )
    }
}

// Para borrar un producto 

export const deleteProduct = async (req, res) => {
    let { id } = req.params; // llamamos a los productos por su id
    try {
        let resultado = await productManager.deleteProduct(id); // borra a los productos por su id
        if (resultado) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ resultado });
        }
    } catch (error) {
        throw new Error(error);
    }
}

// Para borrar un producto 

export const updateProduct = async (req, res) => {
    try {
        let { pid } = req.params; // aca llama a cualquier parametro luego del endpoint
        let { id, ...rest } = req.body; // aca llaman a todos lo que venga del body
        let producto = await productManager.updateProduct(pid, { ...rest }, { new: true });
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ producto });
    } catch (error) {
        console.log('updateProduct ->', error);
        return res.status(500).json({ msg: 'Comunicarse con un administrador' });
    }
}

export const getSortProducts = async (req, res) => {
    try {
        // Realiza la consulta a la base de datos para obtener los productos ordenados
        const productos = await productManager.getSortProduct({}).sort({ }).exec();
        return productos;
    } catch (error) {
        console.error('Error fetching sorted products:', error);
        throw error;
    }
}
