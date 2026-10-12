import { api } from "../utils/apiReutilizable.js";
import type { Turno, MascotaTurno } from "../types"; 

export const obtenerTurnosDuenio = () => api<Turno[]>("/turno/duenio");

export const obtenerMascotasDuenio = (idPersona: string) => api<MascotaTurno[]>(`/mascota/duenio/${idPersona}`);

export const otorgarTurno = (idTurno: number, idMascota: number) => 
    api<Turno>(`/turno/${idTurno}/otorgar`, {
        method: "PATCH",
        body: JSON.stringify({ id_mascota: idMascota }),
});