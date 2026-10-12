import { useEffect, useState } from "react";
import type { TipoVacuna } from "../types/tipovacuna.js";
import type { TipoVacunaForm } from "../types/admin.js";
import { actualizarTipoVacuna, crearTipoVacuna, eliminarTipoVacuna, obtenerTiposVacuna } from "../services/adminService.js";

const formularioVacio: TipoVacunaForm = {
  nombre_tipo_vacuna: "",
  descripcion_tipo_vacuna: "",
};

export const useGestionTiposVacuna = () => {
  const [tipos, setTipos] = useState<TipoVacuna[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoEnEdicion, setTipoEnEdicion] = useState<TipoVacuna | null>(null);
  const [formData, setFormData] = useState<TipoVacunaForm>(formularioVacio);

  useEffect(() => {
    let activo = true;
    obtenerTiposVacuna()
      .then((data) => { if (activo) setTipos(data); })
      .catch((err: unknown) => {
        if (activo) setError(err instanceof Error ? err.message : "Error al cargar los tipos de vacuna.");
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const abrirModal = (tipo?: TipoVacuna) => {
    setTipoEnEdicion(tipo ?? null);
    setFormData(tipo
      ? { nombre_tipo_vacuna: tipo.nombre_tipo_vacuna, descripcion_tipo_vacuna: tipo.descripcion_tipo_vacuna }
      : formularioVacio);
    setError("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTipoEnEdicion(null);
    setFormData(formularioVacio);
    setError("");
  };

  const guardarTipo = async () => {
    setGuardando(true);
    setError("");
    try {
      const tipoGuardado = tipoEnEdicion
        ? await actualizarTipoVacuna(tipoEnEdicion.id_tipo_vacuna, formData)
        : await crearTipoVacuna(formData);
      setTipos((actuales) => tipoEnEdicion
        ? actuales.map((tipo) => tipo.id_tipo_vacuna === tipoEnEdicion.id_tipo_vacuna ? tipoGuardado : tipo)
        : [...actuales, tipoGuardado]);
      cerrarModal();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar el tipo de vacuna.");
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const borrarTipo = async (id: number) => {
    setError("");
    try {
      await eliminarTipoVacuna(id);
      setTipos((actuales) => actuales.filter((tipo) => tipo.id_tipo_vacuna !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar el tipo de vacuna.");
    }
  };

  return { tipos, cargando, guardando, error, modalAbierto, tipoEnEdicion, formData, setFormData, abrirModal, cerrarModal, guardarTipo, borrarTipo };
};