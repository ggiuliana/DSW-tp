import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Rol {
    @PrimaryKey({autoincrement: true})
    id_rol!: number

    @Property()
    nombre_rol!: string
}
