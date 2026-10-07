import { Router } from 'express'
import { findAll, findOne, add, update, patch, remove } from './duenio.controler.js'
import { verificarToken } from '../shared/auth.middleware.js'
import { validate, validateParams } from '../shared/validation.js'
import { duenioPatchSchema, duenioSchema, idParams } from '../shared/schemas.js'

export const duenioRouter = Router()


duenioRouter.get('/', findAll)
duenioRouter.get('/:id_duenio', validateParams(idParams('id_duenio')), findOne)
duenioRouter.post('/', validate(duenioSchema), add)
duenioRouter.put('/:id_duenio', validateParams(idParams('id_duenio')), validate(duenioSchema), update)
duenioRouter.patch('/:id_duenio', validateParams(idParams('id_duenio')), validate(duenioPatchSchema), patch)
duenioRouter.delete('/:id_duenio', validateParams(idParams('id_duenio')), remove)