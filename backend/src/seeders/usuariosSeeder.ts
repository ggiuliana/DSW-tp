import { Seeder } from '@mikro-orm/seeder';
import { Usuario } from '../entities/usuario.entity.js';
import { Grupo_Permiso } from '../entities/grupo_permiso.entity.js';
import { Veterinario } from '../entities/veterinario.entity.js';

export class UsuariosSeeder extends Seeder {

    async run(em: any): Promise<void> {
        const grupoAdministrador = await em.findOneOrFail(Grupo_Permiso, {
            nombre_grupo: 'Administrador'
        });

        const grupoVeterinario = await em.findOneOrFail(Grupo_Permiso, {
            nombre_grupo: 'Veterinario'
        });

        const administrador = await em.findOne(Usuario, { nombre_usuario: 'admin' });
        if (administrador) {
            administrador.grupo = grupoAdministrador;
        } else {
            em.create(Usuario, {
                nombre_usuario: 'admin',
                contrasenia: "admin123",
                estado: "Activo",
                grupo: grupoAdministrador
            });
        }

        const veterinario = await em.findOne(
            Usuario,
            { nombre_usuario: 'vet1' },
            { populate: ['persona'] }
        );
        const perfilDemo = await em.findOne(Veterinario, { mail: 'vet1.demo@veterinaria.local' });
        const perfil = veterinario?.persona ?? perfilDemo ?? em.create(Veterinario, {
            nombre: 'Mumbiana',
            apellido: 'Grande',
            telefono: '3413085544',
            mail: 'vet1.demo@veterinaria.local',
            dni: '40327454',
            direccion: 'Magoya 1122',
            matricula: 'MF12TF',
            especialidad: 'Clínica general'
        });

        if (veterinario) {
            veterinario.grupo = grupoVeterinario;
            veterinario.persona = perfil;
        } else {
            em.create(Usuario, {
                nombre_usuario: 'vet1',
                contrasenia: "vet123",
                estado: "Activo",
                grupo: grupoVeterinario,
                persona: perfil
            });
        }

        await em.flush();
    }
}