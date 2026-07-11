import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Duenio {
  @PrimaryKey({ autoincrement: true })
  id_duenio?: number

  @Property()
  nombre_duenio!: string

  @Property()
  apellido_duenio!: string

  @Property()
  telefono_duenio!: string

  @Property()
  mail_duenio!: string

  @Property()
  dni!: string

  @Property()
  direccion!: string

}
