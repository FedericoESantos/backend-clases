import mongoose from "mongoose"; // importo el esquema de moongoose

const carritoCollection = "carts"; // Le va a dar el nombre al modelo y a la colección
const carritoEsquema = new mongoose.Schema( 
    { // En el primero, indico las propiedades
        products:{ // va a ser un objeto que dentro tengo un tipo de producto
            type:[
                {
                    producto:{
                        type: mongoose.Types.ObjectId, ref:"products" //en ref hago referencia al modelo products
                    },
                    cantidad: Number
                }
            ]
        }
    },
    {  // En el segundo, configuro diferentes tipos de cosas asociadas a la colección
        timestamps: true, // Son las marcas de tiempo cuando modificamos nuestros datos
        // collection: "alumnos" - ponemos el nombre exacto de la coleccion por si llegara a ser diferente de usuarios
    }
);

export const cartModel = mongoose.model(
    carritoCollection,
    carritoEsquema
);

// esta es la configuracion basica de un modelo de datos y siempre los vamos a usar dentro de un Manager
