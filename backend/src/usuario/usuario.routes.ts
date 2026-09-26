import { Router } from 'express'
import { findAll, findOne, add, update, changePassword, patch, remove, removeCuenta, login, registerDuenio, registerVeterinario } from './usuario.controler.js'
import { verificarCuentaPropia, verificarToken } from '../shared/auth.middleware.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', verificarToken(['usuarios:Leer']), findAll)
usuarioRouter.get('/:id_usuario', verificarToken(['usuarios:Leer']), findOne)
usuarioRouter.post('/login', login)
usuarioRouter.post('/registro', registerDuenio)
usuarioRouter.post('/registro-veterinario', verificarToken(['veterinarios:Agregar']), registerVeterinario)
usuarioRouter.post('/:id_persona', add)
usuarioRouter.delete('/cuenta/:id_usuario', verificarToken(), verificarCuentaPropia, removeCuenta)
usuarioRouter.patch('/cuenta/:id_usuario/contrasenia', verificarToken(), verificarCuentaPropia, changePassword)
usuarioRouter.put('/:id_usuario', verificarToken(['usuarios:Actualizar']), update)
usuarioRouter.patch('/:id_usuario', verificarToken(['usuarios:Actualizar']), patch)
usuarioRouter.delete('/:id_usuario', verificarToken(['usuarios:Eliminar']), remove)