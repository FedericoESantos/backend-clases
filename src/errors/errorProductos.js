import os from "os";

export function argumentosProductos(producto){
    let {name, ...otros} = producto;
    return `Se han detectado argumentos invalidos:
    Argumentos obligatorios:
        -name: tipo String. Se recibio ${name}
    Argumentos opcionales:
        -last_name, description, price, stock y category. Se recibió: ${JSON.stringify(otros)}
            
    Fecha: ${new Date().toUTCString()}
    Usuario: ${os.userInfo().username}
    Terminal: ${os.hostname()}`
}