import { Router } from 'express'
import { verificarToken } from '../shared/auth.middleware.js'
import { findAll, findOne, add, update, patch, remove } from './proveedor.controler.js'

export const proveedorRouter = Router()

proveedorRouter.get('/', verificarToken(['Administrador']), findAll)
proveedorRouter.get('/:id_proveedor', verificarToken(['Administrador']), findOne)
proveedorRouter.post('/',verificarToken(['Administrador']), add)
proveedorRouter.put('/:id_proveedor',verificarToken(['Administrador']), update)
proveedorRouter.patch('/:id_proveedor',verificarToken(['Administrador']), patch)
proveedorRouter.delete('/:id_proveedor',verificarToken(['Administrador']), remove)