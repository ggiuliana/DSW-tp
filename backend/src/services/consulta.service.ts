import { Consulta } from '../entities/consulta.entity.js'
import { consultaRepository } from '../repositories/consulta.repository.js'
import { estudioRepository } from '../repositories/estudio.repository.js'
import { medicamentosUsadosRepository } from '../repositories/medicamentos_usados.repository.js'
import { medicamentoRepository } from '../repositories/medicamento.repository.js'
import { turnoRepository } from '../repositories/turno.repository.js'
import { Estudio } from '../entities/estudio.entity.js'
import { Medicamento } from '../entities/medicamento.entity.js'
import { MedicamentosUsados } from '../entities/medicamentos_usados.entity.js'

export type ConsultaData = {
  diagnostico: string
  tratamiento: string
  peso: number
  observaciones?: string
  id_turno: number
  id_estudios?: number[]
  medicamentos_usados?: { id_medicamento: number; cantidad_usada: number }[]
}

export class ConsultaService {
  async findAll() {
    return consultaRepository.findAll()
  }

  async findOne(id: number) {
    return consultaRepository.findById(id)
  }

  async add(data: ConsultaData) {
    const turno = await turnoRepository.findById(data.id_turno)
    if (!turno) throw new Error('TURNO_NOT_FOUND')

    const { id_turno: _idTurno, id_estudios, medicamentos_usados, ...consultaData } = data
    const consulta = consultaRepository.add({ ...consultaData, turno })

    if (id_estudios !== undefined) await this.sincronizarEstudios(consulta, id_estudios)
    if (medicamentos_usados !== undefined) {
      await this.sincronizarMedicamentos(consulta, medicamentos_usados)
    }
    return consultaRepository.save(consulta)
  }

  async update(id: number, data: ConsultaData) {
    const consulta = await consultaRepository.findById(id)
    if (!consulta) return null

    const turno = await turnoRepository.findById(data.id_turno)
    if (!turno) throw new Error('TURNO_NOT_FOUND')

    const { id_turno: _idTurno, id_estudios, medicamentos_usados, ...cambios } = data
    Object.assign(consulta, { ...cambios, turno })
    if (id_estudios !== undefined) await this.sincronizarEstudios(consulta, id_estudios)
    if (medicamentos_usados !== undefined) {
      await this.sincronizarMedicamentos(consulta, medicamentos_usados)
    }
    return consultaRepository.save(consulta)
  }

  async patch(id: number, data: Partial<ConsultaData>) {
    const consulta = await consultaRepository.findById(id)
    if (!consulta) return null

    const { id_turno, id_estudios, medicamentos_usados, ...cambios } = data
    if (id_turno !== undefined) {
      const turno = await turnoRepository.findById(id_turno)
      if (!turno) throw new Error('TURNO_NOT_FOUND')
      consulta.turno = turno
    }
    Object.assign(consulta, cambios)
    if (id_estudios !== undefined) await this.sincronizarEstudios(consulta, id_estudios)
    if (medicamentos_usados !== undefined) {
      await this.sincronizarMedicamentos(consulta, medicamentos_usados)
    }
    return consultaRepository.save(consulta)
  }

  async remove(id: number) {
    const consulta = await consultaRepository.findById(id)
    if (!consulta) return null
    return consultaRepository.remove(consulta)
  }

  private async sincronizarEstudios(consulta: Consulta, ids: number[]) {
    const resultados = await Promise.all(ids.map((id) => estudioRepository.findById(id)))
    if (resultados.some((estudio) => !estudio)) throw new Error('ESTUDIO_NOT_FOUND')
    const estudios = resultados.filter((estudio): estudio is Estudio => estudio !== null)
    consulta.estudios.set(estudios)
  }

  private async sincronizarMedicamentos(
    consulta: Consulta,
    medicamentos: NonNullable<ConsultaData['medicamentos_usados']>,
  ) {
    const resultados = await Promise.all(
      medicamentos.map(async (item) => ({
        item,
        medicamento: await medicamentoRepository.findById(item.id_medicamento),
      })),
    )
    const medicamentosEncontrados: { item: typeof medicamentos[number]; medicamento: Medicamento }[] = []
    for (const resultado of resultados) {
      if (!resultado.medicamento) throw new Error('MEDICAMENTO_NOT_FOUND')
      medicamentosEncontrados.push({ item: resultado.item, medicamento: resultado.medicamento })
    }

    const actuales = await medicamentosUsadosRepository.findByConsulta(consulta)
    const porId = new Map<number, MedicamentosUsados>(
      actuales.map((item) => [item.medicamento.id_medicamento, item]),
    )

    for (const { item, medicamento } of medicamentosEncontrados) {
      const actual = porId.get(item.id_medicamento)
      if (actual) {
        actual.cantidad_usada = item.cantidad_usada
        porId.delete(item.id_medicamento)
      } else {
        const medicamentoUsado = medicamentosUsadosRepository.create({
          consulta,
          medicamento,
          cantidad_usada: item.cantidad_usada,
        })
        consulta.medicamentosUsados.add(medicamentoUsado)
      }
    }

    for (const medicamentoUsado of porId.values()) {
      consulta.medicamentosUsados.remove(medicamentoUsado)
      medicamentosUsadosRepository.remove(medicamentoUsado)
    }
  }
}

export const consultaService = new ConsultaService()

