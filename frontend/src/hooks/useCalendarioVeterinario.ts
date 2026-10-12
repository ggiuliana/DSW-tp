import { useEffect, useMemo, useState } from "react";
import type { TurnoVeterinario } from "../types/veterinario.js";
import { findTurnosByVeterinarioAndFecha } from "../services/veterinarioService.js";

function fechaLocal(fecha: Date) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

function horaLocal(fecha: Date) {
  return `${String(fecha.getHours()).padStart(2, "0")}:${String(fecha.getMinutes()).padStart(2, "0")}`;
}

export const useCalendarioVeterinario = () => {
  const [idVeterinario] = useState(() => Number(localStorage.getItem("idPersona")) || 0);
  const [hoy] = useState(() => fechaLocal(new Date()));
  const [horaActual, setHoraActual] = useState(() => horaLocal(new Date()));
  const [mesVisible, setMesVisible] = useState(() => {
    const ahora = new Date();
    return { anio: ahora.getFullYear(), mes: ahora.getMonth() };
  });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);
  const [turnosHoySinFiltrar, setTurnosHoySinFiltrar] = useState<TurnoVeterinario[]>([]);
  const [turnosMes, setTurnosMes] = useState<TurnoVeterinario[]>([]);
  const [cargandoHoy, setCargandoHoy] = useState(Boolean(idVeterinario));
  const [cargandoMes, setCargandoMes] = useState(Boolean(idVeterinario));
  const [error, setError] = useState(idVeterinario ? "" : "No se encontró el perfil asociado a esta sesión.");

  useEffect(() => {
    const intervalo = window.setInterval(() => setHoraActual(horaLocal(new Date())), 30_000);
    return () => window.clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (!idVeterinario) return;
    let activo = true;
    findTurnosByVeterinarioAndFecha(idVeterinario, hoy, hoy)
      .then((turnos) => { if (activo) setTurnosHoySinFiltrar(turnos); })
      .catch((err: unknown) => {
        if (activo) setError(err instanceof Error ? err.message : "No se pudieron cargar los turnos de hoy.");
      })
      .finally(() => { if (activo) setCargandoHoy(false); });
    return () => { activo = false; };
  }, [hoy, idVeterinario]);

  useEffect(() => {
    if (!idVeterinario) return;
    let activo = true;
    const fechaInicio = fechaLocal(new Date(mesVisible.anio, mesVisible.mes, 1));
    const fechaFin = fechaLocal(new Date(mesVisible.anio, mesVisible.mes + 1, 0));
    findTurnosByVeterinarioAndFecha(idVeterinario, fechaInicio, fechaFin)
      .then((turnos) => { if (activo) setTurnosMes(turnos); })
      .catch((err: unknown) => {
        if (activo) setError(err instanceof Error ? err.message : "No se pudieron cargar los turnos del mes.");
      })
      .finally(() => { if (activo) setCargandoMes(false); });
    return () => { activo = false; };
  }, [idVeterinario, mesVisible.anio, mesVisible.mes]);

  const turnosHoy = useMemo(
    () => turnosHoySinFiltrar.filter((turno) => turno.hora_turno.slice(0, 5) >= horaActual),
    [horaActual, turnosHoySinFiltrar],
  );
  const turnosFechaSeleccionada = useMemo(
    () => turnosMes.filter((turno) => turno.fecha_turno.slice(0, 10) === fechaSeleccionada),
    [fechaSeleccionada, turnosMes],
  );
  const diasConTurnos = useMemo(
    () => new Set(turnosMes.map((turno) => turno.fecha_turno.slice(0, 10))),
    [turnosMes],
  );

  const seleccionarFecha = (fecha: string) => {
    setFechaSeleccionada(fecha);
    const [anio, mes] = fecha.split("-").map(Number);
    if (anio !== mesVisible.anio || mes - 1 !== mesVisible.mes) {
      setTurnosMes([]);
      setCargandoMes(true);
      setMesVisible({ anio, mes: mes - 1 });
    }
  };

  const cambiarMes = (desplazamiento: number) => {
    const nuevoMes = new Date(mesVisible.anio, mesVisible.mes + desplazamiento, 1);
    const fechaInicial = fechaLocal(nuevoMes);
    setTurnosMes([]);
    setCargandoMes(true);
    setMesVisible({ anio: nuevoMes.getFullYear(), mes: nuevoMes.getMonth() });
    setFechaSeleccionada(fechaInicial);
  };

  return {
    hoy,
    anio: mesVisible.anio,
    mes: mesVisible.mes,
    fechaSeleccionada,
    turnosHoy,
    turnosFechaSeleccionada,
    diasConTurnos,
    cargandoHoy,
    cargandoMes,
    error,
    seleccionarFecha,
    cambiarMes,
  };
};