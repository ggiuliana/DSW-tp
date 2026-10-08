import { Request, Response } from 'express'
import { tipoVacunaService } from '../services/tipo_vacuna.service.js'

async function findAll(_req: Request, res: Response) {
  const tiposVacuna = await tipoVacunaService.findAll()
  return res.status(200).json({ message: 'Tipos de vacuna encontrados', data: tiposVacuna })
}

async function findOne(req: Request, res: Response) {
  const tipoVacuna = await tipoVacunaService.findOne(Number(req.params.id_tipo_vacuna))
  if (!tipoVacuna) throw new Error('TIPO_VACUNA_NOT_FOUND')
  return res.status(200).json({ message: 'Tipo de vacuna encontrado', data: tipoVacuna })
}

async function add(req: Request, res: Response) {
  const tipoVacuna = await tipoVacunaService.add(req.body)
  return res.status(201).json({ message: 'Tipo de vacuna creado', data: tipoVacuna })
}

async function update(req: Request, res: Response) {
  const tipoVacuna = await tipoVacunaService.update(Number(req.params.id_tipo_vacuna), req.body)
  if (!tipoVacuna) throw new Error('TIPO_VACUNA_NOT_FOUND')
  return res.status(200).json({ message: 'Tipo de vacuna actualizado', data: tipoVacuna })
}

async function patch(req: Request, res: Response) {
  const tipoVacuna = await tipoVacunaService.patch(Number(req.params.id_tipo_vacuna), req.body)
  if (!tipoVacuna) throw new Error('TIPO_VACUNA_NOT_FOUND')
  return res.status(200).json({ message: 'Tipo de vacuna actualizado', data: tipoVacuna })
}

async function remove(req: Request, res: Response) {
  const tipoVacuna = await tipoVacunaService.remove(Number(req.params.id_tipo_vacuna))
  if (!tipoVacuna) throw new Error('TIPO_VACUNA_NOT_FOUND')
  return res.status(200).json({ message: 'Tipo de vacuna eliminado', data: tipoVacuna })
}

export { findAll, findOne, add, update, patch, remove }