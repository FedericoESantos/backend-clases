import { Router } from 'express';
import { ProductController } from '../controller/ProductController.js';
import { upload } from '../utils.js';
import { auth } from '../middlewares/auth.js';

export const router = Router();

router.get('/', ProductController.getAll);

router.get("/:id", ProductController.getBy);
//, auth(["admin"])
router.post('/', upload.single("image"), ProductController.create);

router.put("/:id", auth(["admin","premium"]), ProductController.update);

router.delete("/:id", ProductController.delete); 
