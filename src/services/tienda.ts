// Reglas de negocio de la compra: precios, cupón, totales y confirmar pedido.
import type { Producto } from "../types/Producto";
import type { LineaCarrito, ItemCarrito } from "../types/Carrito";
import type { Pedido } from "../types/Pedido";
import type { Usuario } from "../types/Usuario";
import { cupones } from "../data/cupones";
import { obtenerPedidos, guardarPedidos, obtenerProductos, guardarProductos } from "./storage";

// Si el producto tiene oferta se cobra el precio de oferta.
export function precioFinal(producto: Producto): number {
  return producto.precioOferta ?? producto.precio;
}

// Escribe el precio con punto de miles: 14990 -> "$14.990".
export function formatearPrecio(valor: number): string {
  return "$" + String(Math.round(valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Calcula subtotal, descuento y total. El cupón es opcional.
export function calcularTotales(lineas: LineaCarrito[], codigoCupon: string | null) {
  const subtotal = lineas.reduce((suma, l) => suma + precioFinal(l.producto) * l.cantidad, 0);
  const porcentaje = codigoCupon ? (cupones[codigoCupon] ?? 0) : 0;
  const descuento = Math.round(subtotal * porcentaje);
  return { subtotal, descuento, total: subtotal - descuento };
}

// Resultado de confirmar una compra: o hay un error, o hay un pedido.
export interface ResultadoCompra {
  error?: string;
  pedido?: Pedido;
}

// Confirma la compra:
// 1) revisa que haya stock suficiente, 2) descuenta el stock,
// 3) guarda el pedido. (Vaciar el carrito lo hace quien llama.)
export function confirmarCompra(
  items: ItemCarrito[],
  usuario: Usuario,
  codigoCupon: string | null,
): ResultadoCompra {
  if (items.length === 0) return { error: "El carrito está vacío." };

  const productos = obtenerProductos();
  const lineas: LineaCarrito[] = [];

  for (const item of items) {
    const producto = productos.find((p) => p.id === item.productoId);
    if (!producto) return { error: "Un producto del carrito ya no existe." };
    if (item.cantidad > producto.stock) {
      return { error: "No hay stock suficiente de \"" + producto.nombre + "\" (quedan " + producto.stock + ")." };
    }
    lineas.push({ producto, cantidad: item.cantidad });
  }

  // Descontar stock y guardar.
  const productosActualizados = productos.map((p) => {
    const linea = lineas.find((l) => l.producto.id === p.id);
    return linea ? { ...p, stock: p.stock - linea.cantidad } : p;
  });
  guardarProductos(productosActualizados);

  const { subtotal, descuento, total } = calcularTotales(lineas, codigoCupon);
  const pedido: Pedido = {
    id: Date.now(),
    fecha: new Date().toLocaleString("es-CL"),
    usuarioId: usuario.id,
    correo: usuario.correo,
    direccion: usuario.direccion,
    lineas: lineas.map((l) => ({
      productoId: l.producto.id,
      nombre: l.producto.nombre,
      precioUnitario: precioFinal(l.producto),
      cantidad: l.cantidad,
    })),
    subtotal,
    descuento,
    total,
    cupon: codigoCupon ?? undefined,
  };
  guardarPedidos([...obtenerPedidos(), pedido]);

  return { pedido };
}
