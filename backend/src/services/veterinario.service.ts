import { Veterinario } from '../entities/veterinario.entity.js'
import { veterinarioRepository } from '../repositories/veterinario.repository.js'
import { usuarioRepository } from '../repositories/usuario.repository.js'
import { Grupo_Permiso } from '../entities/grupo_permiso.entity.js';
import { Usuario } from '../entities/usuario.entity.js'
import { orm } from '../configs/db/orm.js'


export type VeterinarioData = {
  nombre: string
  apellido: string
  telefono: string
  mail: string
  dni: string
  direccion: string
  matricula: string
  especialidad: string
}

function normalizarMail(mail: string) {
  return mail.trim().toLowerCase()
}

export class VeterinarioService {
  async findAll() {
    return veterinarioRepository.findAll()
  }

  async findOne(id: number) {
    return veterinarioRepository.findById(id)
  }

  async add(data: VeterinarioData) {
    const mail = normalizarMail(data.mail)
    const existente = await veterinarioRepository.findPersonaByMail(mail)

    if (existente) {
      throw new Error('MAIL_ALREADY_REGISTERED')
    }

    // 1. Crear y guardar el Veterinario
    const veterinario = veterinarioRepository.create({ ...data, mail })
    const veterinarioGuardado = await veterinarioRepository.save(veterinario)

    // 2. Generar nombre de usuario único
    const primeraLetra = data.nombre.charAt(0).toLowerCase()
    const apellidoLimpio = data.apellido.toLowerCase().replace(/\s/g, '')
    const ultimosDigitos = data.dni.slice(-3)
    const nombreUsuario = `${primeraLetra}${apellidoLimpio}${ultimosDigitos}`

    // 3. Buscar el Grupo "Veterinario" usando el EntityManager de MikroORM (igual que en el Seeder)
    const grupoVeterinario = await orm.em.findOne(Grupo_Permiso, {
        nombre_grupo: 'Veterinario'
    });

    if (!grupoVeterinario) {
        throw new Error('ROLE_VETERINARIO_NOT_FOUND')
    }

    // 4. Crear el Usuario usando el EntityManager
    const nuevoUsuario = orm.em.create(Usuario, {
        nombre_usuario: nombreUsuario,
        contrasenia: data.dni, 
        estado: 'Activo',
        persona: veterinarioGuardado,
        grupo: grupoVeterinario
    });

    // 5. Guardar el usuario en la base de datos
    await orm.em.persistAndFlush(nuevoUsuario);

    return veterinarioGuardado
  }

  async update(id: number, data: VeterinarioData) {
    const veterinario = await veterinarioRepository.findById(id)
    if (!veterinario) return null

    const mail = normalizarMail(data.mail)
    const existente = await veterinarioRepository.findPersonaByMail(mail)
    if (existente && existente.id_persona !== id) {
      throw new Error('MAIL_ALREADY_REGISTERED')
    }

    Object.assign(veterinario, { ...data, mail })
    return veterinarioRepository.save(veterinario)
  }

  async patch(id: number, data: Partial<VeterinarioData>) {
    const veterinario = await veterinarioRepository.findById(id)
    if (!veterinario) return null

    const cambios = { ...data }
    if (typeof cambios.mail === 'string') {
      cambios.mail = normalizarMail(cambios.mail)
      const existente = await veterinarioRepository.findPersonaByMail(cambios.mail)
      if (existente && existente.id_persona !== id) {
        throw new Error('MAIL_ALREADY_REGISTERED')
      }
    }

    Object.assign(veterinario, cambios)
    return veterinarioRepository.save(veterinario)
  }

  async remove(id: number) {
    const veterinario = await veterinarioRepository.findById(id)
    if (!veterinario) return null

    return veterinarioRepository.remove(veterinario)
  }
}

export const veterinarioService = new VeterinarioService()