import { Request, Response, NextFunction } from 'express'
import { Duenio } from './duenio.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const duenios = await em.find(Duenio, {})
    res.status(200).json({ message: "Duenios found", data: duenios })
  } catch (error) {
  res.status(500).json({
    message: (error as Error).message
  });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const duenio = await em.findOne(Duenio, { id_persona: parseInt(req.params.id_duenio as string) })
    if (!duenio) {
      return res.status(404).json({ message: "Duenio not found" })
    }
    res.status(200).json({ message: "Duenio found", data: duenio })
  } catch (error) {
  res.status(500).json({
    message: (error as Error).message
  });
  }
}

async function add(req: Request, res: Response) {
  const { nombre, apellido, telefono, mail, dni, direccion } = req.body
  const mailNormalizado = mail.trim().toLowerCase()
  const duenioExistente = await em.findOne(Duenio, { mail: mailNormalizado })

  if (duenioExistente) {
    return res.status(409).json({ message: "El mail ya está registrado" })
  }

  const persona = em.create(Duenio, {
    nombre,
    apellido,
    telefono,
    mail: mailNormalizado,
    dni,
    direccion
  })
  await em.flush()
  res.status(201).json({ message: "Persona created", data: persona })
}

async function update(req: Request, res: Response) {
  const { nombre, apellido, telefono, mail, dni, direccion } = req.body
  const duenio = await em.findOne(Duenio, { id_persona: parseInt(req.params.id_duenio as string) })
  if (!duenio) {
    return res.status(404).json({ message: "Duenio not found" })
  }
  const mailNormalizado = mail.trim().toLowerCase()
  const duenioExistente = await em.findOne(Duenio, { mail: mailNormalizado })
  if (duenioExistente) {
    return res.status(409).json({ message: "El mail ya está registrado" })
  }
  em.assign(duenio, {
    nombre,
    apellido,
    telefono,
    mail: mailNormalizado,
    dni,
    direccion
  })
  await em.flush()
  res.status(200).json({ message: "Duenio updated", data: duenio })
}

async function patch(req: Request, res: Response) {
  const duenio = await em.findOne(Duenio, { id_persona: parseInt(req.params.id_duenio as string) })
  if (!duenio) {
    return res.status(404).json({ message: "Duenio not found" })
  }
  em.assign(duenio, req.body)
  await em.flush()
  res.status(200).json({ message: "Duenio patched", data: duenio })
}

async function remove(req: Request, res: Response) {
  const duenio = await em.findOne(Duenio, { id_persona: parseInt(req.params.id_duenio as string) })
  if (!duenio) {
    return res.status(404).json({ message: "Duenio not found" })
  }
  await em.remove(duenio)
  await em.flush()
  res.status(200).json({ message: "Duenio removed", data: duenio })
}

export { findAll, findOne, add, update, patch, remove }