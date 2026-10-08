import { Router } from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { findAll, findOne, add, update, patch, remove } from '../controllers/proveedor.controler.js'
import { validate, validateParams } from '../middlewares/validation.js'
import { idParams, proveedorPatchSchema, proveedorSchema } from '../configs/schemas.js'

export const proveedorRouter = Router()

proveedorRouter.get('/', verificarToken(['proveedores:Leer']), findAll)
proveedorRouter.get('/:id_proveedor', verificarToken(['proveedores:Leer']), validateParams(idParams('id_proveedor')), findOne)
proveedorRouter.post('/', verificarToken(['proveedores:Agregar']), validate(proveedorSchema), add)
proveedorRouter.put('/:id_proveedor', verificarToken(['proveedores:Actualizar']), validateParams(idParams('id_proveedor')), validate(proveedorSchema), update)
proveedorRouter.patch('/:id_proveedor', verificarToken(['proveedores:Actualizar']), validateParams(idParams('id_proveedor')), validate(proveedorPatchSchema), patch)
proveedorRouter.delete('/:id_proveedor', verificarToken(['proveedores:Eliminar']), validateParams(idParams('id_proveedor')), remove)