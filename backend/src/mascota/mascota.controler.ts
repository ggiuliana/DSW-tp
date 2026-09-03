import { Request, Response } from 'express'
import { mascotaService } from './mascota.service.js'

async function findAll(_req: Request, res: Response) {
  const mascotas = await mascotaService.findAll()
  return res.status(200).json({ message: 'Mascota found', data: mascotas })
}

async function findOne(req: Request, res: Response) {
  const mascota = await mascotaService.findOne(Number(req.params.id_mascota))
  if (!mascota) throw new Error('MASCOTA_NOT_FOUND')
  return res.status(200).json({ message: 'Mascota found', data: mascota })
}

async function findByDuenio(req: Request, res: Response) {
  const mascotas = await mascotaService.findByDuenio(Number(req.params.id_duenio))
  return res.status(200).json({ message: 'Mascota found', data: mascotas })
}

async function add(req: Request, res: Response) {
  const mascota = await mascotaService.add(req.body, Number(req.params.id_duenio))
  return res.status(201).json({ message: 'Mascota created', data: mascota })
}

async function update(req: Request, res: Response) {
  const mascota = await mascotaService.update(Number(req.params.id_mascota), req.body)
  if (!mascota) throw new Error('MASCOTA_NOT_FOUND')
  return res.status(200).json({ message: 'Mascota updated', data: mascota })
}

async function patch(req: Request, res: Response) {
  const mascota = await mascotaService.patch(Number(req.params.id_mascota), req.body)
  if (!mascota) throw new Error('MASCOTA_NOT_FOUND')
  return res.status(200).json({ message: 'Mascota patched', data: mascota })
}

async function remove(req: Request, res: Response) {
  const mascota = await mascotaService.remove(Number(req.params.id_mascota))
  if (!mascota) throw new Error('MASCOTA_NOT_FOUND')
  return res.status(200).json({ message: 'Mascota removed', data: mascota })
}

export { findAll, findOne, findByDuenio, add, update, patch, remove }