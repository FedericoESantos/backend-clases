import mongoose from "mongoose";

export const usuarioModel = mongoose.model("usuarios",
    new mongoose.Schema({
        first_name: String,
        last_name: String,
        email:{
            type: String, unique:true
        },
        age:Number,
        password: String,
        carts: Number, // se toma como atributo el id?
        rol:{
            type: String, default:"user"
        }
    },
{
    timestamps: true, strict: false
    // strict en false me permite agregar campos que no estan en el esquema
}))