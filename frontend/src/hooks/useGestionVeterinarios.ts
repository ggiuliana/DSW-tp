import { useEffect, useState } from "react";
import type { VeterinarioAdmin, VeterinarioAdminForm } from "../types/admin.js";
import { actualizarVeterinarioAdmin, crearVeterinarioAdmin, eliminarVeterinarioAdmin, obtenerVeterinariosAdmin } from "../services/adminService.js";

const formularioVacio: VeterinarioAdminForm = {
  nombre: "",
  apellido: "",
  telefono: "",
  mail: "",
  dni: "",
  direccion: "",
  matricula: "",
  especialidad: "",
};

export const useGestionVeterinarios = () => {
  const [veterinarios, setVeterinarios] = useState<VeterinarioAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [veterinarioEnEdicion, setVeterinarioEnEdicion] = useState<VeterinarioAdmin | null>(null);
  const [formData, setFormData] = useState<VeterinarioAdminForm>(formularioVacio);

  useEffect(() => {
    let activo = true;
    obtenerVeterinariosAdmin()
      .then((data) => { if (activo) setVeterinarios(data); })
      .catch((err: unknown) => {
        if (activo) setError(err instanceof Error ? err.message : "Error al cargar veterinarios.");
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const abrirModal = (veterinario?: VeterinarioAdmin) => {
    setVeterinarioEnEdicion(veterinario ?? null);
    if (veterinario) {
      setFormData({
        nombre: veterinario.nombre,
        apellido: veterinario.apellido,
        telefono: veterinario.telefono,
        mail: veterinario.mail,
        dni: veterinario.dni,
        direccion: veterinario.direccion,
        matricula: veterinario.matricula,
        especialidad: veterinario.especialidad,
      });
    } else {
      setFormData(formularioVacio);
    }
    setError("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setVeterinarioEnEdicion(null);
    setFormData(formularioVacio);
  };

  const actualizarCampo = (campo: keyof VeterinarioAdminForm, valor: string) => {
    setFormData((actual) => ({ ...actual, [campo]: valor }));
  };

  const guardarVeterinario = async () => {
    setGuardando(true);
    setError("");
    try {
      const veterinarioGuardado = veterinarioEnEdicion?.id_persona
        ? await actualizarVeterinarioAdmin(veterinarioEnEdicion.id_persona, formData)
        : await crearVeterinarioAdmin(formData);
      setVeterinarios((actuales) => veterinarioEnEdicion?.id_persona
        ? actuales.map((veterinario) => veterinario.id_persona === veterinarioGuardado.id_persona ? veterinarioGuardado : veterinario)
        : [...actuales, veterinarioGuardado]);
      cerrarModal();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar el veterinario.");
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const borrarVeterinario = async (id?: number) => {
    if (!id) return;
    setError("");
    try {
      await eliminarVeterinarioAdmin(id);
      setVeterinarios((actuales) => actuales.filter((veterinario) => veterinario.id_persona !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar veterinario.");
    }
  };

  return { veterinarios, cargando, guardando, error, modalAbierto, veterinarioEnEdicion, formData, abrirModal, cerrarModal, actualizarCampo, guardarVeterinario, borrarVeterinario };
};