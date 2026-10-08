import { Mascota } from '../entities/mascota.entity.js'
import { mascotaRepository } from '../repositories/mascota.repository.js'
import { duenioRepository } from '../repositories/duenio.repository.js'
import { tipoVacunaRepository } from '../repositories/tipo_vacuna.repository.js'
import { vacunaRepository } from '../repositories/vacuna.repository.js'
import { Vacuna } from '../entities/vacuna.entity.js'

type VacunaInput = {
  id_tipo_vacuna: number
  fecha_aplicacion: Date
}

export type MascotaData = {
  nombre_mascota: string
  especie: string
  raza: string
  castrado: boolean
  sexo: string
  fechaNac: Date
  vacunas?: VacunaInput[]
}

function claveVacuna(idTipoVacuna: number, fecha: Date) {
  return `${idTipoVacuna}:${fecha.toISOString().slice(0, 10)}`
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

  async add(data: MascotaData, idDuenio: number) {
    const duenio = await duenioRepository.findById(idDuenio)

    if (!duenio) {
      throw new Error('DUENIO_NOT_FOUND')
    }

    const { vacunas, ...datosMascota } = data
    const mascotaData = { ...datosMascota, duenio }

    const mascota = mascotaRepository.create(mascotaData)
    if (vacunas !== undefined) await this.sincronizarVacunas(mascota, vacunas)
    return mascotaRepository.save(mascota)
  }

  async update(id: number, data: MascotaData) {
    const mascota = await mascotaRepository.findById(id)
    if (!mascota) return null
    const { vacunas, ...datosMascota } = data
    Object.assign(mascota, datosMascota)
    if (vacunas !== undefined) await this.sincronizarVacunas(mascota, vacunas)
    return mascotaRepository.save(mascota)
  }

  async patch(id: number, data: Partial<MascotaData>) {
    const mascota = await mascotaRepository.findById(id)
    if (!mascota) return null
    const { vacunas, ...cambios } = data
    Object.assign(mascota, cambios)
    if (vacunas !== undefined) await this.sincronizarVacunas(mascota, vacunas)
    return mascotaRepository.save(mascota)
  }

  private async sincronizarVacunas(mascota: Mascota, vacunas: VacunaInput[]) {
    const actuales = await vacunaRepository.findByMascota(mascota)
    const porClave = new Map<string, Vacuna>()

    for (const vacuna of actuales) {
      porClave.set(claveVacuna(vacuna.tipo_vacuna.id_tipo_vacuna, vacuna.fecha_aplicacion), vacuna)
    }

    for (const vacunaInput of vacunas) {
      const tipoVacuna = await tipoVacunaRepository.findById(vacunaInput.id_tipo_vacuna)
      if (!tipoVacuna) throw new Error('TIPO_VACUNA_NOT_FOUND')

      const clave = claveVacuna(vacunaInput.id_tipo_vacuna, vacunaInput.fecha_aplicacion)
      if (porClave.delete(clave)) continue

      const vacuna = vacunaRepository.create({
        mascota,
        tipo_vacuna: tipoVacuna,
        fecha_aplicacion: vacunaInput.fecha_aplicacion,
      })
      mascota.vacunas.add(vacuna)
    }

    for (const vacuna of porClave.values()) {
      mascota.vacunas.remove(vacuna)
      vacunaRepository.remove(vacuna)
    }
  }

  async remove(id: number) {
    const mascota = await mascotaRepository.findById(id)
    if (!mascota) return null
    return mascotaRepository.remove(mascota)
  }
}

export const mascotaService = new MascotaService()
