import { useState } from "react";
import type { ConsultaForm, ConsultaVeterinario, TurnoVeterinario } from "../types/veterinario.js";

type GuardarConsulta = (
  idTurno: number,
  data: ConsultaForm,
  consulta: ConsultaVeterinario | null,
) => Promise<ConsultaVeterinario>;

export const useConsultasVeterinario = (
  turnos: TurnoVeterinario[],
  onGuardar: GuardarConsulta,
) => {
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<number | null>(null);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<ConsultaVeterinario | null>(null);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const turnosConfirmados = turnos.filter((turno) => turno.estado_turno.toLowerCase() === "confirmado");

  const abrirFormulario = (turno: TurnoVeterinario, consulta?: ConsultaVeterinario) => {
    setTurnoSeleccionado(turno.id_turno);
    setConsultaSeleccionada(consulta ?? null);
    setError("");
  };

  const cerrarFormulario = () => {
    setTurnoSeleccionado(null);
    setConsultaSeleccionada(null);
  };

  const guardar = async (data: ConsultaForm) => {
    if (turnoSeleccionado === null) return false;
    setGuardando(true);
    setError("");
    try {
      await onGuardar(turnoSeleccionado, data, consultaSeleccionada);
      cerrarFormulario();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la consulta.");
      return false;
    } finally {
      setGuardando(false);
    }
  };

  return { turnoSeleccionado, consultaSeleccionada, turnosConfirmados, error, guardando, abrirFormulario, cerrarFormulario, guardar };
};