import { Router } from 'express'
import { verificarToken } from '../shared/auth.middleware.js'
import { findAll, findOne, add, update, patch, remove } from './estudio.controler.js'

export const estudioRouter = Router()

estudioRouter.get('/', findAll)
estudioRouter.get('/:id_estudio', findOne)
estudioRouter.post('/',verificarToken(['Administrador']), add)
estudioRouter.put('/:id_estudio',verificarToken(['Administrador']), update)
estudioRouter.patch('/:id_estudio',verificarToken(['Administrador']), patch)
estudioRouter.delete('/:id_estudio',verificarToken(['Administrador']), remove)