import { Request, Response } from 'express'
import { estudioService } from './estudio.service.js'

function responderError(error: unknown, res: Response) {
  if (error instanceof Error && error.message === 'ESTUDIO_NOT_FOUND') {
    return res.status(409).json({ message: 'No se encontró el estudio' })
  }

  return res.status(500).json({
    message: error instanceof Error ? error.message : 'Error interno del servidor',
  })
}

async function findAll(_req: Request, res: Response) {
  try {
    const estudios = await estudioService.findAll()
    return res.status(200).json({ message: 'Estudio found', data: estudios })
  } catch (error) {
    return responderError(error, res)
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const estudio = await estudioService.findOne(Number(req.params.id_estudio))
    if (!estudio) return res.status(404).json({ message: 'Estudio not found' })
    return res.status(200).json({ message: 'Estudio found', data: estudio })
  } catch (error) {
    return responderError(error, res)
  }
}

async function add(req: Request, res: Response) {
  try {
    const estudio = await estudioService.add(req.body)
    return res.status(201).json({ message: 'Estudio created', data: estudio })
  } catch (error) {
    return responderError(error, res)
  }
}

async function update(req: Request, res: Response) {
  try {
    const estudio = await estudioService.update(Number(req.params.id_estudio), req.body)
    if (!estudio) return res.status(404).json({ message: 'Estudio not found' })
    return res.status(200).json({ message: 'Estudio updated', data: estudio })
  } catch (error) {
    return responderError(error, res)
  }
}

async function patch(req: Request, res: Response) {
  try {
    const estudio = await estudioService.patch(Number(req.params.id_estudio), req.body)
    if (!estudio) return res.status(404).json({ message: 'Estudio not found' })
    return res.status(200).json({ message: 'Estudio patched', data: estudio })
  } catch (error) {
    return responderError(error, res)
  }
}

async function remove(req: Request, res: Response) {
  try {
    const estudio = await estudioService.remove(Number(req.params.id_estudio))
    if (!estudio) return res.status(404).json({ message: 'Estudio not found' })
    return res.status(200).json({ message: 'Estudio removed', data: estudio })
  } catch (error) {
    return responderError(error, res)
  }
}

export { findAll, findOne, add, update, patch, remove }