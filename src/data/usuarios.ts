import type { Usuario } from "../types/Usuario";

// Usuarios iniciales para poder probar los tres roles.
// (Las contraseñas se guardan tal cual: es una simulación académica.)
export const usuariosIniciales: Usuario[] = [
  { id: 1, run: "12345678-5", nombre: "Marcela", apellidos: "Soto", correo: "admin@duoc.cl", password: "admin123", fechaNacimiento: "1985-04-12", region: "Ñuble", direccion: "Camino a Confluencia 450, Chillán", rol: "administrador", intentosFallidos: 0, bloqueado: false },
  { id: 2, run: "11111111-1", nombre: "Pedro", apellidos: "Rojas", correo: "vendedor@duoc.cl", password: "vende123", fechaNacimiento: "1992-09-30", region: "Ñuble", direccion: "Av. Collín 1200, Chillán", rol: "vendedor", intentosFallidos: 0, bloqueado: false },
  { id: 3, run: "18765432-7", nombre: "Camila", apellidos: "Fuentes", correo: "cliente@duoc.cl", password: "cliente123", fechaNacimiento: "2000-01-15", region: "Biobío", direccion: "Calle Los Aromos 321, Concepción", rol: "cliente", intentosFallidos: 0, bloqueado: false },
];
