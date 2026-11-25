// Llamadas a la API de productos y categorías.
import { api } from "../api/axiosConfig";
import type { DatosProducto, Producto } from "../types/Producto";
import type { Categoria } from "../types/Categoria";

// ---- Productos ----
export const obtenerProductos = async () => {
  const respuesta = await api.get<Producto[]>("/productos");
  return respuesta.data;
};

export const obtenerProducto = async (id: number) => {
  const respuesta = await api.get<Producto>("/productos/" + id);
  return respuesta.data;
};

export const crearProducto = async (datos: DatosProducto) => {
  const respuesta = await api.post<Producto>("/productos", datos);
  return respuesta.data;
};

export const actualizarProducto = async (id: number, datos: DatosProducto) => {
  const respuesta = await api.put<Producto>("/productos/" + id, datos);
  return respuesta.data;
};

export const eliminarProducto = async (id: number) => {
  await api.delete("/productos/" + id);
};

// ---- Categorías ----
export const obtenerCategorias = async () => {
  const respuesta = await api.get<Categoria[]>("/categorias");
  return respuesta.data;
};

export const crearCategoria = async (nombre: string) => {
  const respuesta = await api.post<Categoria>("/categorias", { nombre });
  return respuesta.data;
};

export const actualizarCategoria = async (id: number, nombre: string) => {
  const respuesta = await api.put<Categoria>("/categorias/" + id, { nombre });
  return respuesta.data;
};

export const eliminarCategoria = async (id: number) => {
  await api.delete("/categorias/" + id);
};
