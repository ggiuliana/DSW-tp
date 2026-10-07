import { Duenio } from '../duenio/duenio.entity.js'
import { Mascota } from './mascota.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em
type MascotaCreateData = Pick<Mascota, 'nombre_mascota' | 'especie' | 'raza' | 'castrado' | 'sexo' | 'fechaNac'| 'duenio'>

export class MascotaRepository {
  findAll() {
    return em.find(Mascota, {}, { populate: ['vacunas', 'vacunas.tipo_vacuna'] })
  }

  findById(id: number) {
    return em.findOne(Mascota, { id_mascota: id }, { populate: ['vacunas', 'vacunas.tipo_vacuna'] })
  }

  async findByDuenio(duenio: Duenio) {
    return em.find(Mascota, { duenio }, { populate: ['vacunas', 'vacunas.tipo_vacuna'] })
  }

  create(data: MascotaCreateData) {
    const mascota = new Mascota()
    Object.assign(mascota, data)
    em.persist(mascota)
    return mascota
  }

  async save(mascota: Mascota) {
    await em.flush()
    return mascota
  }

  async remove(mascota: Mascota) {
    await em.removeAndFlush(mascota)
    return mascota
  }
}

export const mascotaRepository = new MascotaRepository()
