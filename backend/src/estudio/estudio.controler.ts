import { Request, Response } from 'express'
import { estudioService } from './estudio.service.js'

async function findAll(_req: Request, res: Response) {
  const estudios = await estudioService.findAll()
  return res.status(200).json({ message: 'Estudio found', data: estudios })
}

async function findOne(req: Request, res: Response) {
  const estudio = await estudioService.findOne(Number(req.params.id_estudio))
  if (!estudio) throw new Error('ESTUDIO_NOT_FOUND')
  return res.status(200).json({ message: 'Estudio found', data: estudio })
}

async function add(req: Request, res: Response) {
  const estudio = await estudioService.add(req.body)
  return res.status(201).json({ message: 'Estudio created', data: estudio })
}

async function update(req: Request, res: Response) {
  const estudio = await estudioService.update(Number(req.params.id_estudio), req.body)
  if (!estudio) throw new Error('ESTUDIO_NOT_FOUND')
  return res.status(200).json({ message: 'Estudio updated', data: estudio })
}

async function patch(req: Request, res: Response) {
  const estudio = await estudioService.patch(Number(req.params.id_estudio), req.body)
  if (!estudio) throw new Error('ESTUDIO_NOT_FOUND')
  return res.status(200).json({ message: 'Estudio patched', data: estudio })
}

async function remove(req: Request, res: Response) {
  const estudio = await estudioService.remove(Number(req.params.id_estudio))
  if (!estudio) throw new Error('ESTUDIO_NOT_FOUND')
  return res.status(200).json({ message: 'Estudio removed', data: estudio })
}

export { findAll, findOne, add, update, patch, remove }