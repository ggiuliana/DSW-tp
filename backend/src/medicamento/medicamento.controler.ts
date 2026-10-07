import { Request, Response } from 'express'
import { medicamentoService } from './medicamento.service.js'

async function findAll(_req: Request, res: Response) {
  const medicamentos = await medicamentoService.findAll()
  return res.status(200).json({ message: 'Medicamentos found', data: medicamentos })
}

async function findOne(req: Request, res: Response) {
  const medicamento = await medicamentoService.findOne(Number(req.params.id_medicamento))
  if (!medicamento) throw new Error('MEDICAMENTO_NOT_FOUND')
  return res.status(200).json({ message: 'Medicamento found', data: medicamento })
}

async function add(req: Request, res: Response) {
  const medicamento = await medicamentoService.add(req.body)
  return res.status(201).json({ message: 'Medicamento created', data: medicamento })
}

async function update(req: Request, res: Response) {
  const medicamento = await medicamentoService.update(Number(req.params.id_medicamento), req.body)
  if (!medicamento) throw new Error('MEDICAMENTO_NOT_FOUND')
  return res.status(200).json({ message: 'Medicamento updated', data: medicamento })
}

async function patch(req: Request, res: Response) {
  const medicamento = await medicamentoService.patch(Number(req.params.id_medicamento), req.body)
  if (!medicamento) throw new Error('MEDICAMENTO_NOT_FOUND')
  return res.status(200).json({ message: 'Medicamento patched', data: medicamento })
}

async function remove(req: Request, res: Response) {
  const medicamento = await medicamentoService.remove(Number(req.params.id_medicamento))
  if (!medicamento) throw new Error('MEDICAMENTO_NOT_FOUND')
  return res.status(200).json({ message: 'Medicamento removed', data: medicamento })
}

export { findAll, findOne, add, update, patch, remove }