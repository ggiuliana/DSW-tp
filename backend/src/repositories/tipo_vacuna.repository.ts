import { TipoVacuna } from '../entities/tipo_vacuna.entity.js'
import { orm } from '../configs/db/orm.js'

const em = orm.em
type TipoVacunaCreateData = Pick<TipoVacuna, 'nombre_tipo_vacuna' | 'descripcion_tipo_vacuna'>

export class TipoVacunaRepository {
  findAll() {
    return em.find(TipoVacuna, {})
  }

  findById(id: number) {
    return em.findOne(TipoVacuna, { id_tipo_vacuna: id })
  }

  create(data: TipoVacunaCreateData) {
    const tipoVacuna = new TipoVacuna()
    Object.assign(tipoVacuna, data)
    em.persist(tipoVacuna)
    return tipoVacuna
  }

  async save(tipoVacuna: TipoVacuna) {
    await em.flush()
    return tipoVacuna
  }

  async remove(tipoVacuna: TipoVacuna) {
    await em.removeAndFlush(tipoVacuna)
    return tipoVacuna
  }
}

export const tipoVacunaRepository = new TipoVacunaRepository()