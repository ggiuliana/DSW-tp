import { Seeder } from '@mikro-orm/seeder';
import { Usuario } from '../usuario/usuario.entity.js';
import { Grupo_Permiso } from '../grupo_permiso/grupo_permiso.entity.js';

export class UsuariosSeeder extends Seeder {

    async run(em: any): Promise<void> {
        const usuarioExistente = await em.findOne(Usuario, { nombre_usuario: 'admin' });
        if (usuarioExistente) {
            return;
        }

        const grupoAdministrador = await em.findOneOrFail(Grupo_Permiso, {
            nombre_grupo: 'Administrador'
        });

        em.create(Usuario, {
            nombre_usuario: 'admin',
            contrasenia: "admin123",
            estado: "Activo",
            grupo: grupoAdministrador
        });

        await em.flush();
    }
}