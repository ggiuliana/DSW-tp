import { Entity, ManyToMany, PrimaryKey, Property, Collection } from '@mikro-orm/core'
import { Permiso } from '../permiso/permiso.entity.js'

@Entity()
export class Grupo_Permiso {
    @PrimaryKey({autoincrement: true})
    id_grupo?: number

    @Property()
    nombre_grupo!: string

    @Property()
    descripcion_grupo!: string

    @Property({ onCreate: () => new Date() })
    fecha_creacion?: Date

    @Property()
    activo!: boolean

    @ManyToMany(() => Permiso)
    permisos = new Collection<Permiso>(this);
}