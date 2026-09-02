import { Estudio } from './estudio.entity.js'
import { estudioRepository } from './estudio.repository.js'

export type EstudioData = {
  nombre_estudio: string
  descripcion_estudio: string
  precio_estudio: number
}

export class EstudioService {
  async findAll() {
    return estudioRepository.findAll()
  }

  async findOne(id: number) {
    return estudioRepository.findById(id)
  }

  async add(data: Estudio) {
    const EstudioData: EstudioData = {
        ...data
    }
    const est = estudioRepository.create(EstudioData)
    return estudioRepository.save(est)
  }

  async update(id: number, data: EstudioData) {
    const estudio = await estudioRepository.findById(id)
    if (!estudio) return null
    Object.assign(estudio, { ...data})
    return estudioRepository.save(estudio)
  }

  async patch(id: number, data: Partial<EstudioData>) {
    const estudio = await estudioRepository.findById(id)
    if (!estudio) return null
    const cambios = { ...data }
    Object.assign(estudio, cambios)
    return estudioRepository.save(estudio)
  }

  async remove(id: number) {
    const estudio = await estudioRepository.findById(id)
    if (!estudio) return null
    return estudioRepository.remove(estudio)
  }
}

export const estudioService = new EstudioService()
