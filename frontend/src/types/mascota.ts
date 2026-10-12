import type { TipoVacuna } from './tipovacuna.ts'

export interface Mascota {
    id_mascota: number;
    nombre_mascota: string;
    especie: string;
    raza: string;
    castrado: boolean;
    sexo: string;
    fechaNac: string;
    vacunas?: VacunaAplicada[];
}

export interface MascotaTurno {
    id_mascota: number;
    nombre_mascota: string;
    especie: string;
}

export interface VacunaAplicada {
    tipo_vacuna: TipoVacuna;
    fecha_aplicacion: string;
}