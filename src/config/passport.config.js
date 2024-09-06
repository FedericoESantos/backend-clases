import passport from "passport";
import local from "passport-local";
import { UsuarioManager } from "../dao/UsuarioManager.js";
import { generaHash, validaPassword } from "../utils.js";
import github from "passport-github2";
import { CartManager } from "../dao/CartManager.js";

const cartManager = new CartManager();
const usuarioManager = new UsuarioManager();

export const initPassport = () => {
    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    let { name, last_name } = req.body;
                    if (!name || !last_name) {
                        return done(null, false)
                    }

                    let existe = await usuarioManager.getUsuarioBy({ email: username });
                    if (existe) {
                        return done(null, false);
                    }

                    password = generaHash(password);
                    let carrito = await cartManager.create();
                    let nuevoUsuario = await usuarioManager.addUsuario({ name, last_name, email: username, password, rol: "user",carrito });
                    return done(null, nuevoUsuario);

                } catch (error) {
                    return done(error);
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done) => {
                try {
                    let usuario = await usuarioManager.getUsuarioBy({ email: username });
                    if (!usuario) {
                        return done(null, false);
                    }

                    if (!validaPassword(password, usuario.password)) {
                        return done(null, false);
                    }
                    console.log(usuario, "Desde passport.config")
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )

    )

    passport.use(
        "github",
        new github.Strategy(
            {
                clientID:"Iv23lif593EFutuoMbtO",
                clientSecret:"a601d0e43a2743531f408bcc4daf1767d76fb8b2",
                callbackURL:"http://localhost:3000/api/sessions/callbackGithub"
            },
            async(tokenAcceso, tokenRefresh, profile, done)=>{
                try {
                    let email = profile._json.email;
                    let nombre = profile._json;
                    if(!email){
                        return done(nul, false);
                    }

                    let usuario = await usuarioManager.getUsuarioBy({email});
                    if(!usuario){
                        let nuevoCarrito = await cartManager.create();
                        usuario = await usuarioManager.addUsuario({
                            nombre, email, profile, carrito: nuevoCarrito._id
                        }
                    )
                    usuario = await usuarioManager.getUsuarioBy({email}); 
                    }

                    return done(null, usuario)

                } catch (error) {
                    return done(error);
                }
            }
        )
    )



    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id);
    });
    passport.deserializeUser(async (id, done) => {
        let usuario = await usuarioManager.getUsuarioBy({ _id: id });
        return done(null, usuario);
    })
}
