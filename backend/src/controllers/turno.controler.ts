import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js'
import { turnoService } from '../services/turno.service.js'

async function findAll(_req: Request, res: Response) {
  const turnos = await turnoService.findAll()
  return res.status(200).json({ message: 'Turno found', data: turnos })
}

async function findParaDuenio(req: Request, res: Response) {
  const autenticado = req as AuthenticatedRequest
  if (autenticado.usuario?.rol !== 'Duenio') throw new Error('TURNOS_OWNER_ONLY')
  const turnos = await turnoService.findParaDuenio(Number(autenticado.usuario.sub))
  return res.status(200).json({ message: 'Turnos del dueño encontrados', data: turnos })
}
async function findOne(req: Request, res: Response) {
  const turno = await turnoService.findOne(Number(req.params.id_turno))
  if (!turno) throw new Error('TURNO_NOT_FOUND')
  return res.status(200).json({ message: 'Turno found', data: turno })
}
async function findByVeterinario(req: Request, res: Response) {
  const turnos = await turnoService.findByVeterinario(Number(req.params.id_vet))
  return res.status(200).json({ message: 'Turno found', data: turnos })
}

async function add(req: Request, res: Response) {
  if ((req as AuthenticatedRequest).usuario?.rol === 'Veterinario') req.body.estado_turno = 'Pendiente'
  const turno = await turnoService.add(req.body)
  return res.status(201).json({ message: 'Turno created', data: turno })
}

async function update(req: Request, res: Response) {
  const rol = (req as AuthenticatedRequest).usuario?.rol
  if (rol === 'Duenio') throw new Error('TURNOS_USE_BOOKING_ROUTE')
  if (rol === 'Veterinario' && Object.prototype.hasOwnProperty.call(req.body, 'estado_turno')) {
    throw new Error('TURNOS_STATUS_FORBIDDEN')
  }
  const turno = await turnoService.update(Number(req.params.id_turno), req.body)
  if (!turno) throw new Error('TURNO_NOT_FOUND')
  return res.status(200).json({ message: 'Turno updated', data: turno })
}

async function patch(req: Request, res: Response) {
  const rol = (req as AuthenticatedRequest).usuario?.rol
  if (rol === 'Duenio') throw new Error('TURNOS_USE_BOOKING_ROUTE')
  if (rol === 'Veterinario' && Object.prototype.hasOwnProperty.call(req.body, 'estado_turno')) {
    throw new Error('TURNOS_STATUS_FORBIDDEN')
  }
  const turno = await turnoService.patch(Number(req.params.id_turno), req.body)
  if (!turno) throw new Error('TURNO_NOT_FOUND')
  return res.status(200).json({ message: 'Turno patched', data: turno })
}

async function otorgar(req: Request, res: Response) {
  const autenticado = req as AuthenticatedRequest
  if (autenticado.usuario?.rol !== 'Duenio') throw new Error('TURNOS_OWNER_ONLY')
  const turno = await turnoService.otorgar(
    Number(req.params.id_turno),
    Number(req.body.id_mascota),
    Number(autenticado.usuario.sub),
  )
  if (!turno) throw new Error('TURNO_NOT_FOUND')
  return res.status(200).json({ message: 'Turno otorgado', data: turno })
}

async function remove(req: Request, res: Response) {
  const turno = await turnoService.remove(Number(req.params.id_turno))
  if (!turno) throw new Error('TURNO_NOT_FOUND')
  return res.status(200).json({ message: 'Turno removed', data: turno })
}

export { findAll, findParaDuenio, findOne, findByVeterinario, add, update, patch, otorgar, remove }