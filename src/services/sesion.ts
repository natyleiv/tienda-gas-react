// Guarda la sesión en LocalStorage para que no se pierda al recargar la página.
// Ya NO se guardan usuarios ni productos aquí: eso ahora vive en la base de datos (backend).
import type { Usuario } from "../types/Usuario";

const CLAVE_TOKEN = "tiendaGas.token";
const CLAVE_REFRESH = "tiendaGas.refreshToken";
const CLAVE_USUARIO = "tiendaGas.usuario";

export const leerToken = () => localStorage.getItem(CLAVE_TOKEN);
export const leerRefreshToken = () => localStorage.getItem(CLAVE_REFRESH);

export function leerUsuarioGuardado(): Usuario | null {
  const texto = localStorage.getItem(CLAVE_USUARIO);
  return texto ? (JSON.parse(texto) as Usuario) : null;
}

// Se llama al iniciar sesión y cada vez que se renueva el token.
export function guardarTokens(token: string, refreshToken: string) {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_REFRESH, refreshToken);
}

export function guardarUsuario(usuario: Usuario) {
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

// Cerrar sesión: se borra todo lo relacionado con la sesión.
export function borrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_REFRESH);
  localStorage.removeItem(CLAVE_USUARIO);
}
