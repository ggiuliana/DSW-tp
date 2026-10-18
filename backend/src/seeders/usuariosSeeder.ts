import { Seeder } from '@mikro-orm/seeder';
import { Usuario } from '../entities/usuario.entity.js';
import { Grupo_Permiso } from '../entities/grupo_permiso.entity.js';
import { Veterinario } from '../entities/veterinario.entity.js';
import { Duenio } from '../entities/duenio.entity.js';

export class UsuariosSeeder extends Seeder {

    async run(em: any): Promise<void> {
        const grupoAdministrador = await em.findOneOrFail(Grupo_Permiso, {
            nombre_grupo: 'Administrador'
        });

        const grupoVeterinario = await em.findOneOrFail(Grupo_Permiso, {
            nombre_grupo: 'Veterinario'
        });

        const grupoDuenio = await em.findOneOrFail(Grupo_Permiso, {
            nombre_grupo: 'Duenio'
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
        const perfilVet1Demo = await em.findOne(Veterinario, { mail: 'vet1.demo@veterinaria.local' });
        const perfil1 = veterinario?.persona ?? perfilVet1Demo ?? em.create(Veterinario, {
            nombre: 'Antonio',
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
            veterinario.persona = perfil1;
        } else {
            em.create(Usuario, {
                nombre_usuario: 'vet1',
                contrasenia: "vet123",
                estado: "Activo",
                grupo: grupoVeterinario,
                persona: perfil1
            });
        }

        const veterinario2 = await em.findOne(
            Usuario,
            { nombre_usuario: 'vet2' },
            { populate: ['persona'] }
        );
        const perfilVet2Demo = await em.findOne(Veterinario, { mail: 'vet2.demo@veterinaria.local' });
        const perfil2 = veterinario2?.persona ?? perfilVet2Demo ?? em.create(Veterinario, {
            nombre: 'Clotilde',
            apellido: 'Carroceda',
            telefono: '3412524346',
            mail: 'vet2.demo@veterinaria.local',
            dni: '12426325',
            direccion: 'Easter 1122',
            matricula: 'MP52YG',
            especialidad: 'Cardiología'
        });

        if (veterinario2) {
            veterinario2.grupo = grupoVeterinario;
            veterinario2.persona = perfil2;
        } else {
            em.create(Usuario, {
                nombre_usuario: 'vet2',
                contrasenia: "vet123",
                estado: "Activo",
                grupo: grupoVeterinario,
                persona: perfil2
            });
        }

        const duenio = await em.findOne(
            Usuario,
            { nombre_usuario: 'duenio1' },
            { populate: ['persona'] }
        );
        const perfilDuenioDemo = await em.findOne(Veterinario, { mail: 'duenio1.demo@mail.com' });
        const perfilDuenio = duenio?.persona ?? perfilDuenioDemo ?? em.create(Duenio, {
            nombre: 'Juan',
            apellido: 'Perez',
            telefono: '3413085544',
            mail: 'duenio1.demo@mail.com',
            dni: '40327454',
            direccion: 'Ricardone 12312'
        });

        if (duenio) {
            duenio.persona = perfilDuenio;
            duenio.grupo = grupoDuenio;
        } else {
            em.create(Usuario, {
                nombre_usuario: 'duenio1',
                contrasenia: "duenio123",
                estado: "Activo",
                grupo: grupoDuenio,
                persona: perfilDuenio
            });
        }

        await em.flush();
    }
}