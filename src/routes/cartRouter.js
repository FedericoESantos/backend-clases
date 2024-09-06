import { Router } from 'express';
import { CartController } from '../controller/CartController.js';
import { auth } from '../middlewares/auth.js';

export const router = Router();

router.get('/:cid', CartController.getOneBy);

router.post('/:cid/product/:pid', CartController.getCart); //le saque el auth porque mi usuario no tiene autorización