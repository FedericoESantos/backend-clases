import { Router } from 'express';
import { UsuariosController } from '../controller/UsuariosController.js';

export const router = Router();

router.get('/', UsuariosController.getUsers);

router.get('/:id', UsuariosController.getUsersBy);

router.post('/', UsuariosController.createUsers);

router.post('/premium/:uid', UsuariosController.createUsers);

router.put("/:id", UsuariosController.updateUsers);

router.delete("/:id", UsuariosController.deleteUsers);