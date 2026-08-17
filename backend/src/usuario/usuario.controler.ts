import { Request, Response, NextFunction } from 'express'
import { Usuario } from './usuario.entity.js'
import { Persona } from '../persona/persona.entity.js'
import { Duenio } from "../duenio/duenio.entity.js"
import { Veterinario } from "../veterinario/veterinario.entity.js"
import { Rol } from "../rol/rol.entity.js"
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req:Request, res: Response){
    try {
        const usuarios = await em.find(Usuario, {})
        res.status(200).json({ message: "Usuarios found", data: usuarios })
      } catch (error) {
      res.status(500).json({
        message: (error as Error).message
      });
    }
}

async function findOne(req:Request, res:Response){

    try{
        const usuario = await em.find(Usuario, {id_usuario: parseInt(req.params.id_usuario as string)})
        if (!usuario) {
            res.status(404).json({message: "Usuario not found"})
        }
        res.status(404).json({message: "Usuario found", data: usuario})
    } catch(error){
        res.status(500).json({message: (error as Error).message});
    }
}

async function add(req:Request, res:Response){

    const { nombre_usuario, contrasenia } = req.body
    const estado = "Activo"
    try{
        const persona = await em.findOne(Persona, {id_persona: parseInt(req.params.id_persona as string)})
        if(!persona){
            return res.status(404).json({message: "Persona not found"})
        }
        const existingUsuario = await em.findOne(Usuario, { persona })
        if (existingUsuario) {
            return res.status(404).json({ message: "Persona already has an user" })
        }
        let rolAct: string
         if (persona instanceof Duenio) {
            rolAct = "Duenio";
        }
        else if (persona instanceof Veterinario) {
            rolAct = "Veterinario";
        }
        else {
            return res.status(400).json({message: "Tipo de persona inválido"});
        }
        const rol = await em.findOne(Rol, {nombre_rol: rolAct})
        if (!rol) {
            return res.status(404).json({message: "Rol no encontrado"})}

        const usuario = await em.create(Usuario, {
            nombre_usuario,
            contrasenia,
            estado,
            persona,
            rol
        })
        await em.flush()
        res.status(201).json({ message: "Usuario created", data: usuario })
    } catch (error) {
        res.status(500).json({message: (error as Error).message});
    }
}

async function update (req:Request, res:Response){
    const { nombre_usuario, contrasenia, estado } = req.body
    try{
        const usuario = await em.findOne(Usuario, {id_usuario: parseInt(req.params.id_usuario as string)})
        if(!usuario){
            return res.status(404).json({message: "Usuario not found"})
        }
        em.assign(usuario, {
            nombre_usuario,
            contrasenia,
            estado
        })
        await em.flush()
        res.status(200).json({ message: "Usuario updated", data: usuario })
    }catch(error){
        res.status(500).json({message: (error as Error).message});
    }
}

async function patch(req:Request, res:Response){
    try{
    const usuario = await em.findOne(Usuario, { id_usuario: parseInt(req.params.id_usuario as string) })
      if (!usuario) {
        return res.status(404).json({ message: "Usuario not found" })
      }
      em.assign(usuario, req.body)
      await em.flush()
      res.status(200).json({ message: "Usuario patched", data: usuario })
    } catch(error) {
        res.status(500).json({message: (error as Error).message});
    }
}

async function remove(req:Request, res:Response){
    const usuario = await em.findOne(Usuario, {id_usuario: parseInt(req.params.id_usuario as string)})
    if(!usuario){
        return res.status(404).json({message: "Usuario not found"})
    }
    await em.removeAndFlush(usuario)
    res.status(200).json({message: "Usuario removed"})
}

export { findAll, findOne, add, update, patch, remove }