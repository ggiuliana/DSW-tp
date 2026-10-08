import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core'
import { Proveedor } from './proveedor.entity.js'

@Entity()
export class Medicamento {
  @PrimaryKey({ autoincrement: true })
  id_medicamento!: number

  @Property({ length: 30 })
  nombre_medicamento!: string

  @Property({ length: 200 })
  cantidad_restante!: number

  @Property()
  cantidad_minima!: number

  @ManyToOne(() => Proveedor)
  proveedor!: Proveedor
}