import type { TipoVacuna } from "../types/tipovacuna.js";
import type { TipoVacunaForm, VeterinarioAdmin, VeterinarioAdminForm } from "../types/admin.js";
import { api } from "../utils/apiReutilizable.js";
import type { Estudio } from "../types/estudio.js";
import type { EstudioForm } from "../types/admin.js";

export const obtenerTiposVacuna = () => api<TipoVacuna[]>("/tipo_vacuna");

export const crearTipoVacuna = (data: TipoVacunaForm) =>
  api<TipoVacuna>("/tipo_vacuna", { method: "POST", body: JSON.stringify(data) });

export const actualizarTipoVacuna = (id: number, data: TipoVacunaForm) =>
  api<TipoVacuna>(`/tipo_vacuna/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const eliminarTipoVacuna = (id: number) =>
  api<void>(`/tipo_vacuna/${id}`, { method: "DELETE" });

export const obtenerVeterinariosAdmin = () => api<VeterinarioAdmin[]>("/veterinario");

export const crearVeterinarioAdmin = (data: VeterinarioAdminForm) =>
  api<VeterinarioAdmin>("/veterinario", { method: "POST", body: JSON.stringify(data) });

export const actualizarVeterinarioAdmin = (id: number, data: VeterinarioAdminForm) =>
  api<VeterinarioAdmin>(`/veterinario/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const eliminarVeterinarioAdmin = (id: number) =>
  api<void>(`/veterinario/${id}`, { method: "DELETE" });

export const obtenerEstudios = () => api<Estudio[]>("/estudio");

export const crearEstudio = (data: EstudioForm) =>
  api<Estudio>("/estudio", { method: "POST", body: JSON.stringify(data) });

export const actualizarEstudio = (id: number, data: EstudioForm) =>
  api<Estudio>(`/estudio/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const eliminarEstudio = (id: number) =>
  api<void>(`/estudio/${id}`, { method: "DELETE" });

export interface TurnoAdmin {
  id_turno: number;
  fecha_turno: string;
  hora_turno: string;
  estado_turno: string;
  observaciones_turno?: string;
  mascota?: {
    id_mascota: number;
    nombre_mascota: string;
  };
  veterinario: {
    id_persona: number;
    nombre: string;
    apellido: string;
  };
}

export const obtenerTurnosAdmin = () => api<TurnoAdmin[]>("/turno");