import { Consulta } from '../entities/consulta.entity.js'
import { orm } from '../configs/db/orm.js'
import { MedicamentosUsados } from '../entities/medicamentos_usados.entity.js'

const em = orm.em
type MedicamentosUsadosCreateData = Pick<MedicamentosUsados, 'consulta' | 'medicamento' | 'cantidad_usada'>

export class MedicamentosUsadosRepository {
  findByConsulta(consulta: Consulta) {
    return em.find(MedicamentosUsados, { consulta }, { populate: ['medicamento'] })
  }

  create(data: MedicamentosUsadosCreateData) {
    const medicamentoUsado = new MedicamentosUsados()
    Object.assign(medicamentoUsado, data)
    em.persist(medicamentoUsado)
    return medicamentoUsado
  }

  remove(medicamentoUsado: MedicamentosUsados) {
    em.remove(medicamentoUsado)
  }
}

export const medicamentosUsadosRepository = new MedicamentosUsadosRepository()