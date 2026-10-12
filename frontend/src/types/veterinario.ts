export interface MascotaVeterinario {
  id_mascota: number;
  nombre_mascota: string;
  especie: string;
}

export interface TurnoVeterinario {
  id_turno: number;
  fecha_turno: string;
  hora_turno: string;
  estado_turno: string;
  observaciones_turno?: string;
  mascota?: MascotaVeterinario;
  veterinario?: { id_persona: number };
}

export interface EstudioVeterinario {
  id_estudio: number;
  nombre_estudio: string;
  descripcion_estudio: string;
  precio_estudio: number;
}

export interface ConsultaVeterinario {
  id_consulta: number;
  diagnostico: string;
  tratamiento: string;
  peso: number;
  observaciones?: string;
  turno: TurnoVeterinario;
  estudios?: EstudioVeterinario[];
}

export interface Veterinario {
  id_persona: number;
  nombre: string;
  apellido: string;
  telefono: string;
  mail: string;
  dni: string;
  direccion: string;
  matricula: string;
  especialidad: string;
}

export interface UsuarioVeterinario {
  id_usuario: number;
  nombre_usuario: string;
}

export interface ConsultaForm {
  diagnostico: string;
  tratamiento: string;
  peso: number;
  observaciones: string;
  id_estudios: number[];
}

export interface PasswordVeterinarioForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}