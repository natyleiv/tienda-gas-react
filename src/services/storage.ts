// LocalStorage ahora SOLO guarda el carrito (antes de comprar).
// Productos, usuarios, categorías, compras y consultas viven en la base de datos MySQL
// y se piden al backend con Axios (ver carpeta services).
import type { ItemCarrito } from "../types/Carrito";

const CLAVE_CARRITO = "tiendaGas.carrito";

export function obtenerCarrito(): ItemCarrito[] {
  const texto = localStorage.getItem(CLAVE_CARRITO);
  return texto ? (JSON.parse(texto) as ItemCarrito[]) : [];
}

export function guardarCarrito(lista: ItemCarrito[]) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(lista));
}
