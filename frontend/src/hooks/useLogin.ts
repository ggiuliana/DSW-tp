import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginFormData } from "../types/auth.js";
import { iniciarSesion as iniciarSesionService } from "../services/authService.js";

function obtenerRolDelToken(token: string): string | undefined {
  try {
    const payloadCodificado = token.split(".")[1];
    if (!payloadCodificado) return undefined;
    const payload = JSON.parse(atob(payloadCodificado.replace(/-/g, "+").replace(/_/g, "/"))) as { rol?: unknown };
    return typeof payload.rol === "string" ? payload.rol : undefined;
  } catch {
    return undefined;
  }
}

export const useLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const iniciarSesion = async (data: LoginFormData) => {
    setError("");
    try {
      const resultado = await iniciarSesionService(data);
      const { token, usuario } = resultado;
      const rol = usuario.grupo?.nombre_grupo ?? obtenerRolDelToken(token);
      const rutasPorRol: Record<string, string> = {
        Duenio: "/duenio",
        Veterinario: "/veterinario",
        Administrador: "/administrador",
      };
      const ruta = rutasPorRol[rol ?? ""];
      if (!ruta) {
        setError(`No se reconoce el rol de esta cuenta: ${rol ?? "sin rol"}.`);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("nombrePersona", usuario.persona?.nombre ?? "");
      if (usuario.persona?.id_persona !== undefined) {
        localStorage.setItem("idPersona", String(usuario.persona.id_persona));
      }
      navigate(ruta);
    } catch (err: unknown) {
      setError(err instanceof Error
        ? err.message
        : "No se pudo conectar con el backend. Confirma que esté activo e inténtalo de nuevo.");
    }
  };

  return { error, iniciarSesion };
};