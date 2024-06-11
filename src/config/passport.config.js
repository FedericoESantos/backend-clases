import passport, { Passport } from "passport";
import local from "passport-local";
import github from "passport-github2";

import { generaHash } from "../utils.js";
import { UsuariosManagerMONGO } from "../dao/UsuariosManagerMONGO.js";
import { config } from "./config.js";

const usuariosManager = new UsuariosManagerMONGO();

//PASO1
export const initPassport = () => { // aca encapsulamos las estrategias
    passport.use(
        "registro",// primer argumento nombre de la estrategia
        new local.Strategy( // segundo argum. estrategia
            { // primer argumento un objeto donde envie configuraciones
                usernameField: "email", //para loguearnos
                passReqToCallback: true // pasar req al callback
            }, // segundo argumento una funcion asincrona con try / catch
            async (req, username, password, done) => {
                try { // dentro del try va toda la logica de resgistro
                    let { nombre } = req.body // vamos a llamar al dato de nombre porque el email lo llamamos de userNameField
                    if (!nombre) {
                        return done(null, false);
                    }

                    let existe = await usuariosManager.getBy({ email: username })
                    if (existe) {
                        return done(null, false)
                    }

                    password = generaHash(password)

                    let nuevoUsuario = await usuariosManager.create({ nombre, email:username, password, rol: "user"})
                    return done(null, nuevoUsuario);

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usename: "email"
            },
            async (username, password, done) => {
                try {
                    let usuario = await usuariosManager.getBy({ email:username });
                    // si el valor de la propiedad es el mismo se escribe una sola vez
                    if (!usuario) {
                        return done(null, false)
                    }

                    if (!validaPassword(password, usuario.password)) {
                        return done(null, false)
                    }

                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
    "github",
    new github.Strategy(
        {
            clientID:"", // como lo puedo instanciar con el config.js
            clientSecret:"",
            callbackURL:""
        },
        async(tokenAcceso, tokenRefresh, profile, done)=>{
            try {
                let email = profile._json.email;
                let nombre = profile._json.name;
                let usuario = await usuariosManager.getBy({email});
                if(!usuario){
                    usuario = await usuariosManager.create({
                        nombre, email, profile
                    })
                }

                return done(null, usuario);
            } catch (error) {
                
            }
        }
    )
    )
// PASO 1 BIS - SIEMPRE ES IGUAL

    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id)
    }) // para guardar el usuario

    passport.deserializeUser(async (id, done) => {
        let usuario = await usuariosManager.getBy({ _id: id })
        return done(null, usuario)
    })

}