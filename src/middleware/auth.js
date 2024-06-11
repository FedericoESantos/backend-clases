// creamos un archivo de autenticacion
export const auth=(req,res,next)=>{
    if(!req.session.usuario){
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({error:`No existen usuarios autenticados`});
    }
// y este middleware lo usamos en cualquier ruta que querramos proteger
    next();
}