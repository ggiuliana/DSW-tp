import { Entity, PrimaryKey, ManyToOne, Property, TimeType } from '@mikro-orm/core';
import { Mascota } from './mascota.entity.js'
import { Veterinario } from './veterinario.entity.js'

type TimeOnly = `${number}:${number}` | `${number}:${number}:${number}`;

@Entity()
export class Turno {
    @PrimaryKey({ autoincrement: true })
    id_turno?: number
    
    @Property()
    fecha_turno!: Date

    @Property({ type: TimeType })
    hora_turno!: TimeOnly

    @Property()
    estado_turno!: string

    @Property({ length: 200, nullable: true })
    observaciones_turno?: string

    @ManyToOne(() => Mascota, {nullable: true, onDelete: 'set null'})
    mascota?: Mascota;

    @ManyToOne(() => Veterinario, {nullable: false, onDelete: 'cascade'})
    veterinario!: Veterinario;
}
