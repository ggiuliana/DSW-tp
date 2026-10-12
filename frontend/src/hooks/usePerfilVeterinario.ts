import { useEffect, useState } from "react";
import type { PasswordVeterinarioForm, UsuarioVeterinario, Veterinario } from "../types/veterinario.js";
import { actualizarContraseniaVeterinario, obtenerPerfilVeterinario } from "../services/veterinarioService.js";

function leerUsuarioVeterinario(): UsuarioVeterinario | null {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "null") as UsuarioVeterinario | null;
  } catch {
    return null;
  }
}

export const usePerfilVeterinario = () => {
  const [idPersona] = useState(() => localStorage.getItem("idPersona") || "");
  const [perfil, setPerfil] = useState<Veterinario | null>(null);
  const [cargando, setCargando] = useState(Boolean(idPersona));
  const [error, setError] = useState(idPersona ? "" : "No se encontró el perfil asociado a esta sesión.");
  const [mensaje, setMensaje] = useState("");
  const [usuario] = useState<UsuarioVeterinario | null>(leerUsuarioVeterinario);

  useEffect(() => {
    if (!idPersona) return;
    let activo = true;
    obtenerPerfilVeterinario(idPersona)
      .then((datos) => { if (activo) setPerfil(datos); })
      .catch((err: unknown) => {
        if (activo) setError(err instanceof Error ? err.message : "No se pudo cargar el perfil.");
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [idPersona]);

  const cambiarContrasenia = async (data: PasswordVeterinarioForm) => {
    setError("");
    setMensaje("");
    if (!localStorage.getItem("token") || !usuario?.id_usuario) {
      setError("No se encontró la sesión del usuario.");
      return false;
    }

    try {
      await actualizarContraseniaVeterinario(usuario.id_usuario, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setMensaje("La contraseña se actualizó correctamente.");
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.");
      return false;
    }
  };

  const limpiarMensajes = () => {
    setError("");
    setMensaje("");
  };

  return { perfil, cargando, error, mensaje, usuario, cambiarContrasenia, limpiarMensajes };
};