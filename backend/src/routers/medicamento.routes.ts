import { Router } from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { validate, validateParams } from '../middlewares/validation.js'
import { idParams, medicamentoPatchSchema, medicamentoSchema } from '../configs/schemas.js'
import { findAll, findOne, add, update, patch, remove } from '../controllers/medicamento.controler.js'

export const medicamentoRouter = Router()

medicamentoRouter.get('/', verificarToken(['medicamentos:Leer']), findAll)
medicamentoRouter.get('/:id_medicamento', verificarToken(['medicamentos:Leer']), validateParams(idParams('id_medicamento')), findOne)
medicamentoRouter.post('/', verificarToken(['medicamentos:Agregar']), validate(medicamentoSchema), add)
medicamentoRouter.put('/:id_medicamento', verificarToken(['medicamentos:Actualizar']), validateParams(idParams('id_medicamento')), validate(medicamentoSchema), update)
medicamentoRouter.patch('/:id_medicamento', verificarToken(['medicamentos:Actualizar']), validateParams(idParams('id_medicamento')), validate(medicamentoPatchSchema), patch)
medicamentoRouter.delete('/:id_medicamento', verificarToken(['medicamentos:Eliminar']), validateParams(idParams('id_medicamento')), remove)