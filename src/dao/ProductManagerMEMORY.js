import fs from "fs";
const rutaArchivo = "../data/productos.json";

class ProductManager {
    static idProducto = 0;

    constructor(rutaArchivo) {
        this.path = rutaArchivo;
        this.products=this.getAll();
    }

    getAll() { // SIRVE PARA LEER ARCHIVOS 
        try {
            if (fs.existsSync(this.path)) { // si existe la ruta de mi archivo
                return JSON.parse(fs.readFileSync(this.path, { encoding: "utf-8" }));
            }
        } catch (error) {
            console.log(`ocurrió un error al leer el archivo de productos, error: ${error}`)
        }
    }

    guardarArchivo() {
        try {
            fs.writeFileSync(rutaArchivo, JSON.stringify(this.products));
            console.log("Guardado Exitosamente");
        }
        catch (error) {
            console.log(`ocurrió un error al guardar el archivo de productos, error: ${error}`);
        }
    }

    updateProduct(id, objetoActualizdo){
        let indice = this.products.findIndex(prod=>prod.id === id); 
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

    deleteProduct(id){
        let indice = this.products.findIndex(prod=>prod.id === id); // igualamos variable a la busqueda de todos los id de productos
        if(indice !== -1){ 
            this.products = this.products.filter(prod=> prod.id !== id); //voy a filtrar todo mi array los id que sean diferentes
                this.guardarArchivo(); //guardamos el archivo
                console.log("Producto Eliminado...");
        }
        return console.log("El producto con el ID ${id} no existe");
    }

    asignarId(){
        let id = 1; // por defecto se le asigna 1 al id
        if(this.products.length>0) // si la longitud de los productos es mayor a 0 ...
            id = this.products[this.products.length-1].id + 1 // suma 1 a cada id agregado
        return id;
    }

    getProductById(id){
        const producto = this.products.find(prod => prod.id === id);
        if(producto){
            return producto;
        }else{
            return `No encontramos el producto con ID ${id}`
        }
    }

    addProduct({id, nombre, alias, superpoder, equipo, energia, status=true}) {
        let productos = this.products;  //recuper desde el archivo a memoria
        // y a partir de acá... siempre te manejas con products (en memoria), hasta el fin 
        // de la función, donde tenes que guardarlo de nuevo en el archivo...
        let resultado = "Ocurrio un ERROR";
        if(!id || !nombre || !alias || !superpoder || !equipo  || !energia){
            return "Todos los parámetros son requeridos"; // si algunos de los parametros son distntos
        }
        const existe = productos.find(producto=>producto.code == code); 
        // creo variable que busca un producto cuyo code sea igual al que recibe
        if(existe){   // si existen devuelve console.log
            return console.log(`ERROR ... El código ${code} ya se encuentra registrado`);
        }
        ProductManager.idProducto = ProductManager.idProducto +1;
        this.asignarId();

        const producto = {
            id,
            nombre,
            alias,
            superpoder,
            equipo,
            energia
        }
        productos.push(producto);  
        this.guardarArchivo();
        resultado = {
            mensaje: "producto agregado existosamente",
            producto: producto
        };
        return resultado;
    }
}
export default ProductManager;