import express from "express"
import { engine } from "express-handlebars";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import { Singleton } from "./dao/singleton.js";
import cors from "cors";
import cluster from "cluster";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import { router as vistasRouter } from "./routes/vistasRouter.js";
import { router as productRouter } from "./routes/productRouter.js";
import { router as usuariosRouter } from "./routes/usuariosRouter.js";
import { router as carritoRouter } from "./routes/cartRouter.js";
import { router as sessionRouter } from "./routes/sessionRouter.js";
import { Server } from "socket.io";

import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "./config/config.js";
import { logger, middLogger } from "./utils/winston.js";

if (cluster.isPrimary) {
    cluster.fork();
    cluster.fork();
    cluster.fork();
} else {
    const port = config.PORT;
    const app = express();

    let io;

    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', './src/views');

    app.use(express.json());
    app.use(middLogger)
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    const options ={
        definition:{
            openapi:"3.0.0",
            info:{
                title:"Api E-Commerce",
                version: "1.0.0",
                description: "Documentacion del endpoint de Productos y de Carrito"
            },
        },
        apis: [ "./src/docs/*.yaml" ]
    }
    const especific = swaggerJSDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(especific));

    app.use(express.static('./src/public'));

    app.use(session({
        secret: "CoderCoder123",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://boomarts47:fede123@cluster0.z3tu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=E-Commerce",
            ttl: 3600,
        })
    }));

    initPassport();
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api/products', (req, res, next) => {
        req.io = io;
        next();
    }, productRouter);
    app.use('/api/usuarios', usuariosRouter);
    app.use("/api/carts", carritoRouter);
    app.use("/api/sessions", sessionRouter);


    app.use('/', vistasRouter);

    const serverHTP = app.listen(port, () => {
        logger.info(`Server escuchando en puerto ${port} - pid: ${process.pid} - worker: ${cluster.worker.id}`)
    });

    io = new Server(serverHTP);

    Singleton.conectar("mongodb+srv://boomarts47:fede123@cluster0.z3tu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "E-Commerce");

}


