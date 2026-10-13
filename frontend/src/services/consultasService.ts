import type { ConsultaTurno } from "../types/turno.js";
import { api } from "../utils/apiReutilizable.js";

export const obtenerConsultasDuenio = () => api<ConsultaTurno[]>("/consulta/duenio");