import { Request, Response, NextFunction } from 'express'
import { Usuario } from './usuario.entity.js'
import { Persona } from '../persona/persona.entity.js'
import { Duenio } from "../duenio/duenio.entity.js"
import { Veterinario } from "../veterinario/veterinario.entity.js"
import { Rol } from "../rol/rol.entity.js"
import { orm } from '../shared/db/orm.js'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../shared/auth.middleware.js'

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
        const nombreUsuarioNormalizado = nombre_usuario.trim()
        const usuarioExistentePorNombre = await em.findOne(Usuario, {
            nombre_usuario: nombreUsuarioNormalizado
        })
        if (usuarioExistentePorNombre) {
            return res.status(409).json({ message: "El nombre de usuario ya está tomado" })
        }
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
            nombre_usuario: nombreUsuarioNormalizado,
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

async function registerDuenio(req: Request, res: Response) {
    const {
        nombre,
        apellido,
        telefono,
        mail,
        dni,
        direccion,
        nombre_usuario,
        contrasenia
    } = req.body
    try {
        const mailNormalizado = mail.trim().toLowerCase()
        const nombreUsuarioNormalizado = nombre_usuario.trim()
        await em.transactional(async (transactionEm) => {
            const [personaExistente, usuarioExistente] = await Promise.all([
                transactionEm.findOne(Duenio, { mail: mailNormalizado }),
                transactionEm.findOne(Usuario, { nombre_usuario: nombreUsuarioNormalizado })
            ])
            if (personaExistente) {
                throw new Error('El mail ya está registrado')
            }
            if (usuarioExistente) {
                throw new Error('El nombre de usuario ya está tomado')
            }
            const rol = await transactionEm.findOneOrFail(Rol, {
                nombre_rol: 'Duenio'
            })
            const persona = transactionEm.create(Duenio, {
                nombre,
                apellido,
                telefono,
                mail: mailNormalizado,
                dni,
                direccion
            })
            transactionEm.create(Usuario, {
                nombre_usuario: nombreUsuarioNormalizado,
                contrasenia,
                estado: 'Activo',
                persona,
                rol
            })
        })
        return res.status(201).json({ message: 'Registro exitoso' })
    } catch (error) {
        const mensaje = (error as Error).message
        if (mensaje.includes('ya está registrado') || mensaje.includes('ya está tomado')) {
            return res.status(409).json({ message: mensaje })
        }
        return res.status(500).json({ message: mensaje })
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

async function login(req:Request, res:Response){
    try {
        const { nombre_usuario, contrasenia } = req.body
        if (!nombre_usuario || !contrasenia) {
            return res.status(400).json({message: "Usuario y contraseña son requeridos"})
        }
        const usuario = await em.findOne(
            Usuario,
            { nombre_usuario: nombre_usuario.trim() },
            { populate: ['rol', 'persona'] }
        )
        if (!usuario){
            return res.status(404).json({message: "Usuario no encontrado"})
        }
        if (usuario.contrasenia !== contrasenia){
            return res.status(401).json({message: "Contraseña incorrecta"})
        }
        const token = jwt.sign(
            {
                sub: usuario.id_usuario,
                nombre_usuario: usuario.nombre_usuario,
                rol: usuario.rol?.nombre_rol
            },
            jwtSecret,
            { expiresIn: '2h' }
        )
        const { contrasenia: _, ...usuarioSinContrasenia } = usuario
        res.status(200).json({
            message: "Login exitoso",
            data: { usuario: usuarioSinContrasenia, token }
        });
    } catch (error) {
        res.status(500).json({message: (error as Error).message});
    }
}

export { findAll, findOne, add, update, patch, remove, login, registerDuenio }