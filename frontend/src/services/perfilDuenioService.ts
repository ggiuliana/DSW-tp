import type { Duenio, DuenioFormData, PasswordFormData } from "../types";
import { api } from "../utils/apiReutilizable";

export const obtenerPerfilDuenio = (idDuenio: string) => api<Duenio>(`/duenio/${idDuenio}`);

export const actualizarPerfilDuenio = (idDuenio: string, data: DuenioFormData) =>
    api<Duenio>(`/duenio/${idDuenio}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const eliminarCuentaDuenio = (idUsuario: number) =>
    api<void>(`/usuario/cuenta/${idUsuario}`, {
        method: "DELETE",
    });

export const actualizarContraseniaDuenio = (
    idUsuario: number,
    data: Pick<PasswordFormData, "currentPassword" | "newPassword">
) => api<void>(`/usuario/cuenta/${idUsuario}/contrasenia`, {
    method: "PATCH",
    body: JSON.stringify(data),
});