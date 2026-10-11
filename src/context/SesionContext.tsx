// Contexto de sesión. Funciona igual que el PerfilContext visto en clases:
// guarda "quién es el usuario actual" y lo deja disponible en toda la aplicación.
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../types/Usuario";
import { obtenerUsuarios, guardarUsuarios, obtenerIdSesion, guardarIdSesion } from "../services/storage";

const MAX_INTENTOS = 3;

interface SesionContextType {
  usuario: Usuario | null;
  // Devuelve un mensaje de error, o null si el inicio de sesión fue correcto.
  iniciarSesion: (correo: string, password: string) => string | null;
  cerrarSesion: () => void;
  // Vuelve a leer al usuario desde LocalStorage (se usa tras editar el perfil).
  actualizarSesion: () => void;
}

const SesionContext = createContext<SesionContextType | null>(null);

// Busca en LocalStorage al usuario cuya sesión está guardada.
function leerUsuarioDeSesion(): Usuario | null {
  const id = obtenerIdSesion();
  if (id === null) return null;
  return obtenerUsuarios().find((u) => u.id === id) ?? null;
}

export const SesionProvider = ({ children }: { children: ReactNode }) => {
  // Se pasa la función (sin paréntesis) para que se ejecute solo la primera vez.
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioDeSesion);

  const iniciarSesion = (correo: string, password: string): string | null => {
    const usuarios = obtenerUsuarios();
    const encontrado = usuarios.find((u) => u.correo === correo);

    if (!encontrado) return "Correo o contraseña incorrectos.";
    if (encontrado.bloqueado) return "La cuenta está bloqueada por 3 intentos fallidos. Contacta a un administrador.";

    if (encontrado.password !== password) {
      // Contraseña mala: se suma un intento y, al llegar a 3, se bloquea.
      const intentos = encontrado.intentosFallidos + 1;
      const bloqueado = intentos >= MAX_INTENTOS;
      guardarUsuarios(
        usuarios.map((u) => (u.id === encontrado.id ? { ...u, intentosFallidos: intentos, bloqueado } : u)),
      );
      return bloqueado
        ? "Cuenta bloqueada por 3 intentos fallidos."
        : "Correo o contraseña incorrectos. Intentos restantes: " + (MAX_INTENTOS - intentos);
    }

    // Contraseña correcta: se reinician los intentos y se guarda la sesión.
    const sinIntentos = { ...encontrado, intentosFallidos: 0 };
    guardarUsuarios(usuarios.map((u) => (u.id === encontrado.id ? sinIntentos : u)));
    guardarIdSesion(encontrado.id);
    setUsuario(sinIntentos);
    return null;
  };

  const cerrarSesion = () => {
    guardarIdSesion(null);
    setUsuario(null);
  };

  const actualizarSesion = () => setUsuario(leerUsuarioDeSesion());

  return (
    <SesionContext value={{ usuario, iniciarSesion, cerrarSesion, actualizarSesion }}>
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
