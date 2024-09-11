import { Tipos_Error } from "../errors/Errors.js";

export const ErrorHandler = (error, req, res, next) => {
    console.log(`${error.cause?error.cause:error.message}`);

    switch(error.code){
        case Tipos_Error.Autenticacion || Tipos_Error.Autorizacion:
        res.setHeader(`Content-Type`,`application/json`);
        return res.status(401).json({error:`Credenciales incorrectas`});
                
        case Tipos_Error.Argumentos_invalidos:
        res.setHeader(`Content-Type`,`application/json`);
        return res.status(400).json({error:`${error.message}`});

        default:
            res.setHeader(`Content-Type`,`application/json`);
            return res.status(500).json({error: `Contacte al administrador`});
    }
    
}