import { Router } from 'express';
import { UsuariosController } from '../controller/UsuariosController.js';
import { auth } from '../middlewares/auth.js';

export const router = Router();

router.get('/', UsuariosController.getUsers);

router.get('/:id', UsuariosController.getUsersBy);

router.post('/', auth(["admin"]), UsuariosController.createUsers);

router.post('/premium/:uid', auth(["admin"]), UsuariosController.createUsers);

router.put("/:id", auth(["admin"]), UsuariosController.updateUsers);

router.delete("/:id", auth(["admin"]), UsuariosController.deleteUsers);