import { Router } from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { findAll, findOne, add, update, patch, remove } from '../controllers/turno.controler.js'
import { validate, validateParams } from '../middlewares/validation.js'
import { idParams, turnoSchema, turnoPatchSchema } from '../configs/schemas.js'

export const turnoRouter = Router()

turnoRouter.get('/', verificarToken(['turnos:Leer']), findAll)
turnoRouter.get('/:id_turno', verificarToken(['turnos:Leer']), validateParams(idParams('id_turno')), findOne)
turnoRouter.post('/', verificarToken(['turnos:Agregar']), validate(turnoSchema), add)
turnoRouter.put('/:id_turno', verificarToken(['turnos:Actualizar']), validateParams(idParams('id_turno')), validate(turnoSchema), update)
turnoRouter.patch('/:id_turno', verificarToken(['turnos:Actualizar']), validateParams(idParams('id_turno')), validate(turnoPatchSchema), patch)
turnoRouter.delete('/:id_turno', verificarToken(['turnos:Eliminar']), validateParams(idParams('id_turno')), remove)