import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core'
import { Mascota } from './mascota.entity.js'
import { TipoVacuna } from './tipo_vacuna.entity.js'

@Entity()
export class Vacuna {
  @ManyToOne(() => Mascota, { primary: true, onDelete: 'cascade' })
  mascota!: Mascota

  @ManyToOne(() => TipoVacuna, { primary: true })
  tipo_vacuna!: TipoVacuna

  @PrimaryKey({ type: 'date' })
  fecha_aplicacion!: Date
}