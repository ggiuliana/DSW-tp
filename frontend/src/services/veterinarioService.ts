import type {
  ConsultaForm,
  ConsultaVeterinario,
  EstudioVeterinario,
  PasswordVeterinarioForm,
  TurnoVeterinario,
  Veterinario,
} from "../types/veterinario.js";
import { api } from "../utils/apiReutilizable.js";

export const findTurnosByVeterinarioAndFecha = (idVet: number, fechaInicio: string, fechaFin: string) => {
  const params = new URLSearchParams({ fechaInicio, fechaFin });
  return api<TurnoVeterinario[]>(`/turno/veterinario/${idVet}/fecha?${params.toString()}`);
};

export const obtenerTurnosVeterinario = (idVet: number) =>
  api<TurnoVeterinario[]>(`/turno/veterinario/${idVet}`);

export const obtenerConsultasVeterinario = () => api<ConsultaVeterinario[]>("/consulta");

export const obtenerEstudiosVeterinario = () => api<EstudioVeterinario[]>("/estudio");

export const crearTurnoDisponible = (fecha_turno: string, hora_turno: string, id_veterinario: number) =>
  api<TurnoVeterinario>("/turno", {
    method: "POST",
    body: JSON.stringify({ fecha_turno, hora_turno, estado_turno: "Pendiente", id_veterinario }),
  });

export const borrarTurnoVeterinario = (idTurno: number) =>
  api<void>(`/turno/${idTurno}`, { method: "DELETE" });

export const guardarConsultaVeterinario = (
  idTurno: number,
  data: ConsultaForm,
  idConsulta?: number,
) => api<ConsultaVeterinario>(idConsulta ? `/consulta/${idConsulta}` : "/consulta", {
  method: idConsulta ? "PUT" : "POST",
  body: JSON.stringify({ ...data, peso: Number(data.peso), id_turno: idTurno }),
});

export const obtenerPerfilVeterinario = (idPersona: string) =>
  api<Veterinario>(`/veterinario/${idPersona}`);

export const actualizarContraseniaVeterinario = (
  idUsuario: number,
  data: Pick<PasswordVeterinarioForm, "currentPassword" | "newPassword">
) => api<void>(`/usuario/cuenta/${idUsuario}/contrasenia`, {
  method: "PATCH",
  body: JSON.stringify(data),
});