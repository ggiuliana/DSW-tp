import { Router } from 'express'
import { verificarToken } from '../shared/auth.middleware.js'
import { findAll, findOne, add, update, patch, remove } from './estudio.controler.js'

export const estudioRouter = Router()

estudioRouter.get('/', findAll)
estudioRouter.get('/:id_estudio', findOne)
estudioRouter.post('/', verificarToken(['estudios:Agregar']), add)
estudioRouter.put('/:id_estudio', verificarToken(['estudios:Actualizar']), update)
estudioRouter.patch('/:id_estudio', verificarToken(['estudios:Actualizar']), patch)
estudioRouter.delete('/:id_estudio', verificarToken(['estudios:Eliminar']), remove)