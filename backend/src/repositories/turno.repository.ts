import { Turno } from '../entities/turno.entity.js'
import { orm } from '../configs/db/orm.js'

const em = orm.em
type TurnoCreateData = Pick<Turno, 'fecha_turno' | 'hora_turno' | 'estado_turno' | 'observaciones_turno' | 'mascota' | 'veterinario'>

export class TurnoRepository {
  findAll() {
    return em.find(Turno, {})
  }

  findById(id: number) {
    return em.findOne(Turno, {id_turno: id})
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