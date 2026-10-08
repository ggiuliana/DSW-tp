import { Request, Response } from 'express'
import { turnoService } from '../services/turno.service.js'

async function findAll(_req: Request, res: Response) {
  const turnos = await turnoService.findAll()
  return res.status(200).json({ message: 'Turno found', data: turnos })
}

async function findOne(req: Request, res: Response) {
  const turno = await turnoService.findOne(Number(req.params.id_turno))
  if (!turno) throw new Error('TURNO_NOT_FOUND')
  return res.status(200).json({ message: 'Turno found', data: turno })
}

async function add(req: Request, res: Response) {
  const turno = await turnoService.add(req.body)
  return res.status(201).json({ message: 'Turno created', data: turno })
}

async function update(req: Request, res: Response) {
  const turno = await turnoService.update(Number(req.params.id_turno), req.body)
  if (!turno) throw new Error('TURNO_NOT_FOUND')
  return res.status(200).json({ message: 'Turno updated', data: turno })
}

async function patch(req: Request, res: Response) {
  const turno = await turnoService.patch(Number(req.params.id_turno), req.body)
  if (!turno) throw new Error('TURNO_NOT_FOUND')
  return res.status(200).json({ message: 'Turno patched', data: turno })
}

async function remove(req: Request, res: Response) {
  const turno = await turnoService.remove(Number(req.params.id_turno))
  if (!turno) throw new Error('TURNO_NOT_FOUND')
  return res.status(200).json({ message: 'Turno removed', data: turno })
}

export { findAll, findOne, add, update, patch, remove }