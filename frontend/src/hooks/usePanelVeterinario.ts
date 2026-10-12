import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ConsultaForm, ConsultaVeterinario, TurnoVeterinario } from "../types/veterinario.js";
import {
  borrarTurnoVeterinario,
  crearTurnoDisponible as crearTurnoDisponibleService,
  guardarConsultaVeterinario,
  obtenerConsultasVeterinario,
  obtenerTurnosVeterinario,
} from "../services/veterinarioService.js";

export const usePanelVeterinario = () => {
  const [idVeterinario] = useState(() => Number(localStorage.getItem("idPersona")) || 0);
  const [nombre] = useState(() => localStorage.getItem("nombrePersona") || "Profesional");
  const [turnos, setTurnos] = useState<TurnoVeterinario[]>([]);
  const [consultas, setConsultas] = useState<ConsultaVeterinario[]>([]);
  const [cargando, setCargando] = useState(Boolean(idVeterinario));
  const [error, setError] = useState(idVeterinario ? "" : "No se encontró el perfil asociado a esta sesión.");
  const navigate = useNavigate();

  useEffect(() => {
    if (!idVeterinario) return;

    let activo = true;
    Promise.all([obtenerTurnosVeterinario(), obtenerConsultasVeterinario()])
      .then(([todosLosTurnos, todasLasConsultas]) => {
        if (!activo) return;
        const propios = todosLosTurnos
          .filter((turno) => turno.veterinario?.id_persona === idVeterinario)
          .sort((a, b) => `${a.fecha_turno}T${a.hora_turno}`.localeCompare(`${b.fecha_turno}T${b.hora_turno}`));
        const idsTurno = new Set(propios.map((turno) => turno.id_turno));
        setTurnos(propios);
        setConsultas(todasLasConsultas.filter((consulta) => idsTurno.has(consulta.turno?.id_turno)));
      })
      .catch((err: unknown) => {
        if (activo) setError(err instanceof Error ? err.message : "No se pudieron cargar los datos.");
      })
      .finally(() => { if (activo) setCargando(false); });

    return () => { activo = false; };
  }, [idVeterinario]);

  const cerrarSesion = () => {
    ["token", "usuario", "nombrePersona", "idPersona"].forEach((key) => localStorage.removeItem(key));
    navigate("/");
  };

  const crearTurnoDisponible = async (fecha: string, hora: string) => {
    setError("");
    try {
      const turno = await crearTurnoDisponibleService(fecha, hora, idVeterinario);
      setTurnos((actuales) => [...actuales, turno].sort((a, b) => `${a.fecha_turno}T${a.hora_turno}`.localeCompare(`${b.fecha_turno}T${b.hora_turno}`)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo crear el turno disponible.");
      throw err;
    }
  };

  const borrarTurnoDisponible = async (turno: TurnoVeterinario) => {
    setError("");
    try {
      await borrarTurnoVeterinario(turno.id_turno);
      setTurnos((actuales) => actuales.filter((item) => item.id_turno !== turno.id_turno));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo borrar el turno disponible.");
    }
  };

  const guardarConsulta = async (
    idTurno: number,
    data: ConsultaForm,
    consultaExistente: ConsultaVeterinario | null,
  ) => {
    const resultado = await guardarConsultaVeterinario(idTurno, data, consultaExistente?.id_consulta);
    const fallback: ConsultaVeterinario = {
      ...data,
      peso: Number(data.peso),
      id_consulta: consultaExistente?.id_consulta ?? 0,
      turno: turnos.find((turno) => turno.id_turno === idTurno)!,
    };
    const consultaGuardada = {
      ...fallback,
      ...(resultado ?? {}),
      turno: resultado?.turno ?? fallback.turno,
    };
    setConsultas((actuales) => {
      const existe = actuales.some((item) => item.id_consulta === consultaGuardada.id_consulta);
      return existe
        ? actuales.map((item) => item.id_consulta === consultaGuardada.id_consulta ? consultaGuardada : item)
        : [...actuales, consultaGuardada];
    });
    return consultaGuardada;
  };

  return { nombre, turnos, consultas, cargando, error, cerrarSesion, crearTurnoDisponible, borrarTurnoDisponible, guardarConsulta };
};