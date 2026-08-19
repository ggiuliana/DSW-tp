import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({
  discriminatorColumn: 'tipo_persona',
  abstract: true,
})
export abstract class Persona {
  @PrimaryKey({ autoincrement: true })
  id_persona?: number

  @Property()
  nombre!: string

  @Property()
  apellido!: string

  @Property()
  telefono!: string

  @Property({ unique: true })
  mail!: string

  @Property()
  dni!: string

  @Property()
  direccion!: string

}
