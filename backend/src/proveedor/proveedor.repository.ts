import { Proveedor } from './proveedor.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em
type ProveedorCreateData = Pick<Proveedor, 'nombre_proveedor' | 'cuit' | 'telefono_proveedor' | 'mail_proveedor' | 'razon_social' | 'direccion_proveedor'>

export class ProveedorRepository {
  findAll() {
    return em.find(Proveedor, {})
  }

  findById(id: number) {
    return em.findOne(Proveedor, { id_proveedor: id })
  }

  create(data: ProveedorCreateData) {
    const proveedor = new Proveedor()
    Object.assign(proveedor, data)
    em.persist(proveedor)
    return proveedor
  }

  async save(proveedor: Proveedor) {
    await em.flush()
    return proveedor
  }

  async remove(proveedor: Proveedor) {
    await em.removeAndFlush(proveedor)
    return proveedor
  }
}

export const proveedorRepository = new ProveedorRepository()
