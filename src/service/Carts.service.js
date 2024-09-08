import { CartManager } from "../dao/CartManager.js";

class CartsService{
    constructor(dao){
        this.dao = dao;
    }

    getOneByPopulate = async(filtro)=>{
        return this.dao.getOneByPopulate(filtro);
    }

    getOneBy = async(filtro)=>{
        return this.dao.getOneBy(filtro);
    }

    getAll = async()=>{
        return this.dao.getOneBy();
    }

    create = async()=>{
        return this.dao.create();
    }

    getUpdate = async(id,carrito)=>{
        return this.dao.update(id,carrito);
    }

}

export const cartsService = new CartsService(new CartManager());