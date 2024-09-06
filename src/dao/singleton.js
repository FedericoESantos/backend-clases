import mongoose from "mongoose"

export class Singleton{
    static #instancia
    constructor(url,db){
        mongoose.connect(url,{dbName:db});
    }

    static conectar(url, db){
        if(this.#instancia){
            console.log("Conexion previamente establecida");
            return this.#instancia;
        }

        this.#instancia = new Singleton(url,db);
        console.log("DB Conectada");
        return this.#instancia;
    }

}

