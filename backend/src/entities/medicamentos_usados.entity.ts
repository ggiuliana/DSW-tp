import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Consulta } from './consulta.entity.js';
import { Medicamento } from './medicamento.entity.js';

@Entity()
export class MedicamentosUsados {
    @ManyToOne(() => Consulta, { primary: true, onDelete: 'cascade' })
    consulta!: Consulta;

    @ManyToOne(() => Medicamento, { primary: true, onDelete: 'cascade' })
    medicamento!: Medicamento;

    @Property()
    cantidad_usada!: number;
}
