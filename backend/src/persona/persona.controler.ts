import { Request, Response, NextFunction } from 'express'
import { Persona } from './persona.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const personas = await em.find(Persona, {})
    res.status(200).json({ message: "Personas found", data: personas })
  } catch (error) {
  res.status(500).json({
    message: (error as Error).message
  });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const persona = await em.findOne(Persona, { id_persona: parseInt(req.params.id_persona as string) })
    if (!persona) {
      return res.status(404).json({ message: "Persona not found" })
    }
    res.status(200).json({ message: "Persona found", data: persona })
  } catch (error) {
  res.status(500).json({
    message: (error as Error).message
  });
  }
}

async function add(req: Request, res: Response) {
  const { nombre, apellido, telefono, mail, dni, direccion } = req.body
  const persona = em.create(Persona, {
    nombre,
    apellido,
    telefono,
    mail,
    dni,
    direccion
  })
  await em.flush()
  res.status(201).json({ message: "Persona created", data: persona })
}

async function update(req: Request, res: Response) {
  const { nombre, apellido, telefono, mail, dni, direccion } = req.body
  const persona = await em.findOne(Persona, { id_persona: parseInt(req.params.id_persona as string) })
  if (!persona) {
    return res.status(404).json({ message: "Persona not found" })
  }
  em.assign(persona, {
    nombre,
    apellido,
    telefono,
    mail,
    dni,
    direccion
  })
  await em.flush()
  res.status(200).json({ message: "Persona updated", data: persona })
}

async function patch(req: Request, res: Response) {
  const persona = await em.findOne(Persona, { id_persona: parseInt(req.params.id_persona as string) })
  if (!persona) {
    return res.status(404).json({ message: "Persona not found" })
  }
  em.assign(persona, req.body)
  await em.flush()
  res.status(200).json({ message: "Persona patched", data: persona })
}

async function remove(req: Request, res: Response) {
  const persona = await em.findOne(Persona, { id_persona: parseInt(req.params.id_persona as string) })
  if (!persona) {
    return res.status(404).json({ message: "Persona not found" })
  }
  await em.remove(persona)
  await em.flush()
  res.status(200).json({ message: "Persona removed", data: persona })
}

export { findAll, findOne, add, update, patch, remove }