import { Medicamento } from '../entities/medicamento.entity.js'
import { orm } from '../configs/db/orm.js'

const em = orm.em
type MedicamentoCreateData = Pick<Medicamento, 'nombre_medicamento' | 'cantidad_restante' | 'cantidad_minima' | 'proveedor'>

export class MedicamentoRepository {
  findAll() {
    return em.find(Medicamento, {}, { populate: ['proveedor'] })
  }

  findById(id: number) {
    return em.findOne(Medicamento, { id_medicamento: id }, { populate: ['proveedor'] })
  }

  create(data: MedicamentoCreateData) {
    const medicamento = new Medicamento()
    Object.assign(medicamento, data)
    em.persist(medicamento)
    return medicamento
  }

  async save(medicamento: Medicamento) {
    await em.flush()
    return medicamento
  }

  async remove(medicamento: Medicamento) {
    await em.removeAndFlush(medicamento)
    return medicamento
  }
}

export const medicamentoRepository = new MedicamentoRepository()