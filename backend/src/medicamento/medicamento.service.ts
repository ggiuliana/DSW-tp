import { Medicamento } from './meidcamento.entity.js'
import { medicamentoRepository } from './medicamento.repository.js'
import { proveedorRepository } from '../proveedor/proveedor.repository.js'

export type MedicamentoData = {
  nombre_medicamento: string
  cantidad_restante: number
  cantidad_minima: number
  id_proveedor: number
}

export class MedicamentoService {
  async findAll() {
    return medicamentoRepository.findAll()
  }

  async findOne(id: number) {
    return medicamentoRepository.findById(id)
  }

  async add(data: MedicamentoData) {
    const proveedor = await proveedorRepository.findById(data.id_proveedor)
    if (!proveedor) throw new Error('PROVEEDOR_NOT_FOUND')

    const { id_proveedor: _idProveedor, ...medicamentoData } = data
    const medicamento = medicamentoRepository.create({ ...medicamentoData, proveedor })
    return medicamentoRepository.save(medicamento)
  }

  async update(id: number, data: MedicamentoData) {
    const medicamento = await medicamentoRepository.findById(id)
    if (!medicamento) return null

    const proveedor = await proveedorRepository.findById(data.id_proveedor)
    if (!proveedor) throw new Error('PROVEEDOR_NOT_FOUND')

    const { id_proveedor: _idProveedor, ...medicamentoData } = data
    Object.assign(medicamento, { ...medicamentoData, proveedor })
    return medicamentoRepository.save(medicamento)
  }

  async patch(id: number, data: Partial<MedicamentoData>) {
    const medicamento = await medicamentoRepository.findById(id)
    if (!medicamento) return null

    const { id_proveedor, ...medicamentoData } = data
    if (id_proveedor !== undefined) {
      const proveedor = await proveedorRepository.findById(id_proveedor)
      if (!proveedor) throw new Error('PROVEEDOR_NOT_FOUND')
      medicamento.proveedor = proveedor
    }

    Object.assign(medicamento, medicamentoData)
    return medicamentoRepository.save(medicamento)
  }

  async remove(id: number) {
    const medicamento = await medicamentoRepository.findById(id)
    if (!medicamento) return null
    return medicamentoRepository.remove(medicamento)
  }
}

export const medicamentoService = new MedicamentoService()