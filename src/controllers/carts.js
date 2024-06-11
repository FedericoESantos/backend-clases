import { request, response } from "express";
import {cartModel} from "../dao/models/cartsModel.js";
import { ProductManager } from "../dao/ProductManager.js";
import { CartManager } from "../dao/CartManager.js";

const req = request;
const res = response;

const productManager = new ProductManager();
const cartManager = new CartManager();

export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        let carrito = await cartManager.getOneByPopulate({id:cid})
        if (!carrito) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error:`Carrito inexistente: id ${cid}`});
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({carrito});

    } catch (error) {
        return res.status(500).json("Hubo un inconveniente");
    }
}

export const createCart = async (req, res) => {
    let carrito;
    try {
        carrito = await cartModel.create({});
        return res.json("Carrito creado");
    } catch (error) {
        console.log('createCartById ->', error);
        return res.status(500).json("Hubo un inconveniente");
    }
}

export const addProductCart = async (req, res) => {
    let { cid, pid } = req.params;
    try {
        const producto = await productManager.getProductById({_id:pid});
        if(!producto){ // si no existe el producto
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error:`No existe producto con id ${pid}`});
        }
        const carrito = await cartModel.findById(cid);
        if (!carrito) { // si no existe el carrito
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error:`No existe carrito con id ${cid}`});
        }
        let indiceProducto = carrito.products.findIndex(prop=>prop.producto == pid);
        if(indiceProducto === -1){
            carrito.products.push({
                producto: pid, cantidad:1
            });
        }else{
            carrito.products[indiceProducto].cantidad++;
        }

        let resultado = cartManager.update(cid, carrito);
        if((await resultado).modifiedCount>0){
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({payload: "Carrito Actualizado"});
        }else{
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
            {
            error:`Error inesperado en el servidor - Intente más tarde`,
            detalle: `No se pudo realizar la actualizacion`
            }
            )
        }
        // const productoInCart = carrito.products.find(p => p.id === pid)
        //         if (productoInCart)
        //     productoInCart.quantity++
        // else{
        //     carrito.products.push({ id: pid, quantity: 1 })
        // }
        // carrito.save();
        // return carrito;
    } catch (error) {
        console.log("error en el addProd_to_CartService", error);
        throw error
    }
}

