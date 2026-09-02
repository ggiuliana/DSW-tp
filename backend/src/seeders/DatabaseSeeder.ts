import { Seeder } from '@mikro-orm/seeder';
import { RolesSeeder } from './rolesSeeder.js';
import { UsuariosSeeder } from './usuariosSeeder.js';
import { EstudiosSeeder } from './estudiosSeeder.js';

export class DatabaseSeeder extends Seeder {
    async run(em: any): Promise<void> {
        await this.call(em, [RolesSeeder, UsuariosSeeder, EstudiosSeeder]);
    }
}
