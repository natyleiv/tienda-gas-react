// Reglas de validación reutilizadas por los formularios.
import type { DatosUsuario, Usuario } from "../types/Usuario";

export const DOMINIOS_GENERALES = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];
export const DOMINIOS_REGISTRO = ["duoc.cl"];
const EDAD_MINIMA = 14;

// Calcula la edad a partir de una fecha "AAAA-MM-DD".
export function calcularEdad(fecha: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fecha + "T00:00:00");
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  // Si todavía no ha cumplido años este año, se resta 1.
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

// Valida el RUN con el dígito verificador (algoritmo módulo 11).
export function validarRun(run: string): boolean {
  const limpio = run.replace(/[.\-\s]/g, "").toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  // Se multiplica cada dígito (de derecha a izquierda) por 2,3,4,5,6,7,2,3...
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === esperado;
}

// Correo con formato válido, máximo 100 caracteres y dominio permitido.
export function validarCorreo(correo: string, dominios: string[]): boolean {
  if (correo.length > 100) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return false;
  const dominio = correo.split("@")[1].toLowerCase();
  return dominios.includes(dominio);
}

// Contraseña de 4 a 10 caracteres.
export function validarPassword(password: string): boolean {
  return password.length >= 4 && password.length <= 10;
}

// Un objeto con un mensaje de error opcional por cada campo del usuario.
export type ErroresUsuario = Partial<Record<keyof DatosUsuario, string>>;

// Valida todos los campos de un usuario. Devuelve los errores encontrados
// (si el objeto vuelve vacío, el formulario está correcto).
// idActual sirve al editar: permite que el usuario conserve su propio correo/RUN.
export function validarUsuario(
  datos: DatosUsuario,
  usuarios: Usuario[],
  dominios: string[],
  idActual?: number,
): ErroresUsuario {
  const errores: ErroresUsuario = {};
  const otros = usuarios.filter((u) => u.id !== idActual);

  if (!validarRun(datos.run)) {
    errores.run = "RUN inválido (ej: 12345678-5).";
  } else if (otros.some((u) => u.run === datos.run)) {
    errores.run = "Ese RUN ya está registrado.";
  }

  if (!datos.nombre.trim()) errores.nombre = "El nombre es obligatorio.";
  if (!datos.apellidos.trim()) errores.apellidos = "Los apellidos son obligatorios.";

  if (!validarCorreo(datos.correo, dominios)) {
    errores.correo = "Correo inválido. Dominios permitidos: " + dominios.join(", ");
  } else if (otros.some((u) => u.correo === datos.correo)) {
    errores.correo = "Ese correo ya está registrado.";
  }

  if (!validarPassword(datos.password)) {
    errores.password = "La contraseña debe tener entre 4 y 10 caracteres.";
  }

  if (!datos.fechaNacimiento) {
    errores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
  } else if (calcularEdad(datos.fechaNacimiento) < EDAD_MINIMA) {
    errores.fechaNacimiento = "Debes tener al menos " + EDAD_MINIMA + " años.";
  }

  if (!datos.region) errores.region = "Selecciona una región.";
  if (!datos.direccion.trim()) errores.direccion = "La dirección es obligatoria.";

  return errores;
}
