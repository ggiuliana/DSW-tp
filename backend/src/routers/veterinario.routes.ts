import { Router } from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { findAll, findOne, add, update, patch, remove } from '../controllers/veterinario.controler.js'
import { validate, validateParams } from '../middlewares/validation.js'
import { idParams, veterinarioPatchSchema, veterinarioSchema } from '../configs/schemas.js'

export const veterinarioRouter = Router()

veterinarioRouter.get('/', verificarToken(['veterinarios:Leer']), findAll)
veterinarioRouter.get('/:id_veterinario', verificarToken(['veterinarios:Leer']), validateParams(idParams('id_veterinario')), findOne)
veterinarioRouter.post('/', verificarToken(['veterinarios:Agregar']), validate(veterinarioSchema), add)
veterinarioRouter.put('/:id_veterinario', verificarToken(['veterinarios:Actualizar']), validateParams(idParams('id_veterinario')), validate(veterinarioSchema), update)
veterinarioRouter.patch('/:id_veterinario', verificarToken(['veterinarios:Actualizar']), validateParams(idParams('id_veterinario')), validate(veterinarioPatchSchema), patch)
veterinarioRouter.delete('/:id_veterinario', verificarToken(['veterinarios:Eliminar']), validateParams(idParams('id_veterinario')), remove)