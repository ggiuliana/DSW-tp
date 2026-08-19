import { Seeder } from '@mikro-orm/seeder';
import { Rol } from '../rol/rol.entity.js';

export class RolesSeeder extends Seeder {

    async run(em: any): Promise<void> {
        for (const nombre_rol of ['Administrador', 'Veterinario', 'Duenio']) {
            const rol = await em.findOne(Rol, { nombre_rol });
            if (!rol) {
                em.create(Rol, { nombre_rol });
            }
        }

        await em.flush();
    }
}