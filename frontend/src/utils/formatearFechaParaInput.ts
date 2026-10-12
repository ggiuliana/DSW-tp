import type { Mascota } from "../types/mascota.js"

export function formatearFechaParaInput(fechaNac: Mascota["fechaNac"]) {
    const fechaTexto = String(fechaNac).trim();
    const fechaISO = fechaTexto.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (fechaISO) return fechaISO;

    const fechaLatina = fechaTexto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (fechaLatina) return `${fechaLatina[3]}-${fechaLatina[2]}-${fechaLatina[1]}`;

    const fecha = new Date(fechaNac);
    if (Number.isNaN(fecha.getTime())) return "";
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}