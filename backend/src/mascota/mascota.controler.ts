import { Request, Response } from 'express'
import { mascotaService } from './mascota.service.js'

function responderError(error: unknown, res: Response) {
  if (error instanceof Error && error.message === 'DUENIO_NOT_FOUND') {
    return res.status(409).json({ message: 'No se encontró el duenio' })
  }

  return res.status(500).json({
    message: error instanceof Error ? error.message : 'Error interno del servidor',
  })
}

async function findAll(_req: Request, res: Response) {
  try {
    const mascotas = await mascotaService.findAll()
    return res.status(200).json({ message: 'Mascota found', data: mascotas })
  } catch (error) {
    return responderError(error, res)
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const mascota = await mascotaService.findOne(Number(req.params.id_mascota))
    if (!mascota) return res.status(404).json({ message: 'Mascota not found' })
    return res.status(200).json({ message: 'Mascota found', data: mascota })
  } catch (error) {
    return responderError(error, res)
  }
}

async function findByDuenio(req: Request, res: Response) {
  try {
    const mascotas = await mascotaService.findByDuenio(Number(req.params.id_duenio))
    return res.status(200).json({ message: 'Mascota found', data: mascotas })
  } catch (error) {
    return responderError(error, res)
  }
}

async function add(req: Request, res: Response) {
  try {
    const mascota = await mascotaService.add(req.body, Number(req.params.id_duenio))
    return res.status(201).json({ message: 'Mascota created', data: mascota })
  } catch (error) {
    return responderError(error, res)
  }
}

async function update(req: Request, res: Response) {
  try {
    const mascota = await mascotaService.update(Number(req.params.id_mascota), req.body)
    if (!mascota) return res.status(404).json({ message: 'Mascota not found' })
    return res.status(200).json({ message: 'Mascota updated', data: mascota })
  } catch (error) {
    return responderError(error, res)
  }
}

async function patch(req: Request, res: Response) {
  try {
    const mascota = await mascotaService.patch(Number(req.params.id_mascota), req.body)
    if (!mascota) return res.status(404).json({ message: 'Mascota not found' })
    return res.status(200).json({ message: 'Mascota patched', data: mascota })
  } catch (error) {
    return responderError(error, res)
  }
}

async function remove(req: Request, res: Response) {
  try {
    const mascota = await mascotaService.remove(Number(req.params.id_mascota))
    if (!mascota) return res.status(404).json({ message: 'Mascota not found' })
    return res.status(200).json({ message: 'Mascota removed', data: mascota })
  } catch (error) {
    return responderError(error, res)
  }
}

export { findAll, findOne, findByDuenio, add, update, patch, remove }