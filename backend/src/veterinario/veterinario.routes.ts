import { Router } from 'express'
import { findAll, findOne, add, update, patch, remove } from './veterinario.controler.js'

export const veterinarioRouter = Router()

veterinarioRouter.get('/', findAll)
veterinarioRouter.get('/:id_veterinario', findOne)
veterinarioRouter.post('/', add)
veterinarioRouter.put('/:id_veterinario', update)
veterinarioRouter.patch('/:id_veterinario', patch)
veterinarioRouter.delete('/:id_veterinario', remove)