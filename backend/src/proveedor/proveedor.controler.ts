import { Request, Response } from 'express'
import { proveedorService } from './proveedor.service.js'

function responderError(error: unknown, res: Response) {
  if (error instanceof Error && error.message === 'PROVEEDOR_NOT_FOUND') {
    return res.status(409).json({ message: 'No se encontró el proveedor' })
  }

  return res.status(500).json({
    message: error instanceof Error ? error.message : 'Error interno del servidor',
  })
}

async function findAll(_req: Request, res: Response) {
  try {
    const proveedors = await proveedorService.findAll()
    return res.status(200).json({ message: 'Proveedor found', data: proveedors })
  } catch (error) {
    return responderError(error, res)
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const proveedor = await proveedorService.findOne(Number(req.params.id_proveedor))
    if (!proveedor) return res.status(404).json({ message: 'Proveedor not found' })
    return res.status(200).json({ message: 'Proveedor found', data: proveedor })
  } catch (error) {
    return responderError(error, res)
  }
}

async function add(req: Request, res: Response) {
  try {
    const proveedor = await proveedorService.add(req.body)
    return res.status(201).json({ message: 'Proveedor created', data: proveedor })
  } catch (error) {
    return responderError(error, res)
  }
}

async function update(req: Request, res: Response) {
  try {
    const proveedor = await proveedorService.update(Number(req.params.id_proveedor), req.body)
    if (!proveedor) return res.status(404).json({ message: 'Proveedor not found' })
    return res.status(200).json({ message: 'Proveedor updated', data: proveedor })
  } catch (error) {
    return responderError(error, res)
  }
}

async function patch(req: Request, res: Response) {
  try {
    const proveedor = await proveedorService.patch(Number(req.params.id_proveedor), req.body)
    if (!proveedor) return res.status(404).json({ message: 'Proveedor not found' })
    return res.status(200).json({ message: 'Proveedor patched', data: proveedor })
  } catch (error) {
    return responderError(error, res)
  }
}

async function remove(req: Request, res: Response) {
  try {
    const proveedor = await proveedorService.remove(Number(req.params.id_proveedor))
    if (!proveedor) return res.status(404).json({ message: 'Proveedor not found' })
    return res.status(200).json({ message: 'Proveedor removed', data: proveedor })
  } catch (error) {
    return responderError(error, res)
  }
}

export { findAll, findOne, add, update, patch, remove }