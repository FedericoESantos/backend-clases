import { isValidObjectId } from 'mongoose';
import { cartsService } from '../service/Carts.service.js';
import { productService } from '../service/Product.service.js';
import { Tipos_Error } from '../utils/Errors.js';
import { logger } from '../utils/winston.js';

export class CartController {

    static getOneBy = async (req, res) => {
        let { cid } = req.params;

        if (!isValidObjectId(cid)) {
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(400).json(`Ingrese Cid / "${cid}" no es valido`);
        }

        let carrito = await cartsService.getOneBy({ _id: cid });
        if (!carrito) {
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(400).json({error:`Carrito inexistente: id${cid}`});
        }

        res.setHeader(`Content-Type`, `application/json`);
        return res.status(200).json({ carrito });
    }

    static getCart = async (req, res) => {
        let { cid, pid } = req.params;
        let { web } = req.body;
    
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            if (web) {
                return res.redirect("carrito/:cid/product/:pid?error=Ingrese Cid / Pid validos")
            } else {
                res.setHeader(`Content-Type`, `application/json`);
                return res.status(400).json({error:`Ingrese Cid / Pid validos`});
            }
        }
    
        let carrito = await cartsService.getOneByPopulate({ _id: cid });
        if (!carrito) {
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(400).json({error:`Carrito inexistente ${cid}`});
        }
    
        let producto = await productService.getProductBy({ _id: pid });
        if (!producto) {
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(400).json({error:`Producto inexistente ${pid}`});
        }
    
        let usuario = req.session.usuario._doc;
        console.log("Desde Linea 53 usuario ->", usuario, "El producto es ->", producto, "El Carrito ->", carrito);
        // if (usuario.rol === "premium" && producto.owner === usuario._id) {
        //     res.setHeader(`Content-Type`, `application/json`);
        //     return res.status(400).json({ error: "No puedes agregar tu propio producto al carrito." });
        // }
    
        let indiceProd = carrito.productos.findIndex(prod => prod.producto == pid);
        console.log(indiceProd, "Desde linea 60 indice Prod")
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
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error:"El Carrito no se pudo actualizar"})
        }
    }
    
}