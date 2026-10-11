// Los tres roles posibles. Es un "tipo unión": solo acepta estos tres textos.
export type Rol = "administrador" | "vendedor" | "cliente";

export interface Usuario {
  id: number;
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
  fechaNacimiento: string; // formato AAAA-MM-DD
  region: string;
  direccion: string;
  rol: Rol;
  intentosFallidos: number; // para el bloqueo a los 3 intentos
  bloqueado: boolean;
}

// Los datos que se piden en un formulario de usuario
// (todo menos el id y los datos de bloqueo).
export type DatosUsuario = Omit<Usuario, "id" | "intentosFallidos" | "bloqueado">;
