import { Router } from 'express'
import { findAll, findOne, findByDuenio, add, update, patch, remove } from '../controllers/mascota.controler.js'
import { validate, validateParams } from '../middlewares/validation.js'
import { idParams, mascotaPatchSchema, mascotaSchema } from '../configs/schemas.js'

export const mascotaRouter = Router()

mascotaRouter.get('/', findAll)
mascotaRouter.get('/:id_mascota', validateParams(idParams('id_mascota')), findOne)
mascotaRouter.get('/duenio/:id_duenio', validateParams(idParams('id_duenio')), findByDuenio)
mascotaRouter.post('/duenio/:id_duenio', validateParams(idParams('id_duenio')), validate(mascotaSchema), add)
mascotaRouter.put('/:id_mascota', validateParams(idParams('id_mascota')), validate(mascotaSchema), update)
mascotaRouter.patch('/:id_mascota', validateParams(idParams('id_mascota')), validate(mascotaPatchSchema), patch)
mascotaRouter.delete('/:id_mascota', validateParams(idParams('id_mascota')), remove)