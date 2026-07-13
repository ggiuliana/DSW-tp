import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';
import { Duenio } from '../duenio/duenio.entity.js';

@Entity()
export class Mascota {
    @PrimaryKey({ autoincrement: true })
    id_mascota?: number
    
    @Property({ length: 50 })
    nombre_mascota!: string

    @Property({ length: 30 })
    especie!: string

    @Property({ length: 30 })
    raza!: string

    @Property()
    castrado!: boolean

    @Property({ length: 1 })
    sexo!: string

    @Property()
    fechaNac!: Date

    @ManyToOne(() => Duenio)
    duenio!: Duenio;
}
