import { Duenio } from './duenio.entity.js'
import { duenioRepository } from './duenio.repository.js'
import { esMailValido } from '../shared/validation.js'

export type DuenioData = {
  nombre: string
  apellido: string
  telefono: string
  mail: string
  dni: string
  direccion: string
}

function normalizarMail(mail: string) {
  return mail.trim().toLowerCase()
}

export class DuenioService {
  async findAll() {
    return duenioRepository.findAll()
  }

  async findOne(id: number) {
    return duenioRepository.findById(id)
  }

  async add(data: DuenioData) {
    if (!esMailValido(data.mail)) throw new Error('INVALID_EMAIL_FORMAT')
    const mail = normalizarMail(data.mail)
    const existente = await duenioRepository.findPersonaByMail(mail)

    if (existente) {
      throw new Error('MAIL_ALREADY_REGISTERED')
    }

    const duenio = duenioRepository.create({ ...data, mail })
    return duenioRepository.save(duenio)
  }

  async update(id: number, data: DuenioData) {
    const duenio = await duenioRepository.findById(id)
    if (!duenio) return null
    if (!esMailValido(data.mail)) throw new Error('INVALID_EMAIL_FORMAT')

    const mail = normalizarMail(data.mail)
    const existente = await duenioRepository.findPersonaByMail(mail)
    if (existente && existente.id_persona !== id) {
      throw new Error('MAIL_ALREADY_REGISTERED')
    }

    Object.assign(duenio, { ...data, mail })
    return duenioRepository.save(duenio)
  }

  async patch(id: number, data: Partial<DuenioData>) {
    const duenio = await duenioRepository.findById(id)
    if (!duenio) return null

    const cambios = { ...data }
    if (typeof cambios.mail === 'string') {
      if (!esMailValido(cambios.mail)) throw new Error('INVALID_EMAIL_FORMAT')
      cambios.mail = normalizarMail(cambios.mail)
      const existente = await duenioRepository.findPersonaByMail(cambios.mail)
      if (existente && existente.id_persona !== id) {
        throw new Error('MAIL_ALREADY_REGISTERED')
      }
    }

    Object.assign(duenio, cambios)
    return duenioRepository.save(duenio)
  }

  async remove(id: number) {
    const duenio = await duenioRepository.findById(id)
    if (!duenio) return null
    return duenioRepository.remove(duenio)
  }
}

export const duenioService = new DuenioService()
