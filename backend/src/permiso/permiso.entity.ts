import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Permiso {
    @PrimaryKey({autoincrement: true})
    id_permiso!: number

    @Property()
    nombre_permiso!: string

    @Property()
    descripcion_permiso!: string

    @Property()
    categoria!: string

    @Property()
    activo!: boolean
}