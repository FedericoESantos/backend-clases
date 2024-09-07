import { Router } from 'express';
import { CartController } from '../controller/CartController.js';
import { auth } from '../middlewares/auth.js';

export const router = Router();

router.get('/:cid', CartController.getOneBy);

router.get('/:cid/comprar', auth(["user"]), CartController.buyCart);

router.post('/:cid/product/:pid', auth(["admin"]), CartController.getCart); 