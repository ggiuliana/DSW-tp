import { Seeder } from '@mikro-orm/seeder';
import { Duenio } from '../entities/duenio.entity.js';
import { Mascota } from '../entities/mascota.entity.js';
import { Usuario } from '../entities/usuario.entity.js';
import { TipoVacuna } from '../entities/tipo_vacuna.entity.js';
import { Vacuna } from '../entities/vacuna.entity.js';

export class MascotasSeeder extends Seeder {
	async run(em: any): Promise<void> {
		const usuarioDuenio = await em.findOneOrFail(
			Usuario,
			{ nombre_usuario: 'duenio1' },
			{ populate: ['persona'] }
		);

		if (!(usuarioDuenio.persona instanceof Duenio)) {
			throw new Error('El usuario duenio1 no tiene un perfil de dueño válido.');
		}

		const mascotas = [
			{
				nombre_mascota: 'Luna',
				especie: 'Perro',
				raza: 'Labrador',
				castrado: true,
				sexo: 'H',
				fechaNac: new Date('2020-04-15'),
				duenio: usuarioDuenio.persona,
			},
			{
				nombre_mascota: 'Michi',
				especie: 'Gato',
				raza: 'Europeo',
				castrado: false,
				sexo: 'M',
				fechaNac: new Date('2022-09-03'),
				duenio: usuarioDuenio.persona,
			},
		];

		for (const datosMascota of mascotas) {
			const mascota = await em.findOne(Mascota, {
				nombre_mascota: datosMascota.nombre_mascota,
				duenio: datosMascota.duenio,
			});

			if (!mascota) {
				em.create(Mascota, datosMascota);
			}
		}

		await em.flush();

		const vacunasPorMascota = {
			Luna: [
				{ tipo: 'Antirrabica', fecha: new Date('2024-04-15') },
				{ tipo: 'Quintuple canina', fecha: new Date('2024-04-15') },
			],
			Michi: [
				{ tipo: 'Antirrabica', fecha: new Date('2024-09-03') },
				{ tipo: 'Triple felina', fecha: new Date('2024-09-03') },
			],
		} as const;

		for (const [nombreMascota, vacunas] of Object.entries(vacunasPorMascota)) {
			const mascota = await em.findOneOrFail(Mascota, {
				nombre_mascota: nombreMascota,
				duenio: usuarioDuenio.persona,
			});

			for (const datosVacuna of vacunas) {
				const tipoVacuna = await em.findOneOrFail(TipoVacuna, {
					nombre_tipo_vacuna: datosVacuna.tipo,
				});

				const vacuna = await em.findOne(Vacuna, {
					mascota,
					tipo_vacuna: tipoVacuna,
					fecha_aplicacion: datosVacuna.fecha,
				});

				if (!vacuna) {
					em.create(Vacuna, {
						mascota,
						tipo_vacuna: tipoVacuna,
						fecha_aplicacion: datosVacuna.fecha,
					});
				}
			}
		}

		await em.flush();
	}
}
