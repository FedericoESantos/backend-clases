import { carritoModelo } from "./models/carritosModelo.js";

export class CartManager{

    async getAll(){
        return await carritoModelo.find().lean();
    }

    async getOneBy(filtro={}){
        return await carritoModelo.findOne(filtro).populate("productos");
    }
    
    async getOneByPopulate(filtro={}){
        return await carritoModelo.findOne(filtro).populate("productos.producto").lean();
    }

    async create(){
        let carrito = await carritoModelo.create({productos:[]});
        return await carrito.toJSON();
    }

    async update(id,carrito){
        return await carritoModelo.updateOne({_id:id}, carrito);
    }
}