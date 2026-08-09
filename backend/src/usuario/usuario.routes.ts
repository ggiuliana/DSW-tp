import { Router } from 'express'
import { findAll, findOne, add, update, patch, remove } from './usuario.controler.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id_usuario', findOne)
usuarioRouter.post('/:id_persona', add)
usuarioRouter.put('/:id_usuario', update)
usuarioRouter.patch('/:id_usuario', patch)
usuarioRouter.delete('/:id_usuario', remove)