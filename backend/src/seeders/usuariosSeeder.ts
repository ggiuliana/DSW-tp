import { Seeder } from '@mikro-orm/seeder';
import { Usuario } from '../usuario/usuario.entity.js';
import { Rol } from '../rol/rol.entity.js';

export class UsuariosSeeder extends Seeder {

    async run(em: any): Promise<void> {
        const usuarioExistente = await em.findOne(Usuario, { nombre_usuario: 'admin' });
        if (usuarioExistente) {
            return;
        }

        const rolAdministrador = await em.findOneOrFail(Rol, {
            nombre_rol: 'Administrador'
        });

        em.create(Usuario, {
            nombre_usuario: 'admin',
            contrasenia: "admin123",
            estado: "Activo",
            rol: rolAdministrador
        });

        await em.flush();
    }
}