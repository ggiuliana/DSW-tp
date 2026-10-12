export interface Duenio {
    id_persona: number
    nombre: string
    apellido: string
    telefono: string
    mail: string
    dni: string
    direccion: string
}

export interface UsuarioDuenio {
    id_usuario: number
    nombre_usuario: string
    contrasenia: string
    estado: string
    fechaAlta: Date
    persona: Duenio
}