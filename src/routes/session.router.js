import { generaHash, validaPassword } from "../utils.js";
import Router from 'express';
import { UsuariosManagerMONGO } from "../dao/UsuariosManagerMONGO.js";
import passport from "passport"

export const router = Router();
const usuariosManager = new UsuariosManagerMONGO();

router.get("/error", (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
    {
    error:`Error inesperado en el servidor - Intente más tarde`,
    detalle: `Fallo al auntenticar`
    }
    )
})

//PASO 3
router.post('/registro', passport.authenticate("registro", {failureRedirect:"/api/sessions/error"}), async(req,res)=>{
// se sale todo ok passport deja un req.user
res.setHeader('Content-Type', 'application/json');
res.status(200).json({mensaje: "registro: Ok}", nuevoUsuario:req.user });
// el nombre de registro viene del archivo de passport de passport.use("resgistro")
})

//PASO 3
router.post("/login", passport.authenticate("login", {failureRedirect:"/api/session-error"}),async(req,res)=>{
    let { web } = req.body;

// si sale todo ok en passport crea un req.user con la informacion de usuario
    let usuario = { ... req.user};
    delete usuario.password;
    req.session.usuario = usuario;
    //se crea una propiedad usuario en session con los datos del usuario que se loguio
    if(web){
        res.redirect("/perfil");
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({
            payload: "Login correcto :D",
            usuario
        });
    }

})

router.get("/github", passport.authenticate("github", {}), (req,res)=>{

})

router.get("/callbackGithub", passport.authenticate("github", {failureRedirect:"/api/sessions/error"}) ,(req,res)=>{
    //si la ruta falla nos re dirige a un endpoint con error
    req.session.usuario = req.user;
    // aca creo la session del usuario protegida

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({payload:req.user});
})

router.get("/logout", (req,res)=>{
    req.session.destroy(err=>{
        if(err){
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
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({payload: `LogOut Existoso!!!`});
})