import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js'
import { consultaService } from '../services/consulta.service.js'

async function findAll(_req: Request, res: Response) {
  const consultas = await consultaService.findAll()
  return res.status(200).json({ message: 'Consultas found', data: consultas })
}

async function findParaDuenio(req: Request, res: Response) {
  const autenticado = req as AuthenticatedRequest
  if (autenticado.usuario?.rol !== 'Duenio') throw new Error('TURNOS_OWNER_ONLY')
  const consultas = await consultaService.findParaDuenio(Number(autenticado.usuario.sub))
  return res.status(200).json({ message: 'Consultas del dueño encontradas', data: consultas })
}

async function findOne(req: Request, res: Response) {
  const consulta = await consultaService.findOne(Number(req.params.id_consulta))
  if (!consulta) throw new Error('CONSULTA_NOT_FOUND')
  return res.status(200).json({ message: 'Consulta found', data: consulta })
}

async function add(req: Request, res: Response) {
  const consulta = await consultaService.add(req.body)
  return res.status(201).json({ message: 'Consulta created', data: consulta })
}

async function update(req: Request, res: Response) {
  const consulta = await consultaService.update(Number(req.params.id_consulta), req.body)
  if (!consulta) throw new Error('CONSULTA_NOT_FOUND')
  return res.status(200).json({ message: 'Consulta updated', data: consulta })
}

async function patch(req: Request, res: Response) {
  const consulta = await consultaService.patch(Number(req.params.id_consulta), req.body)
  if (!consulta) throw new Error('CONSULTA_NOT_FOUND')
  return res.status(200).json({ message: 'Consulta patched', data: consulta })
}

async function remove(req: Request, res: Response) {
  const consulta = await consultaService.remove(Number(req.params.id_consulta))
  if (!consulta) throw new Error('CONSULTA_NOT_FOUND')
  return res.status(200).json({ message: 'Consulta removed', data: consulta })
}

async function findPorMascota(req: Request, res: Response) {
  const consultas = await consultaService.findPorMascotaResueltos(Number(req.params.id_mascota));
  return res.status(200).json({ message: 'Consultas de la mascota encontradas', data: consultas });
}

export { findAll, findParaDuenio, findOne, add, update, patch, remove, findPorMascota }