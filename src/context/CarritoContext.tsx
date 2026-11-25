// Contexto del carrito: lo usan varios componentes que están lejos entre sí
// (el menú muestra la cantidad, las tarjetas agregan, la página Carrito modifica).
// El carrito se guarda en LocalStorage hasta que se confirma la compra.
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ItemCarrito } from "../types/Carrito";
import type { Producto } from "../types/Producto";
import { obtenerCarrito, guardarCarrito } from "../services/storage";

interface CarritoContextType {
  items: ItemCarrito[];
  cantidadTotal: number;
  // Las funciones devuelven un mensaje de error, o null si todo salió bien.
  // Reciben el producto (que viene de la API) para revisar su stock.
  agregar: (producto: Producto) => string | null;
  cambiarCantidad: (producto: Producto, cantidad: number) => string | null;
  quitar: (productoId: number) => void;
  vaciar: () => void;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ItemCarrito[]>(obtenerCarrito);

  // Actualiza el estado y también LocalStorage.
  const actualizar = (nuevos: ItemCarrito[]) => {
    setItems(nuevos);
    guardarCarrito(nuevos);
  };

  // Agrega 1 unidad respetando el stock disponible.
  const agregar = (producto: Producto): string | null => {
    if (producto.stock <= 0) return "\"" + producto.nombre + "\" no tiene stock.";

    const item = items.find((i) => i.productoId === producto.id);
    const cantidadActual = item ? item.cantidad : 0;
    if (cantidadActual + 1 > producto.stock) {
      return "Solo quedan " + producto.stock + " unidades de \"" + producto.nombre + "\".";
    }

    if (item) {
      actualizar(items.map((i) => (i.productoId === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i)));
    } else {
      actualizar([...items, { productoId: producto.id, cantidad: 1 }]);
    }
    return null;
  };

  // Cambia la cantidad de una línea (para los botones + y -).
  const cambiarCantidad = (producto: Producto, cantidad: number): string | null => {
    if (cantidad <= 0) {
      quitar(producto.id);
      return null;
    }
    if (cantidad > producto.stock) return "Solo quedan " + producto.stock + " unidades.";

    actualizar(items.map((i) => (i.productoId === producto.id ? { ...i, cantidad } : i)));
    return null;
  };

  const quitar = (productoId: number) => {
    actualizar(items.filter((i) => i.productoId !== productoId));
  };

  const vaciar = () => actualizar([]);

  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0);

  return (
    <CarritoContext value={{ items, cantidadTotal, agregar, cambiarCantidad, quitar, vaciar }}>
      {children}
    </CarritoContext>
  );
};

export const useCarrito = () => {
  const contexto = useContext(CarritoContext);
  if (contexto === null) {
    throw new Error("useCarrito requiere CarritoProvider");
  }
  return contexto;
};
