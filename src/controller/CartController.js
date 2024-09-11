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
                CustomError.createError("ID invalido", argumentosProductos(req.params),"ID invalido", Tipos_Error.Argumentos_invalidos);
            }

            let carrito = await cartsService.getOneBy({ _id: cid });
            if (!carrito) {
                CustomError.createError("Argumentos Inexistentes", argumentosProductos(req.params),"carrito inexistente", Tipos_Error.Argumentos_invalidos);
            }

            res.setHeader(`Content-Type`, `application/json`);
            return res.status(200).json({ carrito, cid });
        } catch (error) {
            next(error);
        }

    }

    static createCart = async (req, res, next) => {
        try {
            const datosCart = req.body;

            if (!datosCart) {
                CustomError.createError("Datos inexistentes", argumentosProductos(req.body),"datos inexistentes", Tipos_Error.Argumentos_invalidos);
            }

            const nuevoCarrito = await cartsService.create(datosCart);

            if (!nuevoCarrito) {
                CustomError.createError("Argumentos inexistente", argumentosProductos(req.body),"No se pudo encontrar carrito en la base de datos", Tipos_Error.Argumentos_invalidos);
            }

            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ mensaje: 'Carrito creado exitosamente', carrito: nuevoCarrito });
        } catch (error) {
            next(error);
        }
    }

    static buyCart = async (req, res, next) => {
        let { cid } = req.params;

        try {
            if (!isValidObjectId(cid)) {
                CustomError.createError("ID invalido", argumentosProductos(req.params),"ID invalido", Tipos_Error.Argumentos_invalidos);
            }
    
            let carrito = await cartsService.getOneBy({ _id: cid });
    
            if (!carrito) {
                CustomError.createError("Datos inexistentes", argumentosProductos(req.body),"datos inexistentes", Tipos_Error.Argumentos_invalidos);
            }
    
            if (carrito.productos.length === 0) {
                CustomError.createError("Datos invalidos", argumentosProductos(req.body),`El carrito con ID ${id} no tiene stock`, Tipos_Error.Argumentos_invalidos);
            }
    
            let conStock = [];
            let sinStock = [];
            let total = 0;
    
            for (let i = 0; i < carrito.productos.length; i++) {
                let id = carrito.productos[i].producto;
                let cantidad = carrito.productos[i].cantidad;
                let producto = await productService.getProductBy({ _id: id });
                if (!producto || producto.stock < cantidad) {
                    sinStock.push(carrito.productos[i]);
                    if (producto.stock < cantidad) {
                        console.log(`El producto ${producto.description} no tiene stock suficiente. Stock: ${producto.stock} / cantidad: ${cantidad} `);
                    }
                } else {
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
    
            if (conStock.length === 0) {
                CustomError.createError("Datos invalidos", argumentosProductos(req.body),`El carrito con ID ${id} no tiene stock`, Tipos_Error.Argumentos_invalidos);
            }
    
            carrito.productos = sinStock;
            await cartsService.getUpdate(cid, carrito);

        } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
            {
            error:`Error inesperado en el servidor - Intente más tarde`,
            detalle:`${error.message}`
            }
            )
        }

        let nroComprobante = Date.now();
    
            let fecha = new Date();
            let comprador = req.session.user?.email;
    
            let ticket = await ticketModelo.create({
                nroComprob: nroComprobante, 
                fecha: fecha,
                comprador: req.session.user?.email,
                items: conStock,
                total
            });
           
            let message = `
                Hola cliente ...!!!<br>
            Has registrado una compra con n° ticket ${nroComprobante}, por un importe de $ ${total}. <br>
            Detalle: ${JSON.stringify(conStock)} <br>
            ${sinStock.length > 0 ? 'Algunos items no pudieron comprarse... por favor consulte' : ""} <br>
            Por favor contacte a <a href:"mailto:boomarts47@gmail.com">Pagos</a> para finalizar la operación. <br>
            Muchas Gracias!!!
            `;
    
            let resultado = await enviarMail(comprador, "Tu compra esta a un paso de concretarse...", message)
        
        res.setHeader(`Content-Type`, `application/json`);
        return res.status(200).json({ ticket, resultado });
    }

    static getCart = async (req, res) => {
        let { cid, pid } = req.params;
        let { web } = req.body;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            if (web) {
                return res.redirect("carrito/:cid/product/:pid?error=Ingrese Cid / Pid validos")
            } else {
                CustomError.createError("ID invalido", argumentosProductos(req.params),"ID invalido", Tipos_Error.Argumentos_invalidos);
            }
        }

        let carrito = await cartsService.getOneByPopulate({ _id: cid });
        if (!carrito) {
            CustomError.createError("Datos inexistentes", argumentosProductos(req.params),"No existe carrito en la base de datos", Tipos_Error.Argumentos_invalidos);
        }

        let producto = await productService.getProductBy({ _id: pid });
        if (!producto) {
            CustomError.createError("Datos inexistentes", argumentosProductos(req.params),"No existe productos en la base de datos", Tipos_Error.Argumentos_invalidos);
        }

        if (producto.stock === 0) {
            CustomError.createError("Datos invalidos", argumentosProductos(req.body),`El carrito con ID ${id} no tiene stock`, Tipos_Error.Argumentos_invalidos);
        }

        let indiceProd = carrito.productos.findIndex(prod => prod.producto == pid);

        if (indiceProd === -1) {
            carrito.productos.push({ producto: pid, cantidad: 1 });
        } else {
            carrito.productos[indiceProd].cantidad++;
        }

        let resultado = await cartsService.getUpdate(cid, carrito);
        if (resultado.modifiedCount > 0) {
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(200).json({ payload: "carrito actualizado" });
        } else {
            CustomError.createError("Datos invalidos", argumentosProductos(req.body),`El carrito con ID ${id} no esta actualizado`, Tipos_Error.Argumentos_invalidos);
        }
    }

}