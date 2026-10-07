import { TipoVacuna } from './tipo_vacuna.entity.js'
import { tipoVacunaRepository } from './tipo_vacuna.repository.js'

export type TipoVacunaData = Pick<TipoVacuna, 'nombre_tipo_vacuna' | 'descripcion_tipo_vacuna'>

export class TipoVacunaService {
  async findAll() {
    return tipoVacunaRepository.findAll()
  }

  async findOne(id: number) {
    return tipoVacunaRepository.findById(id)
  }

  async add(data: TipoVacunaData) {
    const tipoVacuna = tipoVacunaRepository.create(data)
    return tipoVacunaRepository.save(tipoVacuna)
  }

  async update(id: number, data: TipoVacunaData) {
    const tipoVacuna = await tipoVacunaRepository.findById(id)
    if (!tipoVacuna) return null
    Object.assign(tipoVacuna, data)
    return tipoVacunaRepository.save(tipoVacuna)
  }

  async patch(id: number, data: Partial<TipoVacunaData>) {
    const tipoVacuna = await tipoVacunaRepository.findById(id)
    if (!tipoVacuna) return null
    Object.assign(tipoVacuna, data)
    return tipoVacunaRepository.save(tipoVacuna)
  }

  async remove(id: number) {
    const tipoVacuna = await tipoVacunaRepository.findById(id)
    if (!tipoVacuna) return null
    return tipoVacunaRepository.remove(tipoVacuna)
  }
}

export const tipoVacunaService = new TipoVacunaService()