import { Router } from "express";
import { addProductCart, createCart, getCartById } from "../controllers/carts.js";
// importamos la logica dentro del archivo de carts.js

const router = Router();

router.get("/:cid", getCartById); // aca llamamos al carrito por su ID

router.post("/", createCart); // aca creamos el carrito

router.post("/:cid/product/:pid", addProductCart); // aca agregamos producto al carrito

export default router;







