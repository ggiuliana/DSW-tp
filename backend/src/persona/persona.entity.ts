import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Persona {
  @PrimaryKey({ autoincrement: true })
  id_persona?: number

  @Property()
  nombre!: string

  @Property()
  apellido!: string

  @Property()
  telefono!: string

  @Property()
  mail!: string

  @Property()
  dni!: string

  @Property()
  direccion!: string

}
