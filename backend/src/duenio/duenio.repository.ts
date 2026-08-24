import { Duenio } from './duenio.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em
type DuenioCreateData = Pick<Duenio, 'nombre' | 'apellido' | 'telefono' | 'mail' | 'dni' | 'direccion'>

export class DuenioRepository {
  findAll() {
    return em.find(Duenio, {})
  }

  findById(id: number) {
    return em.findOne(Duenio, { id_persona: id })
  }

  findByMail(mail: string) {
    return em.findOne(Duenio, { mail })
  }

  create(data: DuenioCreateData) {
    const duenio = new Duenio()
    Object.assign(duenio, data)
    em.persist(duenio)
    return duenio
  }

  async save(duenio: Duenio) {
    await em.flush()
    return duenio
  }

  async remove(duenio: Duenio) {
    await em.removeAndFlush(duenio)
    return duenio
  }
}

export const duenioRepository = new DuenioRepository()
