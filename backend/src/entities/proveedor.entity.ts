import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Proveedor {
  @PrimaryKey({ autoincrement: true })
  id_proveedor?: number

  @Property({ length: 30 })
  nombre_proveedor!: string

  @Property({ length: 30 })
  cuit!: string

  @Property()
  telefono_proveedor!: string

  @Property({ length: 50 })
  mail_proveedor!: string

  @Property({ length: 100 })
  razon_social!: string

  @Property({ length: 100 })
  direccion_proveedor!: string
}