import { Seeder } from '@mikro-orm/seeder';
import { PermisosSeeder } from './permisosSeeder.js';
import { UsuariosSeeder } from './usuariosSeeder.js';
import { EstudiosSeeder } from './estudiosSeeder.js';
import { MascotasSeeder } from './mascotasSeeder.js';
import { TurnosSeeder } from './turnosSeeder.js';
import { TiposVacunaSeeder } from './tiposVacunaSeeder.js';
import { GrupoPermisoSeeder } from './gruposSeeder.js'

export class DatabaseSeeder extends Seeder {
    async run(em: any): Promise<void> {
        await this.call(em, [
            PermisosSeeder, 
            GrupoPermisoSeeder,
            UsuariosSeeder,
            MascotasSeeder,
            EstudiosSeeder,
            TiposVacunaSeeder,
            TurnosSeeder]);
    }
}
