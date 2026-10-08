import { Entity, PrimaryKey, Property, Collection, ManyToMany, OneToOne, OneToMany } from '@mikro-orm/core';
import { Estudio } from './estudio.entity.js'
import { Turno } from './turno.entity.js'
import { MedicamentosUsados } from './medicamentos_usados.entity.js'

@Entity()
export class Consulta {
    @PrimaryKey({ autoincrement: true })
    id_consulta?: number
    
    @Property({ length: 100})
    diagnostico!: string

    @Property({ length: 200})
    tratamiento!: string

    @Property({ type: 'decimal', precision: 5, scale: 2 })
    peso!: number

    @Property({ length: 200, nullable: true })
    observaciones?: string

    @ManyToMany(() => Estudio)
    estudios = new Collection<Estudio>(this);

    @OneToMany(() => MedicamentosUsados, (medicamentoUsado) => medicamentoUsado.consulta)
    medicamentosUsados = new Collection<MedicamentosUsados>(this);

    @OneToOne(() => Turno, { nullable: false, onDelete: 'cascade' })
    turno!: Turno;
}
