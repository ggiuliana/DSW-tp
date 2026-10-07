import { Router } from 'express'
import { findAll, findOne, add, update, patch, remove } from './veterinario.controler.js'
import { validate, validateParams } from '../shared/validation.js'
import { idParams, veterinarioPatchSchema, veterinarioSchema } from '../shared/schemas.js'

export const veterinarioRouter = Router()

veterinarioRouter.get('/', findAll)
veterinarioRouter.get('/:id_veterinario', validateParams(idParams('id_veterinario')), findOne)
veterinarioRouter.post('/', validate(veterinarioSchema), add)
veterinarioRouter.put('/:id_veterinario', validateParams(idParams('id_veterinario')), validate(veterinarioSchema), update)
veterinarioRouter.patch('/:id_veterinario', validateParams(idParams('id_veterinario')), validate(veterinarioPatchSchema), patch)
veterinarioRouter.delete('/:id_veterinario', validateParams(idParams('id_veterinario')), remove)