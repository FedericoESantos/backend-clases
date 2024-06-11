import { Router } from 'express';
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.js";
// importamos la logica dentro del archivo de products.js

export const router = Router();

router.get('/', getProducts); // aca traemos todos los productos

router.get("/:pid", getProductById); // aca los traemos por su id

router.post("/", addProduct); // aca los agregamos 

router.put("/:pid", updateProduct); // aca los actualizamos

router.delete("/:id", deleteProduct); // aca los eliminamos

export default router;