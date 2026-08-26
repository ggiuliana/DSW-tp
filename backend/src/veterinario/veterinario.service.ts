import { Veterinario } from './veterinario.entity.js'
import { veterinarioRepository } from './veterinario.repository.js'

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

    const veterinario = veterinarioRepository.create({ ...data, mail })
    return veterinarioRepository.save(veterinario)
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
