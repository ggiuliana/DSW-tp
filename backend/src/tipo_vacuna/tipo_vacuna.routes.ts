import { Router } from 'express'
import { verificarToken } from '../shared/auth.middleware.js'
import { validate, validateParams } from '../shared/validation.js'
import { idParams, tipoVacunaPatchSchema, tipoVacunaSchema } from '../shared/schemas.js'
import { findAll, findOne, add, update, patch, remove } from './tipo_vacuna.controler.js'

export const tipoVacunaRouter = Router()

tipoVacunaRouter.get('/', verificarToken(['tipo_vacunas:Leer']), findAll)
tipoVacunaRouter.get('/:id_tipo_vacuna', verificarToken(['tipo_vacunas:Leer']), validateParams(idParams('id_tipo_vacuna')), findOne)
tipoVacunaRouter.post('/', verificarToken(['tipo_vacunas:Agregar']), validate(tipoVacunaSchema), add)
tipoVacunaRouter.put('/:id_tipo_vacuna', verificarToken(['tipo_vacunas:Actualizar']), validateParams(idParams('id_tipo_vacuna')), validate(tipoVacunaSchema), update)
tipoVacunaRouter.patch('/:id_tipo_vacuna', verificarToken(['tipo_vacunas:Actualizar']), validateParams(idParams('id_tipo_vacuna')), validate(tipoVacunaPatchSchema), patch)
tipoVacunaRouter.delete('/:id_tipo_vacuna', verificarToken(['tipo_vacunas:Eliminar']), validateParams(idParams('id_tipo_vacuna')), remove)