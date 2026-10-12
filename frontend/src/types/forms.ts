import type { Mascota } from "./mascota.js"
import type { Duenio } from "./duenio.js"

export interface VacunaFormulario {
    clave: number;
    id_tipo_vacuna: string;
    fecha_aplicacion: string;
}

export type MascotaFormData = Omit<Mascota, "id_mascota" | "fechaNac"> & {
    fechaNac: string;
};

export type DuenioFormData = Omit<Duenio, "id_persona">

export type PasswordFormData = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}