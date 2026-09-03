import { Request, Response } from 'express'
import { veterinarioService } from './veterinario.service.js'

async function findAll(_req: Request, res: Response) {
  const veterinarios = await veterinarioService.findAll()
  return res.status(200).json({ message: 'Veterinarios found', data: veterinarios })
}

async function findOne(req: Request, res: Response) {
  const veterinario = await veterinarioService.findOne(Number(req.params.id_veterinario))
  if (!veterinario) throw new Error('VETERINARIO_NOT_FOUND')
  return res.status(200).json({ message: 'Veterinario found', data: veterinario })
}

async function add(req: Request, res: Response) {
  const veterinario = await veterinarioService.add(req.body)
  return res.status(201).json({ message: 'Veterinario created', data: veterinario })
}

async function update(req: Request, res: Response) {
  const veterinario = await veterinarioService.update(Number(req.params.id_veterinario), req.body)
  if (!veterinario) throw new Error('VETERINARIO_NOT_FOUND')
  return res.status(200).json({ message: 'Veterinario updated', data: veterinario })
}

async function patch(req: Request, res: Response) {
  const veterinario = await veterinarioService.patch(Number(req.params.id_veterinario), req.body)
  if (!veterinario) throw new Error('VETERINARIO_NOT_FOUND')
  return res.status(200).json({ message: 'Veterinario patched', data: veterinario })
}

async function remove(req: Request, res: Response) {
  const veterinario = await veterinarioService.remove(Number(req.params.id_veterinario))
  if (!veterinario) throw new Error('VETERINARIO_NOT_FOUND')
  return res.status(200).json({ message: 'Veterinario removed', data: veterinario })
}

export { findAll, findOne, add, update, patch, remove }