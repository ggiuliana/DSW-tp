import type { TipoVacuna } from "../types";
import { api } from "../utils/apiReutilizable"

export const obtenerTiposVacunas = () => api<TipoVacuna[]>(`/tipo_vacuna`)