// Los tres roles posibles, escritos igual que en el backend (enum Rol de Java).
export type Rol = "ADMINISTRADOR" | "VENDEDOR" | "CLIENTE";

// Usuario tal como lo devuelve la API. La contraseña NUNCA viaja de vuelta al frontend.
export interface Usuario {
  id: number;
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  fechaNacimiento: string; // formato AAAA-MM-DD
  region: string;
  direccion: string;
  rol: Rol;
  intentosFallidos: number;
  bloqueado: boolean;
}

// Lo que se envía al crear o editar un usuario.
// Al editar, la contraseña puede ir vacía (se mantiene la actual).
export type DatosUsuario = Omit<Usuario, "id" | "intentosFallidos" | "bloqueado"> & {
  password: string;
};

// Respuesta de /auth/login y /auth/refresh.
export interface RespuestaAuth {
  token: string;
  refreshToken: string;
  tipo: string; // "Bearer"
  expiraEn: number; // segundos
  usuario: Usuario;
}
