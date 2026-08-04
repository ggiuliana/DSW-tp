import { Router } from 'express'
import { findAll, findOne, add, update, patch, remove } from './persona.controler.js'

export const personaRouter = Router()

personaRouter.get('/', findAll)
personaRouter.get('/:id_persona', findOne)
personaRouter.post('/', add)
personaRouter.put('/:id_persona', update)
personaRouter.patch('/:id_persona', patch)
personaRouter.delete('/:id_persona', remove)