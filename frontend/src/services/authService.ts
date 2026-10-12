import type { LoginFormData, LoginResult, RegisterPayload } from "../types/auth.js";
import { api } from "../utils/apiReutilizable.js";

export const iniciarSesion = (data: LoginFormData) =>
  api<LoginResult>("/usuario/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const registrarCuenta = (data: RegisterPayload) =>
  api<unknown>("/usuario/registro", {
    method: "POST",
    body: JSON.stringify(data),
  });