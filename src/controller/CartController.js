import { isValidObjectId } from 'mongoose';
import { cartsService } from '../service/Carts.service.js';
import { productService } from '../service/Product.service.js';
import { ticketModelo } from '../dao/models/ticketModelo.js';
import { enviarMail } from '../utils.js';
import { CustomError } from '../errors/CustomError.js';
import { Tipos_Error } from '../errors/Errors.js';

export class CartController {

    static getOneBy = async (req, res, next) => {
        try {
            let { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return CustomError.generarError("Error cartController", "carrito invalido", `El ID del carrito ${cid} no es valido`, Tipos_Error.Codigo_http);
        }
        
        let carrito = await cartsService.getOneBy({ _id: cid });
        if (!carrito) {
            return CustomError.generarError("Error cartController", "carrito inexistente", `El carrito con ID ${cid} no existe en la base de datos`, Tipos_Error.Codigo_http);
        }

        res.setHeader(`Content-Type`, `application/json`);
        return res.status(200).json({ carrito, cid });
        } catch (error) {
            next(error);
        }
        
    }

    static buyCart = async (req,res) =>{
        let { cid } = req.params;
        if (!isValidObjectId(cid)) {
            return CustomError.generarError("Error cartController", "carrito invalido", `El ID del carrito ${cid} no es valido`, Tipos_Error.Codigo_http);
        }

        let carrito = await cartsService.getOneBy({ _id: cid });
        if (!carrito) {
            return CustomError.generarError("Error cartController", "carrito inexistente", `El carrito con ID ${cid} no existe en la base de datos`, Tipos_Error.Codigo_http);
        }

        if(carrito.productos.length===0){
            return CustomError.generarError("Error cartController", "carrito sin items", `El carrito con ID ${cid} no tiene items`, Tipos_Error.Codigo_http);
        }

        let conStock = [];
        let sinStock = [];
        let total = 0;

        for(let i=0; i<carrito.productos.length; i++){
            let id = carrito.productos[i].producto;
            let cantidad = carrito.productos[i].cantidad;
            let producto = await productService.getProductBy({_id:id});
            if(!producto || producto.stock < cantidad){
                sinStock.push(carrito.productos(i));
                if(producto.stock < cantidad){
                    console.log(`El producto ${producto.description} no tiene stock suficiente. Stock: ${producto.stock} / cantidad: ${cantidad} `);
                }
            }else{
                conStock.push({
                    id,
                    descripcion: producto.description,
                    precio: producto.price,
                    stockPrevioCompra: producto.stock,
                    stockPostCompra: producto.stock - cantidad,
                    cantidad,
                    subTotal: cantidad * producto.price
                })
                total += producto.price;
                producto.stock = producto.stock - cantidad;
                await productService.update(id, producto);
            }
        }

        if(conStock.length===0){
            return CustomError.generarError("Error cartController", "carrito sin items", `No existen items en condiciones de ser comprados en el carrito con id ${cid} ... verifique Stock / codigos de producto`, Tipos_Error.Codigo_http);
        }

        carrito.productos = sinStock;
        await cartsService.getUpdate(cid, carrito);

        let nroComprobante = Date.now();
        let fecha = new Date();
        let comprador = req.session.user?.email; 

        let ticket= await ticketModelo.create({
            nroComprobante, fecha, comprador, items: conStock, total
        })

        let message = `
            Hola ${req.session.user.name} ...!!!<br>
        Has registrado una compra con n° ticket ${nroComprobante}, por un importe de $ ${total}. <br>
        Detalle: ${JSON.stringify(conStock)} <br>
        ${sinStock.length>0?'Algunos items no pudieron comprarse... por favor consulte':""} <br>
        Por favor contacte a <a href:"mailto:boomarts47@gmail.com">Pagos</a> para finalizar la operación. <br>
        Muchas Gracias!!!
        `;

        let resultado = await enviarMail(comprador, "Tu compra esta a un paso de concretarse...", message)
        
        res.setHeader(`Content-Type`, `application/json`);
        return res.status(200).json({ ticket });
    }

    static getCart = async (req, res) => {
        let { cid, pid } = req.params;
        let { web } = req.body;
    
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            if (web) {
                return res.redirect("carrito/:cid/product/:pid?error=Ingrese Cid / Pid validos")
            } else {
               return CustomError.generarError("Error cartController", "carrito invalido", `El ID del carrito ${cid} no es valido`, Tipos_Error.Codigo_http);
            }
        }
    
        let carrito = await cartsService.getOneByPopulate({ _id: cid });
        if (!carrito) {
            return CustomError.generarError("Error cartController", "carrito inexistente", `El carrito con ID ${cid} no existe en la base de datos`, Tipos_Error.Codigo_http);
        }
    
        let producto = await productService.getProductBy({ _id: pid });
        if (!producto) {
            return CustomError.generarError("Error productController", "producto inexistente", `El producto con ID ${cid} no existe en la base de datos`, Tipos_Error.Codigo_http);
        }
       
        if(producto.stock === 0){
            return CustomError.generarError("Error cartController", "carrito sin items", `No hay stock de ${producto.description}. Stock Actual: ${producto.stock}`, Tipos_Error.Codigo_http);
        }

        let indiceProd = carrito.productos.findIndex(prod => prod.producto == pid);
        
        if (indiceProd === -1) {
            carrito.productos.push({producto: pid, cantidad: 1});
        } else {
            carrito.productos[indiceProd].cantidad++;
        }
    
        let resultado = await cartsService.getUpdate(cid, carrito);
        if (resultado.modifiedCount > 0) {
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(200).json({ payload: "carrito actualizado" });
        } else {
            return CustomError.generarError("Error cartController", "carrito sin actualizar", "El Carrito no se pudo actualizar", Tipos_Error.Codigo_http);
        }
    }
    
}