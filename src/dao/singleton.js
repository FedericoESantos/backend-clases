import mongoose from "mongoose"
import { logger } from "../utils/winston.js";

export class Singleton{
    static #instancia
    constructor(url,db){
        mongoose.connect(url,{dbName:db});
    }

    static conectar(url, db){
        if(this.#instancia){
            logger.info("Conexion previamente establecida");
            return this.#instancia;
        }

        this.#instancia = new Singleton(url,db);
        logger.info("DB Conectada");
        return this.#instancia;
    }

}

