import { Request, Response } from 'express'
import { duenioService } from './duenio.service.js'

function responderError(error: unknown, res: Response) {
  if (error instanceof Error && error.message === 'MAIL_ALREADY_REGISTERED') {
    return res.status(409).json({ message: 'El mail ya está registrado' })
  }
  if (error instanceof Error && error.message === 'INVALID_EMAIL_FORMAT') {
    return res.status(400).json({ message: 'El mail debe tener un formato válido, por ejemplo mail@mail.com' })
  }

  return res.status(500).json({
    message: error instanceof Error ? error.message : 'Error interno del servidor',
  })
}

async function findAll(_req: Request, res: Response) {
  try {
    const duenios = await duenioService.findAll()
    return res.status(200).json({ message: 'Duenios found', data: duenios })
  } catch (error) {
    return responderError(error, res)
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const duenio = await duenioService.findOne(Number(req.params.id_duenio))
    if (!duenio) return res.status(404).json({ message: 'Duenio not found' })
    return res.status(200).json({ message: 'Duenio found', data: duenio })
  } catch (error) {
    return responderError(error, res)
  }
}

async function add(req: Request, res: Response) {
  try {
    const duenio = await duenioService.add(req.body)
    return res.status(201).json({ message: 'Duenio created', data: duenio })
  } catch (error) {
    return responderError(error, res)
  }
}

async function update(req: Request, res: Response) {
  try {
    const duenio = await duenioService.update(Number(req.params.id_duenio), req.body)
    if (!duenio) return res.status(404).json({ message: 'Duenio not found' })
    return res.status(200).json({ message: 'Duenio updated', data: duenio })
  } catch (error) {
    return responderError(error, res)
  }
}

async function patch(req: Request, res: Response) {
  try {
    const duenio = await duenioService.patch(Number(req.params.id_duenio), req.body)
    if (!duenio) return res.status(404).json({ message: 'Duenio not found' })
    return res.status(200).json({ message: 'Duenio patched', data: duenio })
  } catch (error) {
    return responderError(error, res)
  }
}

async function remove(req: Request, res: Response) {
  try {
    const duenio = await duenioService.remove(Number(req.params.id_duenio))
    if (!duenio) return res.status(404).json({ message: 'Duenio not found' })
    return res.status(200).json({ message: 'Duenio removed', data: duenio })
  } catch (error) {
    return responderError(error, res)
  }
}

export { findAll, findOne, add, update, patch, remove }