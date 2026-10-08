import { Router } from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { findAll, findOne, add, update, patch, remove } from '../controllers/estudio.controler.js'
import { validate, validateParams } from '../middlewares/validation.js'
import { estudioPatchSchema, estudioSchema, idParams } from '../configs/schemas.js'

export const estudioRouter = Router()

estudioRouter.get('/', findAll)
estudioRouter.get('/:id_estudio', validateParams(idParams('id_estudio')), findOne)
estudioRouter.post('/', verificarToken(['estudios:Agregar']), validate(estudioSchema), add)
estudioRouter.put('/:id_estudio', verificarToken(['estudios:Actualizar']), validateParams(idParams('id_estudio')), validate(estudioSchema), update)
estudioRouter.patch('/:id_estudio', verificarToken(['estudios:Actualizar']), validateParams(idParams('id_estudio')), validate(estudioPatchSchema), patch)
estudioRouter.delete('/:id_estudio', verificarToken(['estudios:Eliminar']), validateParams(idParams('id_estudio')), remove)