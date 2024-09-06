import { isValidObjectId } from 'mongoose';
import { CartManager } from '../dao/CartManager.js';
import { ProductManager } from '../dao/ProductManager.js';
import { UsuarioManager } from '../dao/UsuarioManager.js';
import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { logger } from '../utils/winston.js';

export const router = Router();

const usuariosManager = new UsuarioManager();
const cartManager = new CartManager();
let productManager = new ProductManager();

router.get('/', (req, res) => {
    
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).render('home', { title: 'E-Commerce'});
});

router.get('/cargaProductos',async (req, res) => {
    let productos;
    let { error } = req.query;
    try {
        productos = await productManager.getAll();
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return logger.error(error.message);
    }

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).render('realTime', { title: 'E-Commerce', productos, error });
});

router.get('/productos', auth(["user"]), async(req, res) => {
    let { error } = req.query;
    let usuario = req.session.usuario;
    let cid = usuario.carrito;
     
    let carrito; 
    carrito = await cartManager.getOneByPopulate({_id:cid});
    if(!carrito){
        carrito = await productManager.create();
    }
    
    let productos;
    try {
        productos = await productManager.getAll();
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return logger.error(error.message);
    }
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).render('productos', { 
        title: 'E-Commerce', 
        productos,
        usuario,
        login: req.session.usuario,
        error
    });

});

router.get("/carrito/:cid", async (req, res) => {
    let { cid } = req.params;
    let usuario = req.session.usuario;

    if(!isValidObjectId(cid)){
        res.setHeader(`Content-Type`,`application/json`);
        return res.status(400).json({error:`Ingrese Cid / Pid validos`});
    }
    
    let carrito = await cartManager.getOneByPopulate({_id:cid});
    if(!carrito){
        res.setHeader(`Content-Type`,`application/json`);
        return res.status(400).json({error:`Carrito inexistente: id${cid}`});
    }
    
    let productos = carrito.productos;
    
    res.setHeader(`Content-Type`, `text/html`);
    return res.status(200).render("carrito", { productos, usuario, title:`Carrito de ${usuario.name}`});
})

router.get("/usuarios", async(req,res)=>{
    let { pagina, error } = req.query;
    if(!pagina){
        pagina = 1;
    }
    
    let { docs:usuarios, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await usuariosManager.getAllPaginate(pagina);

    res.setHeader(`Content-Type`,`text/html`);
    return res.status(200).render("usuarios",{
        usuarios,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        error
    });
})
 
router.get("/registro", (req,res)=>{
    let { error, exito } = req.query;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).render('registro', { 
        title: 'E-Commerce',
        error,
        exito,
        login: req.session.usuario
    });
})

router.get("/login",(req,res)=>{
    let { error, exit } = req.query;
    let mensaje = req.query.mensaje;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).render('login', { title: 'E-Commerce', error, exit, mensaje});
})

router.get("/perfil" ,(req,res)=>{
    let usuario = req.session.usuario;
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).render('perfil', { 
        title: 'E-Commerce',
        usuario,
        login: req.session.usuario
    });
})

