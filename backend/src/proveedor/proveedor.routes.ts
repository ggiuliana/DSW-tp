import { Router } from 'express'
import { verificarToken } from '../shared/auth.middleware.js'
import { findAll, findOne, add, update, patch, remove } from './proveedor.controler.js'

export const proveedorRouter = Router()

proveedorRouter.get('/', verificarToken(['proveedores:Leer']), findAll)
proveedorRouter.get('/:id_proveedor', verificarToken(['proveedores:Leer']), findOne)
proveedorRouter.post('/', verificarToken(['proveedores:Agregar']), add)
proveedorRouter.put('/:id_proveedor', verificarToken(['proveedores:Actualizar']), update)
proveedorRouter.patch('/:id_proveedor', verificarToken(['proveedores:Actualizar']), patch)
proveedorRouter.delete('/:id_proveedor', verificarToken(['proveedores:Eliminar']), remove)