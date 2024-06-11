import mongoose from "mongoose";

const messageCollection = "mesaage"; // Le va a dar el nombre al modelo y a la colección
const messageEsquema = new mongoose.Schema( 
    { // En el primero, indico las propiedades
        user: String,
        message: String,
    },
    {  // En el segundo, configuro diferentes tipos de cosas asociadas a la colección
        timestamps: true, // Son las marcas de tiempo cuando modificamos nuestros datos
        // collection: "alumnos" - ponemos el nombre exacto de la coleccion por si llegara a ser diferente de usuarios
    }
);

const messageModel = mongoose.model(
    messageCollection,
    messageEsquema
);
export default messageModel;
// esta es la configuracion basica de un modelo de datos y siempre los vamos a usar dentro de un Manager

