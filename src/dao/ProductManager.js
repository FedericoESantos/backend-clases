import { productosModelo } from "./models/productoModelo.js";

export class ProductManager{

    async getAll(){
        return await productosModelo.find().lean();
    }

    async getOneBy(filter={}){
        return await productosModelo.findOne(filter).lean();
    }

    async create(filtro){
        let nuevoProducto = await productosModelo.create(filtro);
        return nuevoProducto.toJSON();
    }

    async update(id, producto){
        return productosModelo.updateOne({_id:id}, producto);
    }

    async delete(id){
        return await productosModelo.deleteOne(id);
    }

}
