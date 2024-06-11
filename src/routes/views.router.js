import { Router } from 'express';
import { productModel } from '../dao/models/productModel.js';
import { ProductManager } from "../dao/ProductManager.js"
import { CartManager } from '../dao/CartManager.js';
import { auth } from '../middleware/auth.js'; // importo la autenticacion

const productManager = new ProductManager();
const cartManager = new CartManager();

export const router = Router();

router.get("/productos", async(req,res)=>{  // aca me dirige a la pagina de productos
    let carrito = await cartManager.getOneBy();
    if(!carrito){
        carrito = await cartManager.create();
    }

    
    let {pagina}= req.query;
    if(!pagina) pagina =1;

    let {limit , sort} = req.query;
    if(limit | sort){
        const productLimit = await productModel.find().limit(Number(limit));
        const productSort = await productManager.getSortProducts();
        return res.status(200).json({productLimit, productSort});
    }

    let productos;
    try {
        let {docs:prod, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage} = await productManager.getAllPaginate(1) 
    // le indico la pagina 1
    // desestructuramos a productos en un objeto
        productos = await productManager.getAll();
        res.setHeader('Content-Type', 'text/html');
        return res.render("productos", {
            productos, carrito, prod, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, 
            title:"Home Page",
            usuario: req.session.usuario
        }); 
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
        {
        error:`Error inesperado en el servidor - Intente más tarde`,
        detalle: `${error.message}`
        }
        )
    }
})

router.get("/", async(req,res)=>{  // aca me dirige a la pagina principal
    const productos = await productModel.find().lean();// con el nombre productos los llamamos desde home.handlebars
    res.setHeader('Content-Type', 'text/html');
    return res.render("home", {productos, title:"Home Page"}); 
})

router.get("/registro", (req,res)=>{  // aca me dirige a la pagina de registro
    
    res.setHeader('Content-Type', 'text/html');
    return res.render("registro", {title:"Registro"}); 
})

router.get("/login", (req,res)=>{  // aca me dirige a la pagina de login
    
    res.setHeader('Content-Type', 'text/html');
    return res.render("login", {title:"Login"});
})

router.get("/perfil",auth, (req,res)=>{  // aca me dirige a la pagina de perfil
    //aca le envio el usuario y la protejo con auth
    res.render("perfil", {title:"My Perfil",
        usuario: req.session.usuario
    }) 
})

router.get("/realTimeProducts", async (req,res)=>{ // aca me dirige a la pagina Real Time Products
    const productos = await productModel.find().lean(); // con el nombre productos los llamamos desde realtimeproducts.handlebars
    res.setHeader('Content-Type', 'text/html');
    return res.render("RealTimeProducts",{productos, title:"Real Time Products"});
});

router.get('/chat', (req, res) => { // aca me dirige a la pagina del chat
    res.setHeader('Content-Type', 'text/html');
    return res.render('chat', { title: "Chat" });
});

export default router;