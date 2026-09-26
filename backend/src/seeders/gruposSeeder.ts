import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Permiso } from '../permiso/permiso.entity.js';
import { Grupo_Permiso } from '../grupo_permiso/grupo_permiso.entity.js';

export class GrupoPermisoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {

    const todosLosPermisos = await em.find(Permiso, {});

    const configuracionDuenio: Record<string, string[]> = {
    turnos: ['Leer', 'Actualizar'],
    consultas: ['Leer'],
    usuarios: ['Leer', 'Actualizar'],
    mascotas: ['Leer', 'Agregar', 'Actualizar', 'Eliminar'],
    tipo_vacunas: ['Leer']
    };

    const permisosDuenio = todosLosPermisos.filter(p => {
        const permitidosEnCategoria = configuracionDuenio[p.categoria];
        return permitidosEnCategoria && permitidosEnCategoria.includes(p.nombre_permiso);
    });

    const configuracionVeterinario: Record<string, string[]> = {
    turnos: ['Leer', 'Agregar', 'Actualizar', 'Eliminar'],
    consultas: ['Leer', 'Agregar', 'Actualizar', 'Eliminar'],
    usuarios: ['Leer', 'Actualizar'],
    mascotas: ['Leer'],
    medicamentos: ['Leer','Actualizar'],
    estudios: ['Leer'],
    };

    const permisosVeterinario = todosLosPermisos.filter(p => {
        const permitidosEnCategoria = configuracionVeterinario[p.categoria];
        return permitidosEnCategoria && permitidosEnCategoria.includes(p.nombre_permiso);
    });

    const grupos = [
        {
            nombre_grupo: 'Administrador',
            descripcion_grupo: 'Todos los permisos.',
            activo: true,
            permisos: todosLosPermisos
        },
        {
            nombre_grupo: 'Duenio',
            descripcion_grupo: 'Permisos para gestionar las mascotas, sacar turnos, ver las consultas y los tipos de vacunas.',
            activo: true,
            permisos: permisosDuenio
        },
        {
            nombre_grupo: 'Veterinario',
            descripcion_grupo: 'Permisos para gestionar los turnos y consultas, poder ver las mascotas y utilizar medicamentos y estudios en las consultas.',
            activo: true,
            permisos: permisosVeterinario
        }
    ]

    for (const datosGrupo of grupos) {
            const grupo = await em.findOne(Grupo_Permiso, { nombre_grupo: datosGrupo.nombre_grupo })
            if (!grupo) {
                em.create(Grupo_Permiso, datosGrupo)
            }
        }

        await em.flush()
  }
}