import { Entity } from '@mikro-orm/core'
import { Persona } from '../persona/persona.entity.js'

@Entity({
  discriminatorValue: 'duenio',
})
export class Duenio extends Persona {
}
