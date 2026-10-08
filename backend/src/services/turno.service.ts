import { turnoRepository } from '../repositories/turno.repository.js'
import { mascotaRepository } from '../repositories/mascota.repository.js'
import { veterinarioRepository } from '../repositories/veterinario.repository.js'

type TimeOnly = `${number}:${number}` | `${number}:${number}:${number}`

export type TurnoData = {
    fecha_turno: Date
    hora_turno: TimeOnly
    estado_turno: string
    observaciones_turno?: string
    id_mascota?: number
    id_veterinario: number
}

export class TurnoService {
  async findAll() {
    return turnoRepository.findAll()
  }

  async findOne(id: number) {
    return turnoRepository.findById(id)
  }

  async add(data: TurnoData) {
    const veterinario = await veterinarioRepository.findById(data.id_veterinario)
    if (!veterinario) throw new Error('VETERINARIO_NOT_FOUND')

    const mascota = data.id_mascota === undefined
      ? undefined
      : (await mascotaRepository.findById(data.id_mascota)) ?? undefined
    if (data.id_mascota !== undefined && !mascota) throw new Error('MASCOTA_NOT_FOUND')

    const { id_mascota: _idMascota, id_veterinario: _idVeterinario, ...datosTurno } = data
    const turno = turnoRepository.create({ ...datosTurno, mascota, veterinario })
    return turnoRepository.save(turno)
  }

  async update(id: number, data: TurnoData) {
    const turno = await turnoRepository.findById(id)
    if (!turno) return null

    const veterinario = await veterinarioRepository.findById(data.id_veterinario)
    if (!veterinario) throw new Error('VETERINARIO_NOT_FOUND')

    const mascota = data.id_mascota === undefined
      ? undefined
      : (await mascotaRepository.findById(data.id_mascota)) ?? undefined
    if (data.id_mascota !== undefined && !mascota) throw new Error('MASCOTA_NOT_FOUND')

    const { id_mascota: _idMascota, id_veterinario: _idVeterinario, ...datosTurno } = data
    Object.assign(turno, { ...datosTurno, mascota, veterinario })
    return turnoRepository.save(turno)
  }

  async patch(id: number, data: Partial<TurnoData>) {
    const turno = await turnoRepository.findById(id)
    if (!turno) return null

    const { id_mascota, id_veterinario, ...cambios } = data
    if (id_veterinario !== undefined) {
      const veterinario = await veterinarioRepository.findById(id_veterinario)
      if (!veterinario) throw new Error('VETERINARIO_NOT_FOUND')
      turno.veterinario = veterinario
    }
    if (id_mascota !== undefined) {
      const mascota = await mascotaRepository.findById(id_mascota)
      if (!mascota) throw new Error('MASCOTA_NOT_FOUND')
      turno.mascota = mascota
    }

    Object.assign(turno, cambios)
    return turnoRepository.save(turno)
  }

  async remove(id: number) {
    const turno = await turnoRepository.findById(id)
    if (!turno) return null
    return turnoRepository.remove(turno)
  }
}

export const turnoService = new TurnoService()

