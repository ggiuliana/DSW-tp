import { Request, Response } from 'express'
import { duenioService } from './duenio.service.js'

async function findAll(_req: Request, res: Response) {
  const duenios = await duenioService.findAll()
  return res.status(200).json({ message: 'Duenios found', data: duenios })
}

async function findOne(req: Request, res: Response) {
  const duenio = await duenioService.findOne(Number(req.params.id_duenio))
  if (!duenio) throw new Error('DUENIO_NOT_FOUND')
  return res.status(200).json({ message: 'Duenio found', data: duenio })
}

async function add(req: Request, res: Response) {
  const duenio = await duenioService.add(req.body)
  return res.status(201).json({ message: 'Duenio created', data: duenio })
}

async function update(req: Request, res: Response) {
  const duenio = await duenioService.update(Number(req.params.id_duenio), req.body)
  if (!duenio) throw new Error('DUENIO_NOT_FOUND')
  return res.status(200).json({ message: 'Duenio updated', data: duenio })
}

async function patch(req: Request, res: Response) {
  const duenio = await duenioService.patch(Number(req.params.id_duenio), req.body)
  if (!duenio) throw new Error('DUENIO_NOT_FOUND')
  return res.status(200).json({ message: 'Duenio patched', data: duenio })
}

async function remove(req: Request, res: Response) {
  const duenio = await duenioService.remove(Number(req.params.id_duenio))
  if (!duenio) throw new Error('DUENIO_NOT_FOUND')
  return res.status(200).json({ message: 'Duenio removed', data: duenio })
}

export { findAll, findOne, add, update, patch, remove }