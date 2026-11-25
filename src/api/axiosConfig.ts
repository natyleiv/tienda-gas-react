// Configuración de Axios (igual que en clases: axios.create con la URL base).
// Además tiene dos "interceptores":
//  1) Antes de cada petición agrega el token JWT en el header Authorization.
//  2) Si el backend responde 401 (token vencido), pide un token nuevo con el
//     refreshToken y repite la petición. Si no se puede renovar, cierra la sesión.
import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { leerToken, leerRefreshToken, guardarTokens, borrarSesion } from "../services/sesion";

export const API_URL = "http://localhost:8080/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 1) Token en cada petición (si hay sesión).
api.interceptors.request.use((config) => {
  const token = leerToken();
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// Petición original + una marca para no reintentarla dos veces.
type PeticionReintentable = InternalAxiosRequestConfig & { _reintento?: boolean };

// Si llegan varias respuestas 401 a la vez, se renueva el token una sola vez.
let renovando: Promise<string> | null = null;

async function renovarToken(): Promise<string> {
  const refreshToken = leerRefreshToken();
  if (!refreshToken) throw new Error("Sin refreshToken");
  // Se usa axios "normal" (no api) para no pasar otra vez por estos interceptores.
  const respuesta = await axios.post(API_URL + "/auth/refresh", { refreshToken });
  guardarTokens(respuesta.data.token, respuesta.data.refreshToken);
  return respuesta.data.token;
}

// 2) Manejo del token vencido.
api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error: AxiosError) => {
    const peticion = error.config as PeticionReintentable | undefined;
    const esAuth = peticion?.url?.startsWith("/auth/login") || peticion?.url?.startsWith("/auth/refresh");

    if (error.response?.status === 401 && peticion && !peticion._reintento && !esAuth && leerToken()) {
      peticion._reintento = true;
      try {
        renovando = renovando ?? renovarToken();
        const nuevoToken = await renovando;
        peticion.headers.Authorization = "Bearer " + nuevoToken;
      } catch {
        // No se pudo renovar: la sesión terminó. Se avisa a SesionContext.
        borrarSesion();
        window.dispatchEvent(new Event("sesion-expirada"));
        delete peticion.headers.Authorization; // las páginas públicas siguen funcionando
      } finally {
        renovando = null;
      }
      return api(peticion);
    }
    return Promise.reject(error);
  },
);

// Convierte un error de Axios en un texto para mostrar en pantalla.
// El backend responde { estado, mensaje, errores } (ver ManejadorErrores.java).
export function mensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "No se pudo conectar con el servidor. Revisa que el backend esté encendido.";
    }
    const datos = error.response.data as { mensaje?: string; errores?: Record<string, string> } | undefined;
    if (datos?.errores && Object.keys(datos.errores).length > 0) {
      return Object.values(datos.errores).join(" ");
    }
    if (datos?.mensaje) return datos.mensaje;
    if (error.response.status === 403) return "No tienes permiso para realizar esta acción.";
  }
  return "Ocurrió un error inesperado.";
}
