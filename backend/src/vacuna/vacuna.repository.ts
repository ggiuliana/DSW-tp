import { Mascota } from '../mascota/mascota.entity.js'
import { orm } from '../shared/db/orm.js'
import { Vacuna } from './vacuna.entity.js'

const em = orm.em
type VacunaCreateData = Pick<Vacuna, 'mascota' | 'tipo_vacuna' | 'fecha_aplicacion'>

export class VacunaRepository {
  findByMascota(mascota: Mascota) {
    return em.find(Vacuna, { mascota }, { populate: ['tipo_vacuna'] })
  }

  create(data: VacunaCreateData) {
    const vacuna = new Vacuna()
    Object.assign(vacuna, data)
    em.persist(vacuna)
    return vacuna
  }

  remove(vacuna: Vacuna) {
    em.remove(vacuna)
  }
}

export const vacunaRepository = new VacunaRepository()