import { Request, Response } from 'express'
import { usuarioService } from './usuario.service.js'

async function findAll(req: Request, res: Response) {
  const usuarios = await usuarioService.findAll()
  return res.status(200).json({ message: 'Usuarios found', data: usuarios })
}

async function findOne(req: Request, res: Response) {
  const usuario = await usuarioService.findOne(Number(req.params.id_usuario))
  if (!usuario) throw new Error('USER_NOT_FOUND')
  return res.status(200).json({ message: 'Usuario found', data: usuario })
}

async function add(req: Request, res: Response) {
  const usuario = await usuarioService.add(Number(req.params.id_persona), req.body)
  return res.status(201).json({ message: 'Usuario created', data: usuario })
}

async function registerDuenio(req: Request, res: Response) {
  await usuarioService.registerDuenio(req.body)
  return res.status(201).json({ message: 'Registro exitoso' })
}

async function registerVeterinario(req: Request, res: Response) {
  await usuarioService.registerVeterinario(req.body)
  return res.status(201).json({ message: 'Veterinario registrado' })
}

async function update(req: Request, res: Response) {
  const usuario = await usuarioService.update(Number(req.params.id_usuario), req.body)
  if (!usuario) throw new Error('USER_NOT_FOUND')
  return res.status(200).json({ message: 'Usuario updated', data: usuario })
}

async function changePassword(req: Request, res: Response) {
  const idUsuario = Number(req.params.id_usuario)
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) throw new Error('REQUIRED_PASSWORDS')

  const usuario = await usuarioService.changePassword(idUsuario, currentPassword, newPassword)
  if (!usuario) throw new Error('USER_NOT_FOUND')
  return res.status(200).json({ message: 'Contraseña actualizada' })
}

async function patch(req: Request, res: Response) {
  const usuario = await usuarioService.patch(Number(req.params.id_usuario), req.body)
  if (!usuario) throw new Error('USER_NOT_FOUND')
  return res.status(200).json({ message: 'Usuario patched', data: usuario })
}

async function remove(req: Request, res: Response) {
  const usuario = await usuarioService.remove(Number(req.params.id_usuario))
  if (!usuario) throw new Error('USER_NOT_FOUND')
  return res.status(200).json({ message: 'Usuario removed' })
}

async function removeCuenta(req: Request, res: Response) {
  const idUsuario = Number(req.params.id_usuario)
  const usuario = await usuarioService.remove(idUsuario)
  if (!usuario) throw new Error('USER_NOT_FOUND')
  return res.status(200).json({ message: 'Cuenta removed' })
}

async function login(req: Request, res: Response) {
  const { nombre_usuario, contrasenia } = req.body
  if (!nombre_usuario || !contrasenia) throw new Error('REQUIRED_LOGIN')
  const { usuario, token } = await usuarioService.login(nombre_usuario, contrasenia)
  const { contrasenia: _, ...usuarioSinContrasenia } = usuario
  return res.status(200).json({ message: 'Login exitoso', data: { usuario: usuarioSinContrasenia, token } })
}

export { findAll, findOne, add, update, changePassword, patch, remove, removeCuenta, login, registerDuenio, registerVeterinario }
