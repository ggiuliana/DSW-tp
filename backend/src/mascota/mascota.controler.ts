import { Request, Response, NextFunction } from 'express'
import { Mascota } from './mascota.entity.js'
import { Duenio } from '../duenio/duenio.entity.js'
import { Persona } from '../persona/persona.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const mascotas = await em.find(Mascota, {})
    res.status(200).json({ message: "Mascotas found", data: mascotas })
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message
    });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const mascota = await em.findOne(Mascota, { id_mascota: parseInt(req.params.id_mascota as string) })
    if (!mascota) {
      return res.status(404).json({ message: "Mascota not found" })
    }
    res.status(200).json({ message: "Mascota found", data: mascota })
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message
    });
  }
}

async function findByDuenio(req: Request, res: Response) {
  try{
    const persona = await em.findOne(Persona, {
      id_persona: parseInt(req.params.id_duenio as string)
    });
    if (!persona) {
      return res.status(404).json({message: "Duenio not found"});
    }
    const duenio = await em.findOne(Duenio, {persona: persona});
    if (!duenio) {
      return res.status(404).json({message: "Duenio not found"});
    }
    const mascotas = await em.find(Mascota, {duenio: duenio});
    return res.status(200).json({message: "Mascotas found",data: mascotas});
  }catch(error){
    return res.status(500).json({message: (error as Error).message});
  }
}

async function add(req: Request, res: Response) {
  const duenio = await em.findOne(Duenio, 
        { persona: await em.findOne(Persona, { id_persona: parseInt(req.params.id_duenio as string) }) 
      })
  const { nombre_mascota, especie, raza, castrado, sexo, fechaNac } = req.body
  if(!duenio){
    return res.status(404).json({ message: "Duenio not found" })
  }
  const mascota = em.create(Mascota, {
    nombre_mascota,
    especie,
    raza,
    castrado,
    sexo,
    fechaNac,
    duenio,
  }) 
  await em.flush()
  res.status(201).json({ message: "Mascota created", data: mascota })
}

async function update(req: Request, res: Response) {
  const { nombre_mascota, especie, raza, castrado, sexo, fechaNac, duenio } = req.body
  const mascota = await em.findOne(Mascota, { id_mascota: parseInt(req.params.id_mascota as string) })
  if (!mascota) {
    return res.status(404).json({ message: "Mascota not found" })
  }
  em.assign(mascota, {
    nombre_mascota,
    especie,
    raza,
    castrado,
    sexo,
    fechaNac,
    duenio,
  })
  await em.flush()
  res.status(200).json({ message: "Mascota updated", data: mascota })
}

async function patch(req: Request, res: Response) {
  const mascota = await em.findOne(Mascota, { id_mascota: parseInt(req.params.id_mascota as string) })
  if (!mascota) {
    return res.status(404).json({ message: "Mascota not found" })
  }
  em.assign(mascota, req.body)
  await em.flush()
  res.status(200).json({ message: "Mascota patched", data: mascota })
}

async function remove(req: Request, res: Response) {
  const mascota = await em.findOne(Mascota, { id_mascota: parseInt(req.params.id_mascota as string) })
  if (!mascota) {
    return res.status(404).json({ message: "Mascota not found" })
  }
  await em.removeAndFlush(mascota)
  res.status(200).json({ message: "Mascota removed", data: mascota })
}

export { findAll, findOne, findByDuenio, add, update, patch, remove }