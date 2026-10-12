import type { Veterinario } from "./veterinario.js";

export interface TipoVacunaForm {
  nombre_tipo_vacuna: string;
  descripcion_tipo_vacuna: string;
}

export interface EstudioForm {
  nombre_estudio: string;
  descripcion_estudio: string;
  precio_estudio: number;
}

export type VeterinarioAdmin = Omit<Veterinario, "id_persona"> & {
  id_persona?: number;
};

export type VeterinarioAdminForm = Omit<VeterinarioAdmin, "id_persona">;