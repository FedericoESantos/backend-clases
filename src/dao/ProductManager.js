const fs = require("fs");
const crypto = require("crypto"); // este modulo sirve para encriptar datos, seguridad en la informacion

let rutaArchivo = require("../../../EJERCICIO/src/data/products.json");

class ProductManager {

    constructor(rutaArchivo) {
        this.path = rutaArchivo;
    }

    async leerProducto() { // SIRVE PARA LEER ARCHIVOS // como usamos await primero le ponemos async
        if(fs.existsSync(this.path)){ // si existe la ruta de mi archivo
            return JSON.parse(await fs.promises.readFile(this.path, {encoding:"utf-8"})); 
            //en el archivo voy a tener un archivo JSON que es un texto, por eso tenemos 
            //primero que parsearlo pero como es una promesa tenemos que esperar (await) que primero 
            // se resuelva la promesa para poder convertirlo a texto
            // voy a leer archivos con promesas
        } else{ // pero si no existe
            return []; // va a devolver un array vacio
        }
    }

    async guardarArchivo() {
    try{
        fs.writeFileSync(rutaArchivo, JSON.stringify(await this.products));
        console.log("Guardado Exitosamente");
        }
    catch(error){
        console.log("No existe el archivo");
        }
    }

    async updateProduct(id, objetoActualizdo){
        let indice = await this.products.findIndex(prod=>prod.id === id); 
        //buscamos en nuestro array todos los productos por su indice
        if(indice !== -1){ 
            //si el indice es diferente de menos 1 extraemos todas las propiedades que tiene 
            //"objetoActualizado"
            const {id, ...resto} = objetoActualizdo; 
            // creo una constante donde quiero extraer el "id" y el "resto" de las propiedades 
            //(lo llame resto) en el objeto
            this.products[indice] = {...this.products[indice], ...resto}; 
            //en la posicion del indice de los productos le exparsa todas las propiedades del id 
            //y sobreescriba las que ya estan escritas con ...resto
            // con el {...(nombre)} buscamos todo las propiedades de ese nombre 
            this.guardarArchivo(); //y aca se guarda el archivo
            console.log("El producto se ha actualizado");
        }
    }

    async deleteProduct(id){
        let indice = await this.products.findIndex(prod=>prod.id === id); // igualamos variable a la busqueda de todos los id de productos
        if(indice !== -1){ 
            this.products = this.products.filter(prod=> prod.id !== id); //voy a filtrar todo mi array los id que sean diferentes
                this.guardarArchivo(); //guardamos el archivo
                console.log("Producto Eliminado...");
        }
        return console.log("El producto con el ID ${id} no existe");
    }

    async asignarId(){
        let id = 1; // por defecto se le asigna 1 al id
        if(this.products.length>0) // si la longitud de los productos es mayor a 0 ...
            id = await this.products[this.products.length-1].id + 1 // suma 1 a cada id agregado
        return id;
    }

    async addProducts(title, description, price, thumbnail, code, stock) {
        let productos = await this.products;  //recuper desde el archivo a memoria
        // y a partir de acá... siempre te manejas con products (en memoria), hasta el fin 
        // de la función, donde tenes que guardarlo de nuevo en el archivo...

        if(!title || !description || !price || !thumbnail || !code || !stock){
            return "Todos los parámetros son requeridos"; // si algunos de los parametros son distntos
        }

        const existe = productos.find(producto=>producto.code == code); 
        // creo variable que busca un producto cuyo code sea igual al que recibe
        if(existe){   // si existen devuelve console.log
            return console.log(`ERROR ... El código ${code} ya se encuentra registrado`);
        }

        ProductManager.idProducto = ProductManager.idProducto +1;
        const id = this.asignarId();

        const producto = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        productos.push(producto);  
        this.guardarArchivo();
        return producto;
    }

}

const entorno = async()=>{ // creo un entorno asincrono para resolver esa promesa que arrolla
                           //el productManager
    let productManager = new ProductManager(__dirname + "./data/products.json"); 
    // con __dirname + el archivo JSON unifica la ruta absoluta a donde esta el archivo
    console.log(await productManager.leerUsuario());
}   

module.exports = ProductManager;





