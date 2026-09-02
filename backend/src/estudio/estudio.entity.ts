import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Estudio {
  @PrimaryKey({ autoincrement: true })
  id_estudio!: number

  @Property({ length: 30 })
  nombre_estudio!: string

  @Property({ length: 200 })
  descripcion_estudio!: string

  @Property()
  precio_estudio!: number
}