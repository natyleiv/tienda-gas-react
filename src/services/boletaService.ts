// Llamadas a la API de boletas (compras).
import { api } from "../api/axiosConfig";
import type { ItemCarrito } from "../types/Carrito";
import type { Boleta, EstadoBoleta } from "../types/Boleta";

// Confirma la compra. El backend revisa el stock, lo descuenta y guarda la boleta
// en una sola transacción (si algo falla, no se guarda nada).
export const comprar = async (items: ItemCarrito[], cupon: string | null) => {
  const respuesta = await api.post<Boleta>("/boletas", { items, cupon });
  return respuesta.data;
};

// Historial del usuario con sesión (cada cliente ve solo sus compras).
export const obtenerMisBoletas = async () => {
  const respuesta = await api.get<Boleta[]>("/boletas/mis-boletas");
  return respuesta.data;
};

// Detalle de una compra. Si es de otro cliente, el backend responde 403.
export const obtenerBoleta = async (id: number) => {
  const respuesta = await api.get<Boleta>("/boletas/" + id);
  return respuesta.data;
};

// Todas las órdenes (solo ADMINISTRADOR y VENDEDOR).
export const obtenerBoletas = async () => {
  const respuesta = await api.get<Boleta[]>("/boletas");
  return respuesta.data;
};

// Cambia el estado de una orden (solo ADMINISTRADOR).
export const cambiarEstado = async (id: number, estado: EstadoBoleta) => {
  const respuesta = await api.patch<Boleta>("/boletas/" + id + "/estado", { estado });
  return respuesta.data;
};
