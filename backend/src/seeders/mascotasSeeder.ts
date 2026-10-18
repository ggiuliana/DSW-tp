import { Seeder } from '@mikro-orm/seeder';
import { Duenio } from '../entities/duenio.entity.js';
import { Mascota } from '../entities/mascota.entity.js';
import { Usuario } from '../entities/usuario.entity.js';

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
	}
}
