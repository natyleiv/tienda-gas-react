// Llamadas a la API de usuarios. Casi todas son solo para el ADMINISTRADOR;
// actualizarMiPerfil la puede usar cualquier usuario con sesión.
import { api } from "../api/axiosConfig";
import type { DatosUsuario, Usuario } from "../types/Usuario";

// Si la contraseña viene vacía no se envía: el backend mantiene la actual.
const preparar = (datos: DatosUsuario) => ({ ...datos, password: datos.password || undefined });

export const obtenerUsuarios = async () => {
  const respuesta = await api.get<Usuario[]>("/usuarios");
  return respuesta.data;
};

export const crearUsuario = async (datos: DatosUsuario) => {
  const respuesta = await api.post<Usuario>("/usuarios", preparar(datos));
  return respuesta.data;
};

export const actualizarUsuario = async (id: number, datos: DatosUsuario) => {
  const respuesta = await api.put<Usuario>("/usuarios/" + id, preparar(datos));
  return respuesta.data;
};

export const eliminarUsuario = async (id: number) => {
  await api.delete("/usuarios/" + id);
};

export const desbloquearUsuario = async (id: number) => {
  const respuesta = await api.patch<Usuario>("/usuarios/" + id + "/desbloquear");
  return respuesta.data;
};

export const actualizarMiPerfil = async (datos: DatosUsuario) => {
  const respuesta = await api.put<Usuario>("/usuarios/me", preparar(datos));
  return respuesta.data;
};
