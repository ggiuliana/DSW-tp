import { Router } from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { validate, validateParams } from '../middlewares/validation.js'
import { consultaPatchSchema, consultaSchema, idParams } from '../configs/schemas.js'
import { findAll, findParaDuenio, findOne, add, update, patch, remove, findPorMascota } from '../controllers/consulta.controler.js'

export const consultaRouter = Router()

consultaRouter.get('/', verificarToken(['consultas:Leer']), findAll)
consultaRouter.get('/duenio', verificarToken(['consultas:Leer']), findParaDuenio)
consultaRouter.get('/mascota/:id_mascota', verificarToken(['consultas:Leer']), validateParams(idParams('id_mascota')), findPorMascota)
consultaRouter.get('/:id_consulta', verificarToken(['consultas:Leer']), validateParams(idParams('id_consulta')), findOne)
consultaRouter.post('/', verificarToken(['consultas:Agregar']), validate(consultaSchema), add)
consultaRouter.put('/:id_consulta', verificarToken(['consultas:Actualizar']), validateParams(idParams('id_consulta')), validate(consultaSchema), update)
consultaRouter.patch('/:id_consulta', verificarToken(['consultas:Actualizar']), validateParams(idParams('id_consulta')), validate(consultaPatchSchema), patch)
consultaRouter.delete('/:id_consulta', verificarToken(['consultas:Eliminar']), validateParams(idParams('id_consulta')), remove)