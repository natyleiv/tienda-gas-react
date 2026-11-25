// Funciones de apoyo de la tienda: precios, formato y totales del carrito.
// (Confirmar la compra ahora lo hace el backend: ver boletaService.ts)
import type { Producto } from "../types/Producto";
import type { LineaCarrito } from "../types/Carrito";
import { cupones } from "../data/cupones";

// Si el producto tiene oferta se cobra el precio de oferta.
export function precioFinal(producto: Producto): number {
  return producto.precioOferta ?? producto.precio;
}

// Escribe el precio con punto de miles: 14990 -> "$14.990".
export function formatearPrecio(valor: number): string {
  return "$" + String(Math.round(valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Calcula subtotal, descuento y total para MOSTRAR en el carrito.
// El total real lo vuelve a calcular el backend al comprar.
export function calcularTotales(lineas: LineaCarrito[], codigoCupon: string | null) {
  const subtotal = lineas.reduce((suma, l) => suma + precioFinal(l.producto) * l.cantidad, 0);
  const porcentaje = codigoCupon ? (cupones[codigoCupon] ?? 0) : 0;
  const descuento = Math.round(subtotal * porcentaje);
  return { subtotal, descuento, total: subtotal - descuento };
}
