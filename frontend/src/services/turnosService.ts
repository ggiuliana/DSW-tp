import { api } from "../utils/apiReutilizable.js";
import type { Turno, MascotaTurno } from "../types"; 
import type { Veterinario } from "../types/veterinario.js";

export const obtenerTurnosDuenio = () => api<Turno[]>("/turno/duenio");

export const obtenerMascotasDuenio = (idPersona: string) => api<MascotaTurno[]>(`/mascota/duenio/${idPersona}`);

export const obtenerVeterinariosParaTurno = () => api<Veterinario[]>("/veterinario");

export const obtenerDisponibilidadVeterinario = (idVeterinario: number, fechaInicio: string, fechaFin: string) => {
    const parametros = new URLSearchParams({ fechaInicio, fechaFin });
    return api<Turno[]>(`/turno/veterinario/${idVeterinario}/disponibles/fecha?${parametros.toString()}`);
};

export const otorgarTurno = (idTurno: number, idMascota: number) => 
    api<Turno>(`/turno/${idTurno}/otorgar`, {
        method: "PATCH",
        body: JSON.stringify({ id_mascota: idMascota }),
});