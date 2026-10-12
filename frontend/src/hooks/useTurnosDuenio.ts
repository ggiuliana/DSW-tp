import { useState, useEffect, useMemo } from 'react';
import type { Turno, MascotaTurno } from '../types';
import { obtenerTurnosDuenio, obtenerMascotasDuenio, otorgarTurno } from '../services/turnosService';

export const useTurnosDuenio = () => {
    const [mascotas, setMascotas] = useState<MascotaTurno[]>([]);
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [mascotaPorTurno, setMascotaPorTurno] = useState<Record<number, string>>({});
    const [cargando, setCargando] = useState(true);
    const [turnoEnProceso, setTurnoEnProceso] = useState<number | null>(null);
    const [error, setError] = useState("");

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
                const [turnosCargados, mascotasCargadas] = await Promise.all([
                    obtenerTurnosDuenio(),
                    obtenerMascotasDuenio(idPersona),
                ]);
                
                if (!activo) return;
                setTurnos(turnosCargados);
                setMascotas(mascotasCargadas);
                
                const seleccionesIniciales = Object.fromEntries(
                    turnosCargados.map((turno) => [turno.id_turno, String(mascotasCargadas[0]?.id_mascota ?? "")])
                );
                setMascotaPorTurno(seleccionesIniciales);
            } catch (err) {
                if (activo) setError(err instanceof Error ? err.message : "No se pudieron cargar los turnos.");
            } finally {
                if (activo) setCargando(false);
            }
        };
        
        void cargar();
        return () => { activo = false; };
    }, []);

    const sacarTurno = async (turno: Turno) => {
        const idMascota = mascotaPorTurno[turno.id_turno];
        if (!idMascota) return setError("Selecciona una mascota para sacar el turno.");
        
        setError("");
        setTurnoEnProceso(turno.id_turno);
        try {
            await otorgarTurno(turno.id_turno, Number(idMascota));
            
            const turnosActualizados = await obtenerTurnosDuenio();
            setTurnos(turnosActualizados);
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo sacar el turno.");
        } finally {
            setTurnoEnProceso(null);
        }
    };

    const pendientes = useMemo(() => turnos
        .filter((t) => t.estado_turno.toLowerCase() === "pendiente" && !t.mascota)
        .sort((a, b) => `${a.fecha_turno}T${a.hora_turno}`.localeCompare(`${b.fecha_turno}T${b.hora_turno}`)), 
    [turnos]);

    const propios = useMemo(() => turnos
        .filter((t) => mascotas.some((m) => m.id_mascota === t.mascota?.id_mascota))
        .sort((a, b) => `${a.fecha_turno}T${a.hora_turno}`.localeCompare(`${b.fecha_turno}T${b.hora_turno}`)), 
    [turnos, mascotas]);

    const cambiarMascotaSeleccionada = (idTurno: number, idMascota: string) => {
        setMascotaPorTurno(prev => ({ ...prev, [idTurno]: idMascota }));
    };

    return {
        mascotas, pendientes, propios, cargando, error,
        mascotaPorTurno, cambiarMascotaSeleccionada,
        sacarTurno, turnoEnProceso
    };
};