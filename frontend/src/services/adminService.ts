import type { TipoVacuna } from "../types/tipovacuna.js";
import type { TipoVacunaForm, VeterinarioAdmin, VeterinarioAdminForm } from "../types/admin.js";
import { api } from "../utils/apiReutilizable.js";

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