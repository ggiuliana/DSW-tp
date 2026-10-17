import { useEffect, useState, useMemo } from "react";
import { obtenerTurnosAdmin, obtenerVeterinariosAdmin } from "../services/adminService.js";
import type { TurnoAdmin } from "../services/adminService.js";
import type { VeterinarioAdmin } from "../types/admin.js";

export const useTurnosAdministrador = () => {
  const [turnos, setTurnos] = useState<TurnoAdmin[]>([]);
  const [veterinarios, setVeterinarios] = useState<VeterinarioAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [filtroVet, setFiltroVet] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  useEffect(() => {
    let activo = true;

    Promise.all([obtenerTurnosAdmin(), obtenerVeterinariosAdmin()])
      .then(([dataTurnos, dataVets]) => {
        if (activo) {
          setTurnos(
            Array.isArray(dataTurnos)
              ? dataTurnos
              : ((dataTurnos as { data?: TurnoAdmin[] }).data ?? [])
          );
          setVeterinarios(
            Array.isArray(dataVets)
              ? dataVets
              : (dataVets as { data?: VeterinarioAdmin[] }).data ?? []
          );
        }
      })
      .catch((err: unknown) => {
        if (activo) setError(err instanceof Error ? err.message : "Error al cargar los datos.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => { activo = false; };
  }, []);

  const turnosFiltrados = useMemo(() => {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    return turnos.filter((turno) => {

      if (filtroVet && turno.veterinario?.id_persona?.toString() !== filtroVet) return false;
      
      if (filtroEstado && turno.estado_turno !== filtroEstado) return false;

      const fechaTurno = new Date(turno.fecha_turno);
      fechaTurno.setHours(0, 0, 0, 0);

      if (fechaDesde || fechaHasta) {
        if (fechaDesde) {
          const desde = new Date(fechaDesde + "T00:00:00");
          desde.setHours(0, 0, 0, 0);
          if (fechaTurno < desde) return false;
        }
        if (fechaHasta) {
          const hasta = new Date(fechaHasta + "T00:00:00");
          hasta.setHours(0, 0, 0, 0);
          if (fechaTurno > hasta) return false;
        }
      } else {
        if (fechaTurno.getMonth() !== mesActual || fechaTurno.getFullYear() !== anioActual) return false;
      }

      return true;
    }).sort((a, b) => new Date(a.fecha_turno).getTime() - new Date(b.fecha_turno).getTime());
  }, [turnos, filtroVet, filtroEstado, fechaDesde, fechaHasta]);

  const limpiarFiltros = () => {
    setFiltroVet("");
    setFiltroEstado("");
    setFechaDesde("");
    setFechaHasta("");
  };

  return {
    turnosFiltrados,
    veterinarios,
    cargando,
    error,
    filtroVet, setFiltroVet,
    filtroEstado, setFiltroEstado,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    limpiarFiltros
  };
};