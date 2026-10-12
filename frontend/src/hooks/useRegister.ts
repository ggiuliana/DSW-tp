import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterFieldError, RegisterFormData, RegisterPayload } from "../types/auth.js";
import { registrarCuenta } from "../services/authService.js";

export const useRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const registrar = async (data: RegisterFormData): Promise<RegisterFieldError | null> => {
    setError("");
    const payload: RegisterPayload = {
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      mail: data.mail,
      dni: data.dni,
      direccion: data.direccion,
      nombre_usuario: data.nombre_usuario,
      contrasenia: data.contrasenia,
    };
    try {
      await registrarCuenta(payload);
      navigate("/login");
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo completar el registro.";
      const messageLower = message.toLowerCase();
      if (messageLower.includes("mail")) return { field: "mail", message };
      if (messageLower.includes("usuario")) return { field: "nombre_usuario", message };
      setError(message);
      return null;
    }
  };

  return { error, registrar };
};