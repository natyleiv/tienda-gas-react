// Contexto de sesión (como el PerfilContext visto en clases): guarda quién es el
// usuario actual y lo deja disponible en toda la aplicación.
// Ahora el inicio de sesión lo valida el backend, que devuelve un token JWT.
// El token y el usuario se guardan en LocalStorage para que la sesión
// siga activa al recargar la página.
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../types/Usuario";
import { login, obtenerUsuarioActual } from "../services/authService";
import { guardarTokens, guardarUsuario, leerToken, leerUsuarioGuardado, borrarSesion } from "../services/sesion";
import { mensajeError } from "../api/axiosConfig";

interface SesionContextType {
  usuario: Usuario | null;
  sesionExpirada: boolean; // true si el backend cerró la sesión por token vencido
  // Devuelve un mensaje de error, o null si el inicio de sesión fue correcto.
  iniciarSesion: (correo: string, password: string) => Promise<string | null>;
  cerrarSesion: () => void;
  // Reemplaza los datos del usuario (se usa después de editar el perfil).
  actualizarUsuario: (usuario: Usuario) => void;
}

const SesionContext = createContext<SesionContextType | null>(null);

export const SesionProvider = ({ children }: { children: ReactNode }) => {
  // Al cargar la página se recupera la sesión guardada (si existe).
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioGuardado);
  const [sesionExpirada, setSesionExpirada] = useState(false);

  useEffect(() => {
    // Si había sesión guardada, se piden los datos actualizados al backend.
    // Si el token ya venció, axiosConfig intenta renovarlo automáticamente.
    const revisarSesion = async () => {
      if (!leerToken()) return;
      try {
        const actual = await obtenerUsuarioActual();
        guardarUsuario(actual);
        setUsuario(actual);
      } catch {
        // Si falla, el evento "sesion-expirada" se encarga de cerrar la sesión.
      }
    };
    revisarSesion();

    // axiosConfig lanza este evento cuando no pudo renovar el token.
    const alExpirar = () => {
      setUsuario(null);
      setSesionExpirada(true);
    };
    window.addEventListener("sesion-expirada", alExpirar);
    return () => window.removeEventListener("sesion-expirada", alExpirar);
  }, []);

  const iniciarSesion = async (correo: string, password: string): Promise<string | null> => {
    try {
      // El backend revisa la contraseña, los intentos fallidos y el bloqueo.
      const respuesta = await login(correo, password);
      guardarTokens(respuesta.token, respuesta.refreshToken);
      guardarUsuario(respuesta.usuario);
      setUsuario(respuesta.usuario);
      setSesionExpirada(false);
      return null;
    } catch (error) {
      return mensajeError(error);
    }
  };

  const cerrarSesion = () => {
    borrarSesion();
    setUsuario(null);
  };

  const actualizarUsuario = (nuevo: Usuario) => {
    guardarUsuario(nuevo);
    setUsuario(nuevo);
  };

  return (
    <SesionContext value={{ usuario, sesionExpirada, iniciarSesion, cerrarSesion, actualizarUsuario }}>
      {children}
    </SesionContext>
  );
};

// Hook para usar la sesión desde cualquier componente (como usePerfil en clases).
export const useSesion = () => {
  const contexto = useContext(SesionContext);
  if (contexto === null) {
    throw new Error("useSesion requiere SesionProvider");
  }
  return contexto;
};
