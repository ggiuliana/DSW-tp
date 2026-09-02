import { Proveedor } from './proveedor.entity.js'
import { proveedorRepository } from './proveedor.repository.js'

export type ProveedorData = {
    nombre_proveedor: string
    cuit: string
    telefono_proveedor: string
    mail_proveedor: string
    razon_social: string
    direccion_proveedor: string
}

export class ProveedorService {
  async findAll() {
    return proveedorRepository.findAll()
  }

  async findOne(id: number) {
    return proveedorRepository.findById(id)
  }

  async add(data: Proveedor) {
    const ProveedorData: ProveedorData = {
        ...data
    }
    const est = proveedorRepository.create(ProveedorData)
    return proveedorRepository.save(est)
  }

  async update(id: number, data: ProveedorData) {
    const proveedor = await proveedorRepository.findById(id)
    if (!proveedor) return null
    Object.assign(proveedor, { ...data})
    return proveedorRepository.save(proveedor)
  }

  async patch(id: number, data: Partial<ProveedorData>) {
    const proveedor = await proveedorRepository.findById(id)
    if (!proveedor) return null
    const cambios = { ...data }
    Object.assign(proveedor, cambios)
    return proveedorRepository.save(proveedor)
  }

  async remove(id: number) {
    const proveedor = await proveedorRepository.findById(id)
    if (!proveedor) return null
    return proveedorRepository.remove(proveedor)
  }
}

export const proveedorService = new ProveedorService()
