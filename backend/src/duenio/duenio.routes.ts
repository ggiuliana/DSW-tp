import { Router } from 'express'
import { findAll, findOne, add, update, patch, remove } from './duenio.controler.js'
import { verificarToken } from '../shared/auth.middleware.js'

export const duenioRouter = Router()


duenioRouter.get('/', findAll)
duenioRouter.get('/:id_duenio', findOne)
duenioRouter.post('/', add)
duenioRouter.put('/:id_duenio', update)
duenioRouter.patch('/:id_duenio', patch)
duenioRouter.delete('/:id_duenio', remove)