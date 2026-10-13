import { useState, useEffect, useMemo } from 'react';
import type { ConsultaTurno, Turno, MascotaTurno } from '../types';
import type { Veterinario } from '../types/veterinario.js';
import { obtenerTurnosDuenio, obtenerMascotasDuenio, obtenerVeterinariosParaTurno, obtenerDisponibilidadVeterinario, otorgarTurno } from '../services/turnosService';
import { obtenerConsultasDuenio } from '../services/consultasService.js';

function fechaLocal(fecha: Date) {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

export const useTurnosDuenio = (cargarOpcionesReserva = true) => {
    const [mascotas, setMascotas] = useState<MascotaTurno[]>([]);
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [consultas, setConsultas] = useState<ConsultaTurno[]>([]);
    const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [cargandoDisponibilidad, setCargandoDisponibilidad] = useState(false);
    const [reservando, setReservando] = useState(false);
    const [error, setError] = useState("");
    const [confirmacion, setConfirmacion] = useState("");
    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
    const [veterinarioSeleccionado, setVeterinarioSeleccionado] = useState<number | null>(null);
    const [turnosDisponibles, setTurnosDisponibles] = useState<Turno[]>([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(() => fechaLocal(new Date()));
    const [mesVisible, setMesVisible] = useState(() => {
        const hoy = new Date();
        return { anio: hoy.getFullYear(), mes: hoy.getMonth() };
    });
    const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(null);
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
    const [calendarioAbierto, setCalendarioAbierto] = useState(true);

    useEffect(() => {
        let activo = true;
        const cargar = async () => {
            const idPersona = localStorage.getItem("idPersona");
            if (!idPersona) {
                setError("No se encontró el perfil asociado a esta sesión.");
                setCargando(false);
                return;
            }

            try {
                const [turnosCargados, mascotasCargadas, veterinariosCargados, consultasCargadas] = await Promise.all([
                    obtenerTurnosDuenio(),
                    obtenerMascotasDuenio(idPersona),
                    cargarOpcionesReserva ? obtenerVeterinariosParaTurno() : Promise.resolve([]),
                    obtenerConsultasDuenio(),
                ]);
                
                if (!activo) return;
                setTurnos(turnosCargados);
                setMascotas(mascotasCargadas);
                setVeterinarios(veterinariosCargados);
                setConsultas(consultasCargadas);
            } catch (err) {
                if (activo) setError(err instanceof Error ? err.message : "No se pudieron cargar los turnos.");
            } finally {
                if (activo) setCargando(false);
            }
        };
        
        void cargar();
        return () => { activo = false; };
    }, [cargarOpcionesReserva]);

    useEffect(() => {
        if (!veterinarioSeleccionado) return;

        let activo = true;
        const desde = fechaLocal(new Date(mesVisible.anio, mesVisible.mes, 1));
        const hasta = fechaLocal(new Date(mesVisible.anio, mesVisible.mes + 1, 0));
        obtenerDisponibilidadVeterinario(veterinarioSeleccionado, desde, hasta)
            .then((disponibles) => { if (activo) setTurnosDisponibles(disponibles); })
            .catch((err) => { if (activo) setError(err instanceof Error ? err.message : "No se pudo cargar la disponibilidad."); })
            .finally(() => { if (activo) setCargandoDisponibilidad(false); });

        return () => { activo = false; };
    }, [mesVisible.anio, mesVisible.mes, veterinarioSeleccionado]);

    const especialidades = useMemo(
        () => [...new Set(veterinarios.map((veterinario) => veterinario.especialidad.trim()).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b, 'es')),
        [veterinarios],
    );
    const veterinariosEspecialidad = useMemo(
        () => veterinarios.filter((veterinario) => veterinario.especialidad === especialidadSeleccionada),
        [especialidadSeleccionada, veterinarios],
    );
    const diasDisponibles = useMemo(
        () => new Set(turnosDisponibles.map((turno) => turno.fecha_turno.slice(0, 10))),
        [turnosDisponibles],
    );
    const turnosDiaSeleccionado = useMemo(() => turnosDisponibles
        .filter((turno) => turno.fecha_turno.slice(0, 10) === fechaSeleccionada && !turno.mascota)
        .sort((a, b) => a.hora_turno.localeCompare(b.hora_turno)),
    [fechaSeleccionada, turnosDisponibles]);
    const propios = useMemo(() => turnos
        .filter((turno) => mascotas.some((mascota) => mascota.id_mascota === turno.mascota?.id_mascota))
        .sort((a, b) => `${a.fecha_turno}T${a.hora_turno}`.localeCompare(`${b.fecha_turno}T${b.hora_turno}`)),
    [turnos, mascotas]);

    const ahora = new Date();
    const fechaHoy = fechaLocal(ahora);
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const fechaHoraActual = `${fechaHoy}T${horaActual}`;
    const turnosConfirmados = propios.filter((turno) => turno.estado_turno.toLowerCase() === 'confirmado');
    const turnosProximos = turnosConfirmados
        .filter((turno) => `${turno.fecha_turno.slice(0, 10)}T${turno.hora_turno.slice(0, 5)}` >= fechaHoraActual)
        .sort((a, b) => `${a.fecha_turno}T${a.hora_turno}`.localeCompare(`${b.fecha_turno}T${b.hora_turno}`));
    const consultasPorTurno = new Map(consultas.map((consulta) => [consulta.turno.id_turno, consulta]));
    const consultasPasadas = turnosConfirmados
        .filter((turno) => `${turno.fecha_turno.slice(0, 10)}T${turno.hora_turno.slice(0, 5)}` < fechaHoraActual)
        .flatMap((turno) => {
            const consulta = consultasPorTurno.get(turno.id_turno);
            return consulta ? [{ turno, consulta }] : [];
        })
        .sort((a, b) => `${b.turno.fecha_turno}T${b.turno.hora_turno}`.localeCompare(`${a.turno.fecha_turno}T${a.turno.hora_turno}`));
    const turnoMasProximo = turnosProximos[0] ?? null;
    const restoTurnosProximos = turnosProximos.slice(1);
    const diasHastaProximo = turnoMasProximo
        ? Math.round((Date.parse(`${turnoMasProximo.fecha_turno.slice(0, 10)}T00:00:00`) - Date.parse(`${fechaHoy}T00:00:00`)) / 86_400_000)
        : null;

    const cambiarEspecialidad = (especialidad: string) => {
        setEspecialidadSeleccionada(especialidad);
        setVeterinarioSeleccionado(null);
        setTurnosDisponibles([]);
        setError("");
        setConfirmacion("");
    };

    const cambiarVeterinario = (id: string) => {
        setVeterinarioSeleccionado(id ? Number(id) : null);
        setTurnosDisponibles([]);
        setCargandoDisponibilidad(Boolean(id));
        setError("");
        setFechaSeleccionada(fechaLocal(new Date()));
    };

    const cambiarMes = (desplazamiento: number) => {
        const nuevoMes = new Date(mesVisible.anio, mesVisible.mes + desplazamiento, 1);
        setTurnosDisponibles([]);
        setCargandoDisponibilidad(Boolean(veterinarioSeleccionado));
        setMesVisible({ anio: nuevoMes.getFullYear(), mes: nuevoMes.getMonth() });
        setFechaSeleccionada(fechaLocal(nuevoMes));
    };

    const seleccionarFecha = (fecha: string) => setFechaSeleccionada(fecha);

    const abrirConfirmacionTurno = (turno: Turno) => {
        setTurnoSeleccionado(turno);
        setMascotaSeleccionada("");
        setError("");
    };

    const cerrarConfirmacionTurno = () => {
        setTurnoSeleccionado(null);
        setMascotaSeleccionada("");
    };

    const confirmarTurno = async () => {
        if (!turnoSeleccionado || !mascotaSeleccionada) {
            setError("Selecciona una mascota para confirmar el turno.");
            return;
        }
        setError("");
        setConfirmacion("");
        setReservando(true);
        try {
            await otorgarTurno(turnoSeleccionado.id_turno, Number(mascotaSeleccionada));
            const mascota = mascotas.find((item) => item.id_mascota === Number(mascotaSeleccionada));
            setTurnosDisponibles((actuales) => actuales.filter((turno) => turno.id_turno !== turnoSeleccionado.id_turno));
            setConfirmacion(`Turno confirmado para ${mascota?.nombre_mascota ?? "tu mascota"} el ${turnoSeleccionado.fecha_turno.slice(0, 10)} a las ${turnoSeleccionado.hora_turno.slice(0, 5)}.`);
            setCalendarioAbierto(false);
            cerrarConfirmacionTurno();
            void obtenerTurnosDuenio()
                .then(setTurnos)
                .catch((err) => setError(err instanceof Error ? err.message : "El turno se confirmó, pero no se pudo actualizar la lista."));
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo sacar el turno.");
        } finally {
            setReservando(false);
        }
    };

    const sacarOtroTurno = () => {
        setConfirmacion("");
        setEspecialidadSeleccionada("");
        setVeterinarioSeleccionado(null);
        setFechaSeleccionada(fechaLocal(new Date()));
        setTurnoSeleccionado(null);
        setCalendarioAbierto(true);
    };

    return {
        mascotas, propios, cargando, error, confirmacion, consultasPasadas,
        turnoMasProximo, restoTurnosProximos, diasHastaProximo,
        especialidades, especialidadSeleccionada, veterinariosEspecialidad, veterinarioSeleccionado,
        turnosDisponibles, diasDisponibles, fechaSeleccionada, mesVisible, turnosDiaSeleccionado,
        cargandoDisponibilidad, turnoSeleccionado, mascotaSeleccionada, reservando, calendarioAbierto,
        cambiarEspecialidad, cambiarVeterinario, cambiarMes, seleccionarFecha,
        abrirConfirmacionTurno, cerrarConfirmacionTurno, setMascotaSeleccionada, confirmarTurno, sacarOtroTurno,
    };
};