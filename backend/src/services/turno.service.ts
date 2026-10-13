import { turnoRepository } from '../repositories/turno.repository.js'
import { mascotaRepository } from '../repositories/mascota.repository.js'
import { veterinarioRepository } from '../repositories/veterinario.repository.js'
import { usuarioRepository } from '../repositories/usuario.repository.js'

type TimeOnly = `${number}:${number}` | `${number}:${number}:${number}`

export type TurnoData = {
    fecha_turno: Date
    hora_turno: TimeOnly
    estado_turno: string
    observaciones_turno?: string
    id_mascota?: number
    id_veterinario: number
}

function minutosDelDia(hora: string) {
  const coincidencia = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(hora)
  if (!coincidencia) return Number.NaN
  return Number(coincidencia[1]) * 60 + Number(coincidencia[2]) + Number(coincidencia[3] ?? 0) / 60
}

function claveFecha(fecha: Date) {
  return fecha.toISOString().slice(0, 10)
}

function horaParaBaseDatos(hora: TimeOnly): `${number}:${number}:${number}` {
  const [horas, minutos, segundos = '00'] = hora.split(':')
  return `${horas}:${minutos}:${segundos}` as `${number}:${number}:${number}`
}

export class TurnoService {
  async findAll() {
    return turnoRepository.findAll()
  }

  async findParaDuenio(idUsuario: number) {
    const usuario = await usuarioRepository.findByIdWithPersona(idUsuario)
    if (!usuario?.persona?.id_persona) throw new Error('TURNO_OWNER_PROFILE_NOT_FOUND')
    const [turnos, mascotas] = await Promise.all([
      turnoRepository.findAll(),
      mascotaRepository.findByDuenioId(usuario.persona.id_persona),
    ])
    const idsMascota = new Set(mascotas.map((mascota) => mascota.id_mascota))
    return turnos.filter((turno) =>
      (turno.estado_turno.toLowerCase() === 'pendiente' && !turno.mascota) ||
      (turno.mascota?.id_mascota !== undefined && idsMascota.has(turno.mascota.id_mascota))
    )
  }

  async findOne(id: number) {
    return turnoRepository.findById(id)
  }

  async findByVeterinario(idVet: number) {
    return turnoRepository.findByVeterinario(idVet)
  }

  async findDisponiblesByVeterinarioAndFecha(idVet: number, fechaInicio: string, fechaFin: string) {
    return turnoRepository.findDisponiblesByVeterinarioAndFecha(idVet, fechaInicio, fechaFin)
  }

  async findTurnosByVeterinarioAndFecha(idVet: number, fechaInicio: string, fechaFin: string) {
    return turnoRepository.findTurnosByVeterinarioAndFecha(idVet, fechaInicio, fechaFin)
  }

  async add(data: TurnoData) {
    await this.validarDisponibilidad(data.fecha_turno, data.hora_turno, data.id_veterinario)
    const veterinario = await veterinarioRepository.findById(data.id_veterinario)
    if (!veterinario) throw new Error('VETERINARIO_NOT_FOUND')

    const mascota = data.id_mascota === undefined
      ? undefined
      : (await mascotaRepository.findById(data.id_mascota)) ?? undefined
    if (data.id_mascota !== undefined && !mascota) throw new Error('MASCOTA_NOT_FOUND')

    const { id_mascota: _idMascota, id_veterinario: _idVeterinario, ...datosTurno } = data
    const turno = turnoRepository.create({
      ...datosTurno,
      hora_turno: horaParaBaseDatos(data.hora_turno),
      mascota,
      veterinario,
    })
    return turnoRepository.save(turno)
  }

  async update(id: number, data: TurnoData) {
    const turno = await turnoRepository.findById(id)
    if (!turno) return null

    await this.validarDisponibilidad(data.fecha_turno, data.hora_turno, data.id_veterinario, id)
    const veterinario = await veterinarioRepository.findById(data.id_veterinario)
    if (!veterinario) throw new Error('VETERINARIO_NOT_FOUND')

    const mascota = data.id_mascota === undefined
      ? undefined
      : (await mascotaRepository.findById(data.id_mascota)) ?? undefined
    if (data.id_mascota !== undefined && !mascota) throw new Error('MASCOTA_NOT_FOUND')

    const { id_mascota: _idMascota, id_veterinario: _idVeterinario, ...datosTurno } = data
    Object.assign(turno, {
      ...datosTurno,
      hora_turno: horaParaBaseDatos(data.hora_turno),
      mascota,
      veterinario,
    })
    return turnoRepository.save(turno)
  }

  async patch(id: number, data: Partial<TurnoData>) {
    const turno = await turnoRepository.findById(id)
    if (!turno) return null

    const { id_mascota, id_veterinario, ...cambios } = data
    if (cambios.hora_turno !== undefined) {
      cambios.hora_turno = horaParaBaseDatos(cambios.hora_turno)
    }
    const idVeterinario = id_veterinario ?? turno.veterinario.id_persona!
    const veterinario = id_veterinario === undefined
      ? turno.veterinario
      : await veterinarioRepository.findById(id_veterinario)
    if (id_veterinario !== undefined && !veterinario) throw new Error('VETERINARIO_NOT_FOUND')

    if (data.fecha_turno !== undefined || data.hora_turno !== undefined || id_veterinario !== undefined) {
      await this.validarDisponibilidad(
        data.fecha_turno ?? turno.fecha_turno,
        data.hora_turno ?? turno.hora_turno,
        idVeterinario,
        id,
      )
    }

    if (id_veterinario !== undefined && veterinario) turno.veterinario = veterinario
    if (id_mascota !== undefined) {
      const mascota = await mascotaRepository.findById(id_mascota)
      if (!mascota) throw new Error('MASCOTA_NOT_FOUND')
      turno.mascota = mascota
    }

    Object.assign(turno, cambios)
    return turnoRepository.save(turno)
  }

  async otorgar(idTurno: number, idMascota: number, idUsuario: number) {
    const turno = await turnoRepository.findById(idTurno)
    if (!turno) return null
    if (turno.estado_turno.toLowerCase() !== 'pendiente' || turno.mascota) {
      throw new Error('TURNO_NOT_PENDING')
    }

    const [usuario, mascota] = await Promise.all([
      usuarioRepository.findByIdWithPersona(idUsuario),
      mascotaRepository.findByIdWithDuenio(idMascota),
    ])
    if (!usuario?.persona) throw new Error('TURNO_OWNER_PROFILE_NOT_FOUND')
    if (!mascota) throw new Error('MASCOTA_NOT_FOUND')
    if (mascota.duenio?.id_persona !== usuario.persona.id_persona) {
      throw new Error('MASCOTA_NOT_OWNED')
    }

    turno.mascota = mascota
    turno.estado_turno = 'Confirmado'
    return turnoRepository.save(turno)
  }

  async remove(id: number) {
    const turno = await turnoRepository.findById(id)
    if (!turno) return null
    if (turno.estado_turno.toLowerCase() !== 'pendiente' || turno.mascota) {
      throw new Error('TURNO_NOT_AVAILABLE')
    }
    return turnoRepository.remove(turno)
  }

  private async validarDisponibilidad(fecha: Date, hora: string, idVeterinario: number, idTurnoExcluir?: number) {
    if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) throw new Error('TURNO_INVALID_DATE')

    const diaSemana = fecha.getUTCDay()
    if (diaSemana === 0) throw new Error('TURNO_INVALID_WEEKDAY')

    const minutos = minutosDelDia(hora)
    if (!Number.isFinite(minutos) || minutos < 9 * 60 || minutos > 19 * 60 || (minutos - 9 * 60) % 45 !== 0) {
      throw new Error('TURNO_INVALID_TIME')
    }

    const fechaBuscada = claveFecha(fecha)
    const turnos = await turnoRepository.findAll()
    const hayConflicto = turnos.some((turno) => {
      if (turno.id_turno === idTurnoExcluir || turno.veterinario.id_persona !== idVeterinario) return false
      if (claveFecha(turno.fecha_turno) !== fechaBuscada) return false
      return Math.abs(minutosDelDia(turno.hora_turno) - minutos) < 45
    })
    if (hayConflicto) throw new Error('TURNO_MINIMUM_INTERVAL')
  }
}

export const turnoService = new TurnoService()

