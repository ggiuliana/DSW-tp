import { Entity, Property } from '@mikro-orm/core'
import { Persona } from './persona.entity.js'

@Entity({
  discriminatorValue: 'veterinario',
})
export class Veterinario extends Persona {

    @Property()
    matricula!: string

    @Property()
    especialidad!: string

}
