import { Request, Response } from 'express'
import { veterinarioService } from './veterinario.service.js'

function responderError(error: unknown, res: Response) {
  if (error instanceof Error && error.message === 'MAIL_ALREADY_REGISTERED') {
    return res.status(409).json({ message: 'El mail ya está registrado' })
  }

  return res.status(500).json({
    message: error instanceof Error ? error.message : 'Error interno del servidor',
  })
}

async function findAll(_req: Request, res: Response) {
  try {
    const veterinarios = await veterinarioService.findAll()
    return res.status(200).json({ message: 'Veterinarios found', data: veterinarios })
  } catch (error) {
    return responderError(error, res)
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const veterinario = await veterinarioService.findOne(Number(req.params.id_veterinario))
    if (!veterinario) return res.status(404).json({ message: 'Veterinario not found' })
    return res.status(200).json({ message: 'Veterinario found', data: veterinario })
  } catch (error) {
    return responderError(error, res)
  }
}

async function add(req: Request, res: Response) {
  try {
    const veterinario = await veterinarioService.add(req.body)
    return res.status(201).json({ message: 'Veterinario created', data: veterinario })
  } catch (error) {
    return responderError(error, res)
  }
}

async function update(req: Request, res: Response) {
  try {
    const veterinario = await veterinarioService.update(Number(req.params.id_veterinario), req.body)
    if (!veterinario) return res.status(404).json({ message: 'Veterinario not found' })
    return res.status(200).json({ message: 'Veterinario updated', data: veterinario })
  } catch (error) {
    return responderError(error, res)
  }
}

async function patch(req: Request, res: Response) {
  try {
    const veterinario = await veterinarioService.patch(Number(req.params.id_veterinario), req.body)
    if (!veterinario) return res.status(404).json({ message: 'Veterinario not found' })
    return res.status(200).json({ message: 'Veterinario patched', data: veterinario })
  } catch (error) {
    return responderError(error, res)
  }
}

async function remove(req: Request, res: Response) {
  try {
    const veterinario = await veterinarioService.remove(Number(req.params.id_veterinario))
    if (!veterinario) return res.status(404).json({ message: 'Veterinario not found' })
    return res.status(200).json({ message: 'Veterinario removed', data: veterinario })
  } catch (error) {
    return responderError(error, res)
  }
}

export { findAll, findOne, add, update, patch, remove }