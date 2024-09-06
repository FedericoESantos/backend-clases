import { ProductManager } from "../dao/ProductManager.js";

class ProductService{
    constructor(dao){
        this.dao = dao;
    }

    getAll = async()=>{
        return this.dao.getAll();
    }

    create = async(usuario)=>{
        return this.dao.create(usuario);
    }

    getProductBy = async(filtro)=>{
        return this.dao.getOneBy(filtro);
    }

    deleteProd = async(id)=>{
        return this.dao.delete(id);
    }

}

export const productService = new ProductService(new ProductManager());