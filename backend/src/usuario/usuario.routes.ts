import { Router } from 'express'
import { findAll, findOne, add, update, patch, remove, login } from './usuario.controler.js'
import { verificarToken } from '../shared/auth.middleware.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', verificarToken(['Administrador']), findAll)
usuarioRouter.get('/:id_usuario', verificarToken(['Administrador']), findOne)
usuarioRouter.post('/login', login)
usuarioRouter.post('/:id_persona', verificarToken(['Administrador']), add)
usuarioRouter.put('/:id_usuario', verificarToken(['Administrador']), update)
usuarioRouter.patch('/:id_usuario', verificarToken(['Administrador']), patch)
usuarioRouter.delete('/:id_usuario', verificarToken(['Administrador']), remove)