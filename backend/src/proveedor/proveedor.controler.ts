import { Request, Response } from 'express'
import { proveedorService } from './proveedor.service.js'

async function findAll(_req: Request, res: Response) {
  const proveedors = await proveedorService.findAll()
  return res.status(200).json({ message: 'Proveedor found', data: proveedors })
}

async function findOne(req: Request, res: Response) {
  const proveedor = await proveedorService.findOne(Number(req.params.id_proveedor))
  if (!proveedor) throw new Error('PROVEEDOR_NOT_FOUND')
  return res.status(200).json({ message: 'Proveedor found', data: proveedor })
}

async function add(req: Request, res: Response) {
  const proveedor = await proveedorService.add(req.body)
  return res.status(201).json({ message: 'Proveedor created', data: proveedor })
}

async function update(req: Request, res: Response) {
  const proveedor = await proveedorService.update(Number(req.params.id_proveedor), req.body)
  if (!proveedor) throw new Error('PROVEEDOR_NOT_FOUND')
  return res.status(200).json({ message: 'Proveedor updated', data: proveedor })
}

async function patch(req: Request, res: Response) {
  const proveedor = await proveedorService.patch(Number(req.params.id_proveedor), req.body)
  if (!proveedor) throw new Error('PROVEEDOR_NOT_FOUND')
  return res.status(200).json({ message: 'Proveedor patched', data: proveedor })
}

async function remove(req: Request, res: Response) {
  const proveedor = await proveedorService.remove(Number(req.params.id_proveedor))
  if (!proveedor) throw new Error('PROVEEDOR_NOT_FOUND')
  return res.status(200).json({ message: 'Proveedor removed', data: proveedor })
}

export { findAll, findOne, add, update, patch, remove }