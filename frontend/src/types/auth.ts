export interface LoginFormData {
  nombre_usuario: string;
  contrasenia: string;
}

export interface UsuarioAutenticado {
  nombre_usuario: string;
  grupo?: { nombre_grupo: string };
  persona?: { nombre: string; id_persona?: number };
}

export interface LoginResult {
  token: string;
  usuario: UsuarioAutenticado;
}

export interface RegisterFormData {
  nombre: string;
  apellido: string;
  telefono: string;
  mail: string;
  dni: string;
  direccion: string;
  nombre_usuario: string;
  contrasenia: string;
  confirmarContrasenia: string;
}

export type RegisterPayload = Omit<RegisterFormData, "confirmarContrasenia">;

export interface RegisterFieldError {
  field: "mail" | "nombre_usuario";
  message: string;
}