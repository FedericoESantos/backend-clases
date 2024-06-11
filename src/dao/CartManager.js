import { cartModel } from "./models/cartsModel.js";

export class CartManager{

    async getAll(){
        return await cartModel.find().lean();
    }

    async getOneBy(filtro={}){
        return await cartModel.findOne(filtro).lean();
    }

    async getOneByPopulate(filtro={}){
        return await cartModel.findOne(filtro).populate("products.producto").lean();
    }

    async create(){
        let cart = await cartModel.create({products: []}) // creo el carrito con los producto con un array vacio
        return cart.toJSON(); // retorno un archivo json
    }

    async update(id, carrito){
        return await cartModel.updateOne({_id:id}, carrito)
    }

    // delete

}