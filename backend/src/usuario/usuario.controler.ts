import { Request, Response } from 'express'
import { usuarioService } from './usuario.service.js'

function errorResponse(error: unknown, res: Response) {
  const message = (error as Error).message
  const statuses: Record<string, number> = {
    USERNAME_ALREADY_REGISTERED: 409,
    MAIL_ALREADY_REGISTERED: 409,
    PERSONA_ALREADY_HAS_USER: 409,
    PERSONA_NOT_FOUND: 404,
    ROLE_NOT_FOUND: 404,
    INVALID_PERSONA_TYPE: 400,
    USER_NOT_FOUND: 404,
    INVALID_PASSWORD: 401,
    INVALID_CURRENT_PASSWORD: 401,
    INVALID_EMAIL_FORMAT: 400,
  }
  const messages: Record<string, string> = {
    USERNAME_ALREADY_REGISTERED: 'El nombre de usuario ya está tomado',
    MAIL_ALREADY_REGISTERED: 'El mail ya está registrado',
    INVALID_CURRENT_PASSWORD: 'La contraseña actual es incorrecta',
    INVALID_EMAIL_FORMAT: 'El mail debe tener un formato válido, por ejemplo duenio@mail.com',
  }
  return res.status(statuses[message] ?? 500).json({ message: messages[message] ?? message })
}

async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await usuarioService.findAll()
    return res.status(200).json({ message: 'Usuarios found', data: usuarios })
  } catch (error) { return errorResponse(error, res) }
}

async function findOne(req: Request, res: Response) {
  try {
    const usuario = await usuarioService.findOne(Number(req.params.id_usuario))
    if (!usuario) return res.status(404).json({ message: 'Usuario not found' })
    return res.status(200).json({ message: 'Usuario found', data: usuario })
  } catch (error) { return errorResponse(error, res) }
}

async function add(req: Request, res: Response) {
  try {
    const usuario = await usuarioService.add(Number(req.params.id_persona), req.body)
    return res.status(201).json({ message: 'Usuario created', data: usuario })
  } catch (error) { return errorResponse(error, res) }
}

async function registerDuenio(req: Request, res: Response) {
  try {
    await usuarioService.registerDuenio(req.body)
    return res.status(201).json({ message: 'Registro exitoso' })
  } catch (error) { return errorResponse(error, res) }
}

async function registerVeterinario(req: Request, res: Response) {
  try {
    await usuarioService.registerVeterinario(req.body)
    return res.status(201).json({ message: 'Veterinario registrado' })
  } catch (error) { return errorResponse(error, res) }
}

async function update(req: Request, res: Response) {
  try {
    const usuario = await usuarioService.update(Number(req.params.id_usuario), req.body)
    if (!usuario) return res.status(404).json({ message: 'Usuario not found' })
    return res.status(200).json({ message: 'Usuario updated', data: usuario })
  } catch (error) { return errorResponse(error, res) }
}

async function changePassword(req: Request, res: Response) {
  try {
    const idUsuario = Number(req.params.id_usuario)
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'La contraseña actual y la nueva son requeridas' })
    }

    const usuario = await usuarioService.changePassword(idUsuario, currentPassword, newPassword)
    if (!usuario) return res.status(404).json({ message: 'Usuario not found' })
    return res.status(200).json({ message: 'Contraseña actualizada' })
  } catch (error) { return errorResponse(error, res) }
}

async function patch(req: Request, res: Response) {
  try {
    const usuario = await usuarioService.patch(Number(req.params.id_usuario), req.body)
    if (!usuario) return res.status(404).json({ message: 'Usuario not found' })
    return res.status(200).json({ message: 'Usuario patched', data: usuario })
  } catch (error) { return errorResponse(error, res) }
}

async function remove(req: Request, res: Response) {
  try {
    const usuario = await usuarioService.remove(Number(req.params.id_usuario))
    if (!usuario) return res.status(404).json({ message: 'Usuario not found' })
    return res.status(200).json({ message: 'Usuario removed' })
  } catch (error) { return errorResponse(error, res) }
}

async function removeCuenta(req: Request, res: Response) {
  try {
    const idUsuario = Number(req.params.id_usuario)
    const usuario = await usuarioService.remove(idUsuario)
    if (!usuario) return res.status(404).json({ message: 'Usuario not found' })
    return res.status(200).json({ message: 'Cuenta removed' })
  } catch (error) { return errorResponse(error, res) }
}

async function login(req: Request, res: Response) {
  try {
    const { nombre_usuario, contrasenia } = req.body
    if (!nombre_usuario || !contrasenia) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' })
    }
    const { usuario, token } = await usuarioService.login(nombre_usuario, contrasenia)
    const { contrasenia: _, ...usuarioSinContrasenia } = usuario
    return res.status(200).json({ message: 'Login exitoso', data: { usuario: usuarioSinContrasenia, token } })
  } catch (error) { return errorResponse(error, res) }
}

export { findAll, findOne, add, update, changePassword, patch, remove, removeCuenta, login, registerDuenio, registerVeterinario }
