import { Seeder } from '@mikro-orm/seeder';
import { Rol } from '../rol/rol.entity.js';

export class RolesSeeder extends Seeder {

    async run(em: any): Promise<void> {

        em.create(Rol, {
            nombre_rol: 'Administrador'
        });

        em.create(Rol, {
            nombre_rol: 'Veterinario'
        });

        em.create(Rol, {
            nombre_rol: 'Duenio'
        });

        await em.flush();
    }
}