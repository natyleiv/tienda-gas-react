// Llamadas a la API de autenticación (/auth).
import { api } from "../api/axiosConfig";
import type { DatosUsuario, RespuestaAuth, Usuario } from "../types/Usuario";

export const login = async (correo: string, password: string) => {
  const respuesta = await api.post<RespuestaAuth>("/auth/login", { correo, password });
  return respuesta.data;
};

// El registro público siempre crea un CLIENTE (lo decide el backend).
export const registrar = async (datos: DatosUsuario) => {
  const respuesta = await api.post<Usuario>("/auth/register", datos);
  return respuesta.data;
};

// Datos del usuario dueño del token.
export const obtenerUsuarioActual = async () => {
  const respuesta = await api.get<Usuario>("/auth/me");
  return respuesta.data;
};
