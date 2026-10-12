import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Duenio, DuenioFormData, PasswordFormData, UsuarioDuenio } from "../types";
import { actualizarContraseniaDuenio, actualizarPerfilDuenio, eliminarCuentaDuenio, obtenerPerfilDuenio } from "../services/perfilDuenioService";

function leerUsuarioDuenio(): UsuarioDuenio | null {
    try {
        const usuarioGuardado = localStorage.getItem("usuario");
        return usuarioGuardado ? JSON.parse(usuarioGuardado) as UsuarioDuenio : null;
    } catch {
        return null;
    }
}

function validarSesionPerfil() {
    if (!localStorage.getItem("idPersona")) return "No se encontró el dueño de la sesión";
    if (!localStorage.getItem("token")) return "La sesión expiró. Inicia sesión nuevamente.";
    return "";
}

export const usePerfilDuenio = () => {
    const [cargando, setCargando] = useState(() => !validarSesionPerfil());
    const [duenio, setDuenio] = useState<Duenio | null>(null);
    const [usuario] = useState<UsuarioDuenio | null>(leerUsuarioDuenio);
    const [error, setError] = useState(validarSesionPerfil);
    const navigate = useNavigate();

    useEffect(() => {
        let activo = true;
        const idDuenio = localStorage.getItem("idPersona");
        const token = localStorage.getItem("token");

        if (!idDuenio || !token) {
            return () => { activo = false; };
        }

        obtenerPerfilDuenio(idDuenio)
            .then((perfil) => { if (activo) setDuenio(perfil); })
            .catch((err: unknown) => {
                if (activo) setError(err instanceof Error ? err.message : "No se pudo cargar la información.");
            })
            .finally(() => { if (activo) setCargando(false); });

        return () => { activo = false; };
    }, []);

    const actualizarDatos = async (data: DuenioFormData) => {
        const idDuenio = localStorage.getItem("idPersona");
        if (!idDuenio || !localStorage.getItem("token")) {
            setError(!idDuenio
                ? "No se encontró el dueño de la sesión"
                : "La sesión expiró. Inicia sesión nuevamente.");
            return false;
        }

        setError("");
        try {
            setDuenio(await actualizarPerfilDuenio(idDuenio, data));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "No se pudo actualizar la información.");
            return false;
        }
    };

    const eliminarCuenta = async () => {
        const token = localStorage.getItem("token");
        if (!token || !usuario?.id_usuario) {
            setError("No se encontró la sesión del usuario");
            return;
        }

        setError("");
        try {
            await eliminarCuentaDuenio(usuario.id_usuario);
            ["token", "usuario", "nombrePersona", "idPersona"].forEach((key) => localStorage.removeItem(key));
            navigate("/");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "No se pudo eliminar la cuenta.");
        }
    };

    const actualizarContrasenia = async (data: PasswordFormData) => {
        const token = localStorage.getItem("token");
        if (!token || !usuario?.id_usuario) {
            setError("No se encontró la sesión del usuario");
            return false;
        }

        setError("");
        try {
            await actualizarContraseniaDuenio(usuario.id_usuario, {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.");
            return false;
        }
    };

    return { cargando, duenio, usuario, error, actualizarDatos, eliminarCuenta, actualizarContrasenia };
};