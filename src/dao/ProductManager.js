import { productModel } from "./models/productModel.js";

export class ProductManager{

    async getAll(){
        return await productModel.find().lean();
    }

    async getProductBy(filtro){
        return await productModel.findById(filtro).lean();
    }

    async getAllPaginate(page){
        return await productModel.paginate({},{limit:10, page, lean:true})
        // con el limit: le indicamos que queremos ver de a 10 paginas
        // con el page: le indicamos  el numero de paginas
        // lean: es indispensable tenerlo en true
        //tiene 2 argumentos, el primero un filtro pero no se usa mucho,
        //y el segundo explicarle datos de paginado
    } // como argumento le pido la pagina (page) por defecto va a ser 1 

    async createProduct(producto){
        let nuevoProducto = await productModel.create(producto); 
        return nuevoProducto.toJSON(); // el .lean no esta permitido con create por eso uso .toJson de esta manera
    }

    async updateProduct(id, resto, update){
        return await productModel.findByIdAndUpdate(id, resto, update);
        // el findByIDanUPDATE pide 3 parametro, el primero el id, el segundo el resto de las propiedades y el tercero la actualizacion
    }

    async deleteProduct(id){
        return await productModel.findByIdAndDelete(id);
    }

    async getSortProduct(){
        return productModel.find();
    }

}