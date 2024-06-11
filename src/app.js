import express from "express";
import path from "path";
import { Server } from "socket.io"; // importamos la libreria de socket
import { engine } from "express-handlebars"; // importamos la libreria de express-handlebars
import mongoose from "mongoose";
import __dirname from "./utils.js"; // con esta importacion nos aseguramos la ruta absoluta 
import sessions from "express-session"; // aca generamos la session
import passport from "passport"
import { initPassport } from "./config/passport.config.js";
import { config } from './config/config.js';

const app = express();
const PORT = config.PORT;

import productsRoute  from "./routes/products.router.js";
import cartsRoute  from "./routes/carts.router.js";
import viewsRoute from "./routes/views.router.js";
import { router as sessionRouter} from "./routes/session.router.js"

import messageModel from "./dao/models/messagesModel.js"; // aca importamos el modelo de los mensajes del chat
import MongoStore from "connect-mongo";
import { auth } from "./middleware/auth.js";

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use(sessions({
    secret: "CoderCoder123", 
    resave:true, 
    saveUninitialized:true,
    store: MongoStore.create({
        ttl:3600, //time to live el tiempo que va a seguir activa la session
        mongoUrl:"mongodb+srv://boomarts:CoderCoder123@cluster0.z3sb9mc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce"
    })
}))

// PASO 2
initPassport();
app.use(passport.initialize());
app.use(passport.session()); // solo si uso sessions

app.engine("handlebars", engine()); 
app.set("views", path.join(__dirname + "/views")); // en la carpeta views guardaremos nuestro codigo html
app.set("view engine", "handlebars");

app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRoute);

app.get("/datos",auth, (req, res) => { // importante primero creamos los datos
    // y agregamos el middleware de autenticacion, previo lo importamos
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        datos: "datos", sesson: req.session
    });
    
})

app.get("/session", (req, res) => { // lo iniciamos en la ruta que querramos
    if (req.session.contador) { // es unica por cada usuario que se conecte
        req.session.contador++ // si existe una propiedad contador le sumo 1
    } else { //y sino
        req.session.contador = 1; // la creo y la inicializo en 1 
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(`visitas al site: ${req.session.contador}`); // muestra la cantidad de visitas
})

app.get("/getcookies", (req, res) => { // este metodo es para leer las cookies
    let cookies = req.cookies; // aca guardamos las cookies
    let cookiesFirmadas = req.signedCookies; // con esto guardamos las cookies
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        cookies, // aca mostramos las cookies
        cookiesFirmadas // aca se guardan
    });

})

let usuarios =[]; // guardamos los usuarios en un array

const HTTPServer = app.listen(PORT, () => { console.log(`Corriendo aplicacion en el puerto ${PORT}`); });
const io = new Server(HTTPServer); // aca instanciamos el servidor de http

// CONEXION CON SOCKET.IO

io.on("connection", (socket)=>{ // aca va a escuchar el socket. Como primer parametro recibe conection
    console.log("Se ha conectado un cliente")
        // ------------------ comienza la comunicacion con el chat ------------------------------

        //CUANDO ALGUIEN SE IDENTIFICA
    socket.on("id", async (nombre)=>{ // aca voy a recibir el nombre y lo voy a almacenar en una variable usuarios 
    usuarios.push({id: socket.id, nombre}); // aca agrego el nombre que me manda al array incluyendo el nombre

    let mensajes = await messageModel.find(); // aca guardamos los mensajes en la base de datos 
    mensajes = mensajes.map(men=>{ // acua hago un mapeo para obtener los mensajes y los mails
        return {nombre: men.email, mensaje: men.mensaje}
    })
    socket.emit("mensajesPrevios", mensajes); // aca guardo el historial de los mensajes
    socket.broadcast.emit("nuevoUsuario", nombre); // aca le envio un mensaje para todos menos para el ultimo con un nuevo nombre
})

//ACA RESPONDO LOS MENSAJES
    socket.on("mensaje", async(nombre, mensaje)=>{ // aca voy a recibir 2 cosas, el nombre y el mensaje
    await messageModel.create({email:nombre, mensaje}) // aca creamos el mensaje
    io.emit("nuevoMensaje", nombre, mensaje); // y aca vuelo a enviar a todos (io) el nombre y el mensaje
})

//CUANDO ALGUIEN SALE DEL CHAT
    socket.on("disconnect", ()=>{
    let usuario = usuarios.find(usur=>usur.id===socket.id); 
    // voy a buscar dentro de mis usuarios a todos cuyo id sea igual a socket.id
    if(usuario){ // si encontre al usuario
        io.emit("saleUsuario", usuario.nombre); //del usuario me detecta el id pero no el nombre
        console.log(usuario.nombre)
    }

})

})
// ------------------ fin de la comunicacion con el chat ------------------------------

// CONEXION CON LA BASE DE DATOS 

const conectaDB = async ()=>{
    try { // en el await va nuestro url de conexion al servidor pero falta la base de datos a donde queremos conectarnos como una opcion
       //await mongoose.conect("mongodb+srv://boomarts:coder-coder@cluster0.h473sru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        await mongoose.connect( //uno es el link de conexion seguido de una coma
        config.MONGO_URL, 
        { //la otra opcion es poner 2 parametros y el otro un objeto que donde pondremos lo parametros que deseamos
            dbName:"ecommerce" // esto nos permite guardar la base de datos en una variable
        }
        ) 
        console.log("DB Online ...")
    } catch (error) {
        console.log("Error al conectar la base de datos", error.message);
    }
}
// Por defecto de la version 7 de mongoose la opción "strictQuery" se cambiará a false.
// Para prepararte para este cambio se puedes usar
mongoose.set('strictQuery', true);

conectaDB();