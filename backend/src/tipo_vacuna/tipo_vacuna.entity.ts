import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class TipoVacuna {
  @PrimaryKey({ autoincrement: true })
  id_tipo_vacuna!: number

  @Property({ length: 30 })
  nombre_tipo_vacuna!: string

  @Property({ length: 200 })
  descripcion_tipo_vacuna!: string
}