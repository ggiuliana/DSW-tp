import { Duenio } from '../duenio/duenio.entity.js'
import { Mascota } from './mascota.entity.js'
import { mascotaRepository } from './mascota.repository.js'
import { duenioRepository } from '../duenio/duenio.repository.js'

export type MascotaData = {
  nombre_mascota: string
  especie: string
  raza: string
  castrado: boolean
  sexo: string
  fechaNac: Date
  duenio: Duenio
}

export class MascotaService {
  async findAll() {
    return mascotaRepository.findAll()
  }

  async findOne(id: number) {
    return mascotaRepository.findById(id)
  }

  async findByDuenio(idDuenio: number){
    const duenio = await duenioRepository.findById(idDuenio)

    if (!duenio) {
        throw new Error('DUENIO_NOT_FOUND')
    }

    return mascotaRepository.findByDuenio(duenio)
  }

  async add(data: Mascota, idDuenio: number) {
    const duenio = await duenioRepository.findById(idDuenio)

    if (!duenio) {
      throw new Error('DUENIO_NOT_FOUND')
    }

    const mascotaData: MascotaData = {
        ...data,
        duenio,
    }

    const mascota = mascotaRepository.create(mascotaData)
    return mascotaRepository.save(mascota)
  }

  async update(id: number, data: MascotaData) {
    const mascota = await mascotaRepository.findById(id)
    if (!mascota) return null
    Object.assign(mascota, { ...data})
    return mascotaRepository.save(mascota)
  }

  async patch(id: number, data: Partial<MascotaData>) {
    const mascota = await mascotaRepository.findById(id)
    if (!mascota) return null
    const cambios = { ...data }
    Object.assign(mascota, cambios)
    return mascotaRepository.save(mascota)
  }

  async remove(id: number) {
    const mascota = await mascotaRepository.findById(id)
    if (!mascota) return null
    return mascotaRepository.remove(mascota)
  }
}

export const mascotaService = new MascotaService()
