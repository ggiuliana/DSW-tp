import { useEffect, useState } from "react";
import type { Estudio } from "../types/estudio.js";
import type { EstudioForm } from "../types/admin.js";
import { 
  actualizarEstudio, 
  crearEstudio, 
  eliminarEstudio, 
  obtenerEstudios 
} from "../services/adminService.js";

const formularioVacio: EstudioForm = {
  nombre_estudio: "",
  descripcion_estudio: "",
  precio_estudio: 0,
};

export const useEstudios = () => {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estudioEnEdicion, setEstudioEnEdicion] = useState<Estudio | null>(null);
  const [formData, setFormData] = useState<EstudioForm>(formularioVacio);

  useEffect(() => {
    let activo = true;
    obtenerEstudios()
      .then((data) => { 
        if (activo) {
          const arr = Array.isArray(data)
            ? data
            : Array.isArray((data as { data?: Estudio[] } | undefined)?.data)
              ? (data as { data: Estudio[] }).data
              : [];
          setEstudios(arr);
        }
      })
      .catch((err: unknown) => {
        if (activo) setError(err instanceof Error ? err.message : "Error al cargar los estudios.");
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const abrirModal = (estudio?: Estudio) => {
    setEstudioEnEdicion(estudio ?? null);
    setFormData(estudio
      ? { 
          nombre_estudio: estudio.nombre_estudio, 
          descripcion_estudio: estudio.descripcion_estudio,
          precio_estudio: estudio.precio_estudio
        }
      : formularioVacio);
    setError("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEstudioEnEdicion(null);
    setFormData(formularioVacio);
    setError("");
  };

  const guardarEstudio = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      const respuesta = estudioEnEdicion
        ? await actualizarEstudio(estudioEnEdicion.id_estudio, formData)
        : await crearEstudio(formData);
      
      const estudioGuardado = (respuesta as { data?: Estudio }).data ?? respuesta;

      setEstudios((actuales) => estudioEnEdicion
        ? actuales.map((estudio) => estudio.id_estudio === estudioEnEdicion.id_estudio ? estudioGuardado : estudio)
        : [...actuales, estudioGuardado]);
      
      cerrarModal();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar el estudio.");
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const borrarEstudio = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este estudio?")) return;
    setError("");
    try {
      await eliminarEstudio(id);
      setEstudios((actuales) => actuales.filter((estudio) => estudio.id_estudio !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar el estudio.");
    }
  };

  return { estudios, cargando, guardando, error, modalAbierto, formData, setFormData, abrirModal, cerrarModal, guardarEstudio, borrarEstudio };
};