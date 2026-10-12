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