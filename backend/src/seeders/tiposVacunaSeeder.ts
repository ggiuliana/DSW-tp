import { Seeder } from '@mikro-orm/seeder';
import { TipoVacuna } from '../entities/tipo_vacuna.entity.js';

export class TiposVacunaSeeder extends Seeder {
	async run(em: any): Promise<void> {
		const tiposVacuna = [
			{
				nombre_tipo_vacuna: 'Antirrabica',
				descripcion_tipo_vacuna: 'Previene la rabia en perros y gatos.',
			},
			{
				nombre_tipo_vacuna: 'Quintuple canina',
				descripcion_tipo_vacuna: 'Protege contra las principales enfermedades virales caninas.',
			},
			{
				nombre_tipo_vacuna: 'Triple felina',
				descripcion_tipo_vacuna: 'Protege contra enfermedades respiratorias y virales felinas.',
			},
		];

		for (const datosTipoVacuna of tiposVacuna) {
			const tipoVacuna = await em.findOne(TipoVacuna, {
				nombre_tipo_vacuna: datosTipoVacuna.nombre_tipo_vacuna,
			});

			if (!tipoVacuna) {
				em.create(TipoVacuna, datosTipoVacuna);
			}
		}

		await em.flush();
	}
}
