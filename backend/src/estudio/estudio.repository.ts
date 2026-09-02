import { Estudio } from './estudio.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em
type EstudioCreateData = Pick<Estudio, 'nombre_estudio' | 'descripcion_estudio' | 'precio_estudio'>

export class EstudioRepository {
  findAll() {
    return em.find(Estudio, {})
  }

  findById(id: number) {
    return em.findOne(Estudio, { id_estudio: id })
  }

  create(data: EstudioCreateData) {
    const estudio = new Estudio()
    Object.assign(estudio, data)
    em.persist(estudio)
    return estudio
  }

  async save(estudio: Estudio) {
    await em.flush()
    return estudio
  }

  async remove(estudio: Estudio) {
    await em.removeAndFlush(estudio)
    return estudio
  }
}

export const estudioRepository = new EstudioRepository()
