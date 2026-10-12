import { useState, useEffect } from 'react';
import type { Mascota, TipoVacuna, MascotaFormData, VacunaFormulario } from '../types';
import { obtenerMascotas } from '../services/mascotasService';
import { obtenerTiposVacunas } from '../services/vacunasService';
import { crearMascota, actualizarMascota, actualizarVacunas, borrarMascota } from '../services/mascotasService';

export const useMascotasDatos = (mostrarFormulario: boolean, pasoFormulario: number) => {
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [tiposVacuna, setTiposVacuna] = useState<TipoVacuna[]>([]);
    const [cargando, setCargando] = useState(true);
    const [cargandoTipos, setCargandoTipos] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const idDuenio = localStorage.getItem("idPersona");
        if (!idDuenio) {
            setError("No se encontró el dueño de la sesión");
            setCargando(false);
            return;
        }

        obtenerMascotas(idDuenio)
            .then(setMascotas)
            .catch((err: Error) => setError(err.message))
            .finally(() => setCargando(false));
    }, []);

    useEffect(() => {
        if (!mostrarFormulario || pasoFormulario !== 2) return;

        let cancelado = false;
        setCargandoTipos(true);

        obtenerTiposVacunas()
            .then((data) => { if (!cancelado) setTiposVacuna(data); })
            .catch((err: Error) => { if (!cancelado) setError(err.message); })
            .finally(() => { if (!cancelado) setCargandoTipos(false); });

        return () => { cancelado = true; };
    }, [mostrarFormulario, pasoFormulario]);

    const guardarDatosMascota = async (
        data: MascotaFormData, 
        mascotaEnEdicion: Mascota | null, 
        onSuccess: (mascota: Mascota) => void
    ) => {
        try {
            const idDuenio = localStorage.getItem("idPersona");
            if (!idDuenio) return setError("No se encontró el dueño");

            const payload = { ...data, fechaNac: `${data.fechaNac} 00:00:00` };
            let mascotaGuardada: Mascota;

            if (mascotaEnEdicion) {
                mascotaGuardada = await actualizarMascota(mascotaEnEdicion.id_mascota, payload);
                setMascotas(prev => prev.map(m => m.id_mascota === mascotaGuardada.id_mascota ? mascotaGuardada : m));
            } else {
                mascotaGuardada = await crearMascota(idDuenio, payload);
                setMascotas(prev => [...prev, mascotaGuardada]);
            }

            setError("");
            onSuccess(mascotaGuardada);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const guardarVacunas = async (
        mascotaParaVacunas: Mascota, 
        vacunasFormulario: VacunaFormulario[], 
        onSuccess: () => void
    ) => {
        try {
            const incompleta = vacunasFormulario.some(v => Boolean(v.id_tipo_vacuna) !== Boolean(v.fecha_aplicacion));
            if (incompleta) {
                return setError("Completa el tipo y la fecha de cada vacuna o elimina la fila vacía.");
            }

            const vacunasFiltradas = vacunasFormulario
                .filter(v => v.id_tipo_vacuna && v.fecha_aplicacion)
                .map(v => ({ id_tipo_vacuna: Number(v.id_tipo_vacuna), fecha_aplicacion: v.fecha_aplicacion }));

            await actualizarVacunas(mascotaParaVacunas.id_mascota, vacunasFiltradas);

            const mascotaActualizada: Mascota = {
                ...mascotaParaVacunas,
                vacunas: vacunasFiltradas.map((vacuna) => ({
                    tipo_vacuna: tiposVacuna.find(t => t.id_tipo_vacuna === vacuna.id_tipo_vacuna)!,
                    fecha_aplicacion: vacuna.fecha_aplicacion,
                })),
            };
            
            setMascotas(prev => prev.map(m => m.id_mascota === mascotaActualizada.id_mascota ? mascotaActualizada : m));
            setError("");
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const eliminarMascota = async (mascotaAEliminar: Mascota | null, onSuccess: () => void) => {
        if (!mascotaAEliminar) return;
        try {
            await borrarMascota(mascotaAEliminar.id_mascota);
            setMascotas((prev) => prev.filter((m) => m.id_mascota !== mascotaAEliminar.id_mascota));
            setError("");
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return { 
        mascotas, tiposVacuna, cargando, cargandoTipos, error, setError,
        guardarDatosMascota, guardarVacunas, eliminarMascota
    };
};