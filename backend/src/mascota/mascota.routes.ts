import { Router } from 'express'
import { findAll, findOne, findByDuenio, add, update, patch, remove } from './mascota.controler.js'

export const mascotaRouter = Router()

mascotaRouter.get('/', findAll)
mascotaRouter.get('/:id_mascota', findOne)
mascotaRouter.get('/duenio/:id_duenio', findByDuenio)
mascotaRouter.post('/duenio/:id_duenio', add)
mascotaRouter.put('/:id_mascota', update)
mascotaRouter.patch('/:id_mascota', patch)
mascotaRouter.delete('/:id_mascota', remove)