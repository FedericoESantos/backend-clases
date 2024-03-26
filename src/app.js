const express = require("express");

// tenes que importar la clase.. y luego crear la instancia...!!!
const ProductManager = require("./dao/ProductManager.js");


const productManager = new ProductManager("./src/data/products.json"); // aca creo la instancia de ProductManager por unica vez de manera global

const PORT = 8080;

const app = express();


app.get("/", (req, res) => { // PÁGINA PRINCIPAL
    res.send("Página Principal");
})

app.get("/products", async (req, res) => { // PÁGINA DE PRODUCTOS
    // NO SE PUEDE USAR 2 RES como respuesta                            
    let productos = await productManager.leerProducto(); // leo los productos del json en una const
    return res.status(200).json({productos}); // aca traemos al servidor a todos los productos

})


app.get("/products/:pid", async (req,res)=>{ // PÁGINA DE PRODUCTOS POR ID -- PRIMERO VA EL REQ Y LUEGO EL RES
    let productos = await productManager.leerProducto(); //aca te lee los productos

    let id = req.params.pid;  // el .pid final se refiere al nombre de la ruta (/:pid)
    // LOGICA DE IGUALAR AL ID A UN NUMERO
    id = Number(id); 
    if(isNaN(id)){ // si el id no es un numero
        return res.status(200).json({Error: "Ingrese un número"}); // mensaje de error
    }
    
    //LOGICA DE BUSCAR TODOS LOS PRODUCTOS POR SU ID
    let produ = productos.find(prod=>prod.id===id);
    if(produ){
        res.json(produ) // una let que contiene el archivo json
    }else{
        // res.json({productManager}) // ??? devolver el manager???
        res.status(404).json({message:`no existe producto con id ${id}`})
    }

    let limit = req.query.limit;
    if(limit && limit>0){
        productos.slice(0,limit);
        return res.json(productos);// aca traemos al servidor a todos los productos
    }

})

app.listen(PORT, ()=>{
    console.log(`Server ONLINE en puerto ${PORT}`);
})


