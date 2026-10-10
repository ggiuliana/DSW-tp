import { Entity, ManyToOne, PrimaryKey, type Rel } from '@mikro-orm/core'
import type { Mascota } from './mascota.entity.js'
import { TipoVacuna } from './tipo_vacuna.entity.js'

@Entity()
export class Vacuna {
  @ManyToOne(() => 'Mascota', { inversedBy: 'vacunas', primary: true, onDelete: 'cascade' })
  mascota!: Rel<Mascota> & object

  @ManyToOne(() => TipoVacuna, { primary: true })
  tipo_vacuna!: TipoVacuna

  @PrimaryKey({ type: 'date' })
  fecha_aplicacion!: Date
}