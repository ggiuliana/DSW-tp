import { Request, Response, NextFunction } from 'express'
import { Veterinario } from './veterinario.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const veterinarios = await em.find(Veterinario, {})
    res.status(200).json({ message: "Veterinarios found", data: veterinarios })
  } catch (error) {
  res.status(500).json({
    message: (error as Error).message
  });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const veterinario = await em.findOne(Veterinario, { id_persona: parseInt(req.params.id_veterinario as string) })
    if (!veterinario) {
      return res.status(404).json({ message: "Veterinario not found" })
    }
    res.status(200).json({ message: "Veterinario found", data: veterinario })
  } catch (error) {
  res.status(500).json({
    message: (error as Error).message
  });
  }
}

async function add(req: Request, res: Response) {
  const { nombre, apellido, telefono, mail, dni, direccion, matricula, especialidad } = req.body
  const veterinario = em.create(Veterinario, {
    nombre,
    apellido,
    telefono,
    mail,
    dni,
    direccion,
    matricula,
    especialidad
  })
  await em.flush()
  res.status(201).json({ message: "Veterinario created", data: veterinario })
}

async function update(req: Request, res: Response) {
  const { nombre, apellido, telefono, mail, dni, direccion, matricula, especialidad } = req.body
  const veterinario = await em.findOne(Veterinario, { id_persona: parseInt(req.params.id_veterinario as string) })
  if (!veterinario) {
    return res.status(404).json({ message: "Veterinario not found" })
  }
  em.assign(veterinario, {
    nombre,
    apellido,
    telefono,
    mail,
    dni,
    direccion,
    matricula,
    especialidad
  })
  await em.flush()
  res.status(200).json({ message: "Veterinario updated", data: veterinario })
}

async function patch(req: Request, res: Response) {
  const veterinario = await em.findOne(Veterinario, { id_persona: parseInt(req.params.id_veterinario as string) })
  if (!veterinario) {
    return res.status(404).json({ message: "Veterinario not found" })
  }
  em.assign(veterinario, req.body)
  await em.flush()
  res.status(200).json({ message: "Veterinario patched", data: veterinario })
}

async function remove(req: Request, res: Response) {
  const veterinario = await em.findOne(Veterinario, { id_persona: parseInt(req.params.id_veterinario as string) })
  if (!veterinario) {
    return res.status(404).json({ message: "Veterinario not found" })
  }
  await em.remove(veterinario)
  await em.flush()
  res.status(200).json({ message: "Veterinario removed", data: veterinario })
}

export { findAll, findOne, add, update, patch, remove }