import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productosCollection = "products"; // Le va a dar el nombre al modelo y a la colección
const productosEsquema = new mongoose.Schema( 
    { // En el primero, indico las propiedades
        title: String, // Nombre de tipo de datos STRING
        description: String,
        code: {type:String, unique:true, required:true},
        price:Number,
        stock:{
            type: Number, default:0 // default 0 para restarle importancia si viene o no el dato del stock
        },
        category:String,
        thumbnail:[{type:String}],
        status: {type:Boolean, default:true}
    },
    {  // En el segundo, configuro diferentes tipos de cosas asociadas a la colección
        timestamps: true, // Son las marcas de tiempo cuando modificamos nuestros datos
        // collection: "alumnos" - ponemos el nombre exacto de la coleccion por si llegara a ser diferente de usuarios
    }
);

productosEsquema.plugin(paginate);
productosEsquema.index({title:1}); // busca a los productos por orden ascendente

export const productModel = mongoose.model(
    productosCollection,
    productosEsquema
);

// esta es la configuracion basica de un modelo de datos y siempre los vamos a usar dentro de un Manager

