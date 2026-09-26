import { Seeder } from '@mikro-orm/seeder'
import { Permiso } from '../permiso/permiso.entity.js'

export class PermisosSeeder extends Seeder {
    async run(em: any): Promise<void> {
        const permisos = [
            //Permisos de duenios
            { nombre_permiso: 'Leer', descripcion_permiso: 'Leer duenios', categoria: 'duenios', activo: true },
            { nombre_permiso: 'Agregar', descripcion_permiso: 'Agregar duenios', categoria: 'duenios', activo: true },
            { nombre_permiso: 'Actualizar', descripcion_permiso: 'Actualizar duenios', categoria: 'duenios', activo: true },
            { nombre_permiso: 'Eliminar', descripcion_permiso: 'Eliminar duenios', categoria: 'duenios', activo: true },
            //Permisos de veterinarios
            { nombre_permiso: 'Leer', descripcion_permiso: 'Leer veterinarios', categoria: 'veterinarios', activo: true },
            { nombre_permiso: 'Agregar', descripcion_permiso: 'Agregar veterinarios', categoria: 'veterinarios', activo: true },
            { nombre_permiso: 'Actualizar', descripcion_permiso: 'Actualizar veterinarios', categoria: 'veterinarios', activo: true },
            { nombre_permiso: 'Eliminar', descripcion_permiso: 'Leer veterinarios', categoria: 'veterinarios', activo: true },
            //Permisos de mascotas
            { nombre_permiso: 'Leer', descripcion_permiso: 'Leer mascotas', categoria: 'mascotas', activo: true },
            { nombre_permiso: 'Agregar', descripcion_permiso: 'Agregar mascotas', categoria: 'mascotas', activo: true },
            { nombre_permiso: 'Actualizar', descripcion_permiso: 'Actualizar mascotas', categoria: 'mascotas', activo: true },
            { nombre_permiso: 'Eliminar', descripcion_permiso: 'Eliminar mascotas', categoria: 'mascotas', activo: true },
            //Permisos de usuarios
            { nombre_permiso: 'Leer', descripcion_permiso: 'Leer usuarios', categoria: 'usuarios', activo: true },
            { nombre_permiso: 'Agregar', descripcion_permiso: 'Agregar usuarios', categoria: 'usuarios', activo: true },
            { nombre_permiso: 'Actualizar', descripcion_permiso: 'Actualizar usuarios', categoria: 'usuarios', activo: true },
            { nombre_permiso: 'Eliminar', descripcion_permiso: 'Eliminar usuarios', categoria: 'usuarios', activo: true },
            //Permisos de estudios
            { nombre_permiso: 'Leer', descripcion_permiso: 'Leer estudios', categoria: 'estudios', activo: true },
            { nombre_permiso: 'Agregar', descripcion_permiso: 'Agregar estudios', categoria: 'estudios', activo: true },
            { nombre_permiso: 'Actualizar', descripcion_permiso: 'Actualizar estudios', categoria: 'estudios', activo: true },
            { nombre_permiso: 'Eliminar', descripcion_permiso: 'Eliminar estudios', categoria: 'estudios', activo: true },
            //Permisos de medicamentos
            { nombre_permiso: 'Leer', descripcion_permiso: 'Leer medicamentos', categoria: 'medicamentos', activo: true },
            { nombre_permiso: 'Agregar', descripcion_permiso: 'Agregar medicamentos', categoria: 'medicamentos', activo: true },
            { nombre_permiso: 'Actualizar', descripcion_permiso: 'Actualizar medicamentos', categoria: 'medicamentos', activo: true },
            { nombre_permiso: 'Eliminar', descripcion_permiso: 'Eliminar medicamentos', categoria: 'medicamentos', activo: true },
            //Permisos de proveedores
            { nombre_permiso: 'Leer', descripcion_permiso: 'Leer proveedores', categoria: 'proveedores', activo: true },
            { nombre_permiso: 'Agregar', descripcion_permiso: 'Agregar proveedores', categoria: 'proveedores', activo: true },
            { nombre_permiso: 'Actualizar', descripcion_permiso: 'Actualizar proveedores', categoria: 'proveedores', activo: true },
            { nombre_permiso: 'Eliminar', descripcion_permiso: 'Leer proveedores', categoria: 'proveedores', activo: true },
            //Permisos de tipo_vacunas
            { nombre_permiso: 'Leer', descripcion_permiso: 'Leer tipo_vacunas', categoria: 'tipo_vacunas', activo: true },
            { nombre_permiso: 'Agregar', descripcion_permiso: 'Agregar tipo_vacunas', categoria: 'tipo_vacunas', activo: true },
            { nombre_permiso: 'Actualizar', descripcion_permiso: 'Actualizar tipo_vacunas', categoria: 'tipo_vacunas', activo: true },
            { nombre_permiso: 'Eliminar', descripcion_permiso: 'Leer tipo_vacunas', categoria: 'tipo_vacunas', activo: true },
            //Permisos de consultas
            { nombre_permiso: 'Leer', descripcion_permiso: 'Leer consultas', categoria: 'consultas', activo: true },
            { nombre_permiso: 'Agregar', descripcion_permiso: 'Agregar consultas', categoria: 'consultas', activo: true },
            { nombre_permiso: 'Actualizar', descripcion_permiso: 'Actualizar consultas', categoria: 'consultas', activo: true },
            { nombre_permiso: 'Eliminar', descripcion_permiso: 'Leer consultas', categoria: 'consultas', activo: true },
            //Permisos de turnos
            { nombre_permiso: 'Leer', descripcion_permiso: 'Leer turnos', categoria: 'turnos', activo: true },
            { nombre_permiso: 'Agregar', descripcion_permiso: 'Agregar turnos', categoria: 'turnos', activo: true },
            { nombre_permiso: 'Actualizar', descripcion_permiso: 'Actualizar turnos', categoria: 'turnos', activo: true },
            { nombre_permiso: 'Eliminar', descripcion_permiso: 'Leer turnos', categoria: 'turnos', activo: true}
        ]

        for (const datosPermiso of permisos) {
            const permiso = await em.findOne(Permiso, { descripcion_permiso: datosPermiso.descripcion_permiso })
            if (!permiso) {
                em.create(Permiso, datosPermiso)
            }
        }

        await em.flush()
    }
}
