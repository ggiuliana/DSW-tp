import jwt from 'jsonwebtoken'
import { Duenio } from '../entities/duenio.entity.js'
import { Veterinario } from '../entities/veterinario.entity.js'
import { jwtSecret } from '../middlewares/auth.middleware.js'
import { usuarioRepository } from '../repositories/usuario.repository.js'
import { esMailValido } from '../middlewares/validation.js'

export type UsuarioCreateData = {
  nombre_usuario: string
  contrasenia: string
  estado: string
}

export type DuenioRegistroData = {
  nombre: string
  apellido: string
  telefono: string
  mail: string
  dni: string
  direccion: string
  nombre_usuario: string
  contrasenia: string
}

export type VeterinarioRegistroData = DuenioRegistroData & {
  matricula: string
  especialidad: string
}

function normalizarNombre(nombre: string) {
  return nombre.trim()
}

function normalizarMail(mail: string) {
  return mail.trim().toLowerCase()
}

export class UsuarioService {
  async findAll() {
    return usuarioRepository.findAll()
  }

  async findOne(id: number) {
    return usuarioRepository.findById(id)
  }

  async add(idPersona: number, data: UsuarioCreateData) {
    const nombre_usuario = normalizarNombre(data.nombre_usuario)
    if (await usuarioRepository.findByNombre(nombre_usuario)) {
      throw new Error('USERNAME_ALREADY_REGISTERED')
    }

    const persona = await usuarioRepository.findPersonaById(idPersona)
    if (!persona) throw new Error('PERSONA_NOT_FOUND')
    if (await usuarioRepository.findByPersona(persona)) {
      throw new Error('PERSONA_ALREADY_HAS_USER')
    }

    const grupoNombre = persona instanceof Duenio
      ? 'Duenio'
      : persona instanceof Veterinario ? 'Veterinario' : null
    if (!grupoNombre) throw new Error('INVALID_PERSONA_TYPE')

    const grupo = await usuarioRepository.findGrupoByNombre(grupoNombre)
    if (!grupo) throw new Error('GROUP_NOT_FOUND')

    return usuarioRepository.save(usuarioRepository.create({
      ...data,
      nombre_usuario,
      persona,
      grupo,
    }))
  }

  async registerDuenio(data: DuenioRegistroData) {
    if (!esMailValido(data.mail)) throw new Error('INVALID_EMAIL_FORMAT')
    const mail = normalizarMail(data.mail)
    const nombre_usuario = normalizarNombre(data.nombre_usuario)
    const [personaExistente, usuarioExistente] = await Promise.all([
      usuarioRepository.findPersonaByMail(mail),
      usuarioRepository.findByNombre(nombre_usuario),
    ])
    if (personaExistente) throw new Error('MAIL_ALREADY_REGISTERED')
    if (usuarioExistente) throw new Error('USERNAME_ALREADY_REGISTERED')

    const grupo = await usuarioRepository.findGrupoByNombre('Duenio')
    if (!grupo) throw new Error('GROUP_NOT_FOUND')

    const { nombre, apellido, telefono, dni, direccion } = data
    return usuarioRepository.registerDuenio(
      { nombre, apellido, telefono, mail, dni, direccion },
      { nombre_usuario, contrasenia: data.contrasenia, estado: 'Activo' },
      grupo
    )
  }

  async registerVeterinario(data: VeterinarioRegistroData) {
    if (!esMailValido(data.mail)) throw new Error('INVALID_EMAIL_FORMAT')
    const mail = normalizarMail(data.mail)
    const nombre_usuario = normalizarNombre(data.nombre_usuario)
    const [personaExistente, usuarioExistente] = await Promise.all([
      usuarioRepository.findPersonaByMail(mail),
      usuarioRepository.findByNombre(nombre_usuario),
    ])
    if (personaExistente) throw new Error('MAIL_ALREADY_REGISTERED')
    if (usuarioExistente) throw new Error('USERNAME_ALREADY_REGISTERED')

    const grupo = await usuarioRepository.findGrupoByNombre('Veterinario')
    if (!grupo) throw new Error('GROUP_NOT_FOUND')

    const { nombre, apellido, telefono, dni, direccion, matricula, especialidad } = data
    return usuarioRepository.registerVeterinario(
      { nombre, apellido, telefono, mail, dni, direccion, matricula, especialidad },
      { nombre_usuario, contrasenia: data.contrasenia, estado: 'Activo' },
      grupo
    )
  }

  async update(id: number, data: Partial<UsuarioCreateData>) {
    const usuario = await usuarioRepository.findById(id)
    if (!usuario) return null
    if (data.nombre_usuario) {
      const nombre_usuario = normalizarNombre(data.nombre_usuario)
      const existente = await usuarioRepository.findByNombre(nombre_usuario)
      if (existente && existente.id_usuario !== id) throw new Error('USERNAME_ALREADY_REGISTERED')
      data.nombre_usuario = nombre_usuario
    }
    Object.assign(usuario, data)
    return usuarioRepository.save(usuario)
  }

  async changePassword(id: number, currentPassword: string, newPassword: string) {
    const usuario = await usuarioRepository.findById(id)
    if (!usuario) return null
    if (usuario.contrasenia !== currentPassword) throw new Error('INVALID_CURRENT_PASSWORD')

    usuario.contrasenia = newPassword
    return usuarioRepository.save(usuario)
  }

  async patch(id: number, data: Partial<UsuarioCreateData>) {
    return this.update(id, data)
  }

  async remove(id: number) {
    const usuario = await usuarioRepository.findById(id)
    if (!usuario) return null
    return usuarioRepository.remove(usuario)
  }

  async login(nombreUsuario: string, contrasenia: string) {
    const usuario = await usuarioRepository.findByNombre(normalizarNombre(nombreUsuario))
    if (!usuario) throw new Error('USER_NOT_FOUND')
    if (usuario.contrasenia !== contrasenia) throw new Error('INVALID_PASSWORD')

    const token = jwt.sign({
      sub: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      rol: usuario.grupo?.nombre_grupo,
      permisos: usuario.grupo?.activo
        ? usuario.grupo.permisos.getItems()
          .filter((permiso) => permiso.activo)
          .map((permiso) => `${permiso.categoria}:${permiso.nombre_permiso}`)
        : [],
    }, jwtSecret, { expiresIn: '2h' })
    return { usuario, token }
  }
}

export const usuarioService = new UsuarioService()
