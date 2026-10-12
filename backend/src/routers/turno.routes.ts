import { Router } from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { findAll, findParaDuenio, findOne, findByVeterinario, add, update, patch, otorgar, remove } from '../controllers/turno.controler.js'
import { validate, validateParams } from '../middlewares/validation.js'
import { idParams, turnoSchema, turnoPatchSchema, turnoOtorgarSchema } from '../configs/schemas.js'

export const turnoRouter = Router()

turnoRouter.get('/', verificarToken(['turnos:Leer']), findAll)
turnoRouter.get('/duenio', verificarToken(['turnos:Leer']), findParaDuenio)
turnoRouter.get('/:id_turno', verificarToken(['turnos:Leer']), validateParams(idParams('id_turno')), findOne)
turnoRouter.get('/veterinario/:id_vet', verificarToken(['turnos:Leer']), validateParams(idParams('id_vet')), findByVeterinario)
turnoRouter.post('/', verificarToken(['turnos:Agregar']), validate(turnoSchema), add)
turnoRouter.patch('/:id_turno/otorgar', verificarToken(['turnos:Actualizar']), validateParams(idParams('id_turno')), validate(turnoOtorgarSchema), otorgar)
turnoRouter.put('/:id_turno', verificarToken(['turnos:Actualizar']), validateParams(idParams('id_turno')), validate(turnoSchema), update)
turnoRouter.patch('/:id_turno', verificarToken(['turnos:Actualizar']), validateParams(idParams('id_turno')), validate(turnoPatchSchema), patch)
turnoRouter.delete('/:id_turno', verificarToken(['turnos:Eliminar']), validateParams(idParams('id_turno')), remove)