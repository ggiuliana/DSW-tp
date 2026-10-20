import { Seeder } from '@mikro-orm/seeder';
import { Consulta } from '../entities/consulta.entity.js';
import { Estudio } from '../entities/estudio.entity.js';
import { Mascota } from '../entities/mascota.entity.js';
import { Turno } from '../entities/turno.entity.js';
import { Veterinario } from '../entities/veterinario.entity.js';

export class TurnosSeeder extends Seeder {
	async run(em: any): Promise<void> {
		const veterinario1 = await em.findOneOrFail(Veterinario, {
			mail: 'vet1.demo@veterinaria.local',
		});
		const veterinario2 = await em.findOneOrFail(Veterinario, {
			mail: 'vet2.demo@veterinaria.local',
		});
		const luna = await em.findOneOrFail(Mascota, { nombre_mascota: 'Luna' });
		const michi = await em.findOneOrFail(Mascota, { nombre_mascota: 'Michi' });

		const turnos = [
			{
				fecha_turno: new Date('2026-10-22'),
				hora_turno: '09:00:00',
				estado_turno: 'Pendiente',
				veterinario: veterinario1,
			},
			{
				fecha_turno: new Date('2026-10-22'),
				hora_turno: '10:30:00',
				estado_turno: 'Pendiente',
				veterinario: veterinario2,
			},
			{
				fecha_turno: new Date('2026-10-23'),
				hora_turno: '10:30:00',
				estado_turno: 'Confirmado',
				mascota: luna,
				veterinario: veterinario1,
			},
			{
				fecha_turno: new Date('2026-10-04'),
				hora_turno: '12:00:00',
				estado_turno: 'Resuelto',
				mascota: michi,
				veterinario: veterinario2,
			},
		];

		for (const datosTurno of turnos) {
			const turno = await em.findOne(Turno, {
				fecha_turno: datosTurno.fecha_turno,
				hora_turno: datosTurno.hora_turno,
				veterinario: datosTurno.veterinario,
			});

			if (!turno) {
				em.create(Turno, datosTurno);
			}
		}

		await em.flush();

		const turnoConConsulta = await em.findOneOrFail(Turno, {
			fecha_turno: new Date('2026-10-04'),
			hora_turno: '12:00:00',
			veterinario: veterinario2,
		});
		const consultaExistente = await em.findOne(Consulta, { turno: turnoConConsulta });

		if (!consultaExistente) {
			const estudio = await em.findOneOrFail(Estudio, {
				nombre_estudio: 'Hemograma completo',
			});
			const consulta = em.create(Consulta, {
				diagnostico: 'Gastroenteritis leve',
				tratamiento: 'Dieta blanda y control en 7 dias.',
				peso: 4.2,
				observaciones: 'La mascota evoluciona favorablemente.',
				turno: turnoConConsulta,
			});
			consulta.estudios.add(estudio);
		}

		await em.flush();
	}
}
