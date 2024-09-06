import { Router } from 'express';
import passport from 'passport';
import { auth } from '../middlewares/auth.js';
import { loggers } from 'winston';

export const router = Router();

router.get("/error", (req,res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:'Ha ocurrido un error !!! :S'})
})

router.get("/github", passport.authenticate("github",{}),(req,res)=>{

})

router.get("/callbackGithub",auth ,passport.authenticate("github",{failureRedirect:"/api/sessions/error"}),(req,res)=>{
    req.session.usuario = req.user;

    res.setHeader(`Content-Type`,`application/json`);
    return res.status(200).json({payload:req.user});
})

router.post('/registro', passport.authenticate("registro",{failureRedirect:"/api/sessions/error"}), async (req, res) => {

    res.setHeader(`Content-Type`,`application/json`);
    return res.status(201).json({mensaje:`Registro OK`, nuevousuario: req.user});

});

router.post('/login', passport.authenticate("login", {failureRedirect:"/api/sessions/error"}),async (req, res) => {
    let { web } = req.body;
    
    let usuario = { ...req.user };
    delete usuario.password;
    req.session.usuario = usuario;

    if (web) {
        res.redirect("/productos");
    } else {
        res.setHeader(`Content-Type`, `application/json`);
        return res.status(200).json({ payload: "Login Correcto", usuario });
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Sesion cerrada:', error);
            res.setHeader('Content-Type', 'application/json');
            return loggers.error({ error: "Internal Server Error" });
        }
        res.redirect("/login?mensaje=Secion cerrada con exito!!! Hasta pronto :D");
    });
});

