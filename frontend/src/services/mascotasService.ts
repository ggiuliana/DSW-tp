import { api } from "../utils/apiReutilizable.js";
import type { Mascota } from "../types";
import type { MascotaFormData } from "../types";

export const obtenerMascotas = (idDuenio: string) => 
    api<Mascota[]>(`/mascota/duenio/${idDuenio}`)

export const crearMascota = (idDuenio: string, data: MascotaFormData) => 
    api<Mascota>(`/mascota/duenio/${idDuenio}`, {
        method: "POST",
        body: JSON.stringify(data),
});

export const actualizarMascota = (idMascota: number, data: MascotaFormData) => 
    api<Mascota>(`/mascota/${idMascota}`, {
        method: "PUT",
        body: JSON.stringify(data),
});

export const actualizarVacunas = (idMascota: number, vacunas: { id_tipo_vacuna: number; fecha_aplicacion: string }[]) => 
    api<Mascota>(`/mascota/${idMascota}`, {
        method: "PATCH",
        body: JSON.stringify({ vacunas }),
});

export const borrarMascota = (idMascota: number) => 
    api<void>(`/mascota/${idMascota}`, {
        method: "DELETE",
});