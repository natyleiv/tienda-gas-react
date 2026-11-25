// Llamadas a la API de boletas (compras).
import { api } from "../api/axiosConfig";
import type { ItemCarrito } from "../types/Carrito";
import type { Boleta } from "../types/Boleta";

// Confirma la compra. El backend revisa el stock, lo descuenta y guarda la boleta
// en una sola transacción (si algo falla, no se guarda nada).
export const comprar = async (items: ItemCarrito[], cupon: string | null) => {
  const respuesta = await api.post<Boleta>("/boletas", { items, cupon });
  return respuesta.data;
};
