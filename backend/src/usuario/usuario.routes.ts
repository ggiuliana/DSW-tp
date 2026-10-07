import { Router } from 'express'
import { findAll, findOne, add, update, changePassword, patch, remove, removeCuenta, login, registerDuenio, registerVeterinario } from './usuario.controler.js'
import { verificarCuentaPropia, verificarToken } from '../shared/auth.middleware.js'
import { validate, validateParams } from '../shared/validation.js'
import { cambioContraseniaSchema, idParams, loginSchema, registroDuenioSchema, registroVeterinarioSchema, usuarioPatchSchema, usuarioSchema } from '../shared/schemas.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', verificarToken(['usuarios:Leer']), findAll)
usuarioRouter.get('/:id_usuario', verificarToken(['usuarios:Leer']), validateParams(idParams('id_usuario')), findOne)
usuarioRouter.post('/login', validate(loginSchema), login)
usuarioRouter.post('/registro', validate(registroDuenioSchema), registerDuenio)
usuarioRouter.post('/registro-veterinario', verificarToken(['veterinarios:Agregar']), validate(registroVeterinarioSchema), registerVeterinario)
usuarioRouter.post('/:id_persona', validateParams(idParams('id_persona')), validate(usuarioSchema), add)
usuarioRouter.delete('/cuenta/:id_usuario', verificarToken(), validateParams(idParams('id_usuario')), verificarCuentaPropia, removeCuenta)
usuarioRouter.patch('/cuenta/:id_usuario/contrasenia', verificarToken(), validateParams(idParams('id_usuario')), verificarCuentaPropia, validate(cambioContraseniaSchema), changePassword)
usuarioRouter.put('/:id_usuario', verificarToken(['usuarios:Actualizar']), validateParams(idParams('id_usuario')), validate(usuarioPatchSchema), update)
usuarioRouter.patch('/:id_usuario', verificarToken(['usuarios:Actualizar']), validateParams(idParams('id_usuario')), validate(usuarioPatchSchema), patch)
usuarioRouter.delete('/:id_usuario', verificarToken(['usuarios:Eliminar']), validateParams(idParams('id_usuario')), remove)