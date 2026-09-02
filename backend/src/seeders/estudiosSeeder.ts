import { Seeder } from '@mikro-orm/seeder'
import { Estudio } from '../estudio/estudio.entity.js'

export class EstudiosSeeder extends Seeder {
	async run(em: any): Promise<void> {
		const estudios = [
			{
				nombre_estudio: 'Hemograma completo',
				descripcion_estudio: 'Analisis de sangre para evaluar globulos rojos, globulos blancos y plaquetas.',
				precio_estudio: 8500,
			},
			{
				nombre_estudio: 'Perfil bioquimico',
				descripcion_estudio: 'Evaluacion de la funcion hepatica, renal y los principales valores metabolicos.',
				precio_estudio: 12500,
			},
			{
				nombre_estudio: 'Radiografia digital',
				descripcion_estudio: 'Imagen radiografica para diagnostico de lesiones oseas y alteraciones internas.',
				precio_estudio: 18000,
			},
			{
				nombre_estudio: 'Ecografia abdominal',
				descripcion_estudio: 'Estudio por imagen para observar organos y estructuras de la cavidad abdominal.',
				precio_estudio: 22000,
			},
			{
				nombre_estudio: 'Analisis de orina',
				descripcion_estudio: 'Examen de orina para detectar infecciones y alteraciones en el sistema urinario.',
				precio_estudio: 6500,
			},
		]

		for (const datosEstudio of estudios) {
			const estudio = await em.findOne(Estudio, { nombre_estudio: datosEstudio.nombre_estudio })
			if (!estudio) {
				em.create(Estudio, datosEstudio)
			}
		}

		await em.flush()
	}
}
