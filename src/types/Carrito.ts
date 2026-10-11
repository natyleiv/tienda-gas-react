import type { Producto } from "./Producto";

// Lo que se guarda del carrito: solo el id del producto y cuántas unidades.
export interface ItemCarrito {
  productoId: number;
  cantidad: number;
}

// Una línea lista para mostrar en pantalla: el producto completo + la cantidad.
export interface LineaCarrito {
  producto: Producto;
  cantidad: number;
}
