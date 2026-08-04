import { Entity, OneToOne } from '@mikro-orm/core'
import { Persona } from '../persona/persona.entity.js'

@Entity()
export class Duenio {
    @OneToOne(() => Persona, { primary: true })
    persona!: Persona;
}
