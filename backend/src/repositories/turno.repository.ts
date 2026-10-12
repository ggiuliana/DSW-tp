import { Turno } from '../entities/turno.entity.js'
import { orm } from '../configs/db/orm.js'
import { FilterQuery } from '@mikro-orm/core';

const em = orm.em
type TurnoCreateData = Pick<Turno, 'fecha_turno' | 'hora_turno' | 'estado_turno' | 'observaciones_turno' | 'mascota' | 'veterinario'>

export class TurnoRepository {
  findAll() {
    return em.find(Turno, {}, { populate: ['mascota', 'veterinario'] })
  }

  findById(id: number) {
    return em.findOne(Turno, {id_turno: id}, { populate: ['mascota', 'veterinario'] })
  }

  findByVeterinario(idVet: number) {
    return em.find(Turno, { veterinario: { id_persona: idVet } }, {
      populate: ['mascota', 'veterinario'],
      orderBy: { fecha_turno: 'ASC', hora_turno: 'ASC' },
    })
  }

  findTurnosByVeterinarioAndFecha(idVet: number, fechaInicio: string, fechaFin: string) {
    const query: FilterQuery<Turno> = {
      veterinario: { id_persona: idVet },
      estado_turno: 'Confirmado',
      fecha_turno: {
        $gte: new Date(`${fechaInicio}T00:00:00.000Z`),
        $lte: new Date(`${fechaFin}T00:00:00.000Z`),
      },
    };
    return em.find(Turno, query, {
      populate: ['mascota', 'veterinario'],
      orderBy: { fecha_turno: 'ASC', hora_turno: 'ASC' },
    });
  }

  create(data: TurnoCreateData) {
    const turno = new Turno()
    Object.assign(turno, data)
    em.persist(turno)
    return turno
  }

  async save(turno: Turno) {
    await em.flush()
    return turno
  }

  async remove(turno: Turno) {
    await em.removeAndFlush(turno)
    return turno
  }
}

export const turnoRepository = new TurnoRepository()