import type { MascotaTurno } from "./mascota";

export interface Turno {
  id_turno: number;
  fecha_turno: string;
  hora_turno: string;
  estado_turno: string;
  observaciones_turno?: string;
  mascota?: MascotaTurno;
  veterinario?: { nombre: string; apellido: string };
}

export interface EstudioConsultaTurno {
  id_estudio: number;
  nombre_estudio: string;
  descripcion_estudio: string;
  precio_estudio: number;
}

export interface ConsultaTurno {
  id_consulta: number;
  diagnostico: string;
  tratamiento: string;
  peso: number;
  observaciones?: string;
  estudios?: EstudioConsultaTurno[];
  turno: Turno;
}