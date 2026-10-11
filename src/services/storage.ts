// Acceso a LocalStorage. Sigue la idea del profesor (storage.js):
// una clave por colección, JSON.parse para leer y JSON.stringify para guardar.
import type { Categoria } from "../types/Categoria";
import type { Producto } from "../types/Producto";
import type { Usuario } from "../types/Usuario";
import type { ItemCarrito } from "../types/Carrito";
import type { Pedido } from "../types/Pedido";
import type { Consulta } from "../types/Consulta";
import { categoriasIniciales } from "../data/categorias";
import { productosIniciales } from "../data/productos";
import { usuariosIniciales } from "../data/usuarios";

const CLAVE_CATEGORIAS = "tiendaGas.categorias";
const CLAVE_PRODUCTOS = "tiendaGas.productos";
const CLAVE_USUARIOS = "tiendaGas.usuarios";
const CLAVE_CARRITO = "tiendaGas.carrito";
const CLAVE_PEDIDOS = "tiendaGas.pedidos";
const CLAVE_CONSULTAS = "tiendaGas.consultas";
const CLAVE_SESION = "tiendaGas.sesion";

// Lee una colección. Si todavía no existe, guarda y devuelve los datos iniciales.
// <T> significa "el tipo de dato que se va a leer" (ej: Producto[]).
function leer<T>(clave: string, inicial: T): T {
  const texto = localStorage.getItem(clave);
  if (texto === null) {
    localStorage.setItem(clave, JSON.stringify(inicial));
    return inicial;
  }
  return JSON.parse(texto) as T;
}

function guardar<T>(clave: string, valor: T): void {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export const obtenerCategorias = () => leer<Categoria[]>(CLAVE_CATEGORIAS, categoriasIniciales);
export const guardarCategorias = (lista: Categoria[]) => guardar(CLAVE_CATEGORIAS, lista);

export const obtenerProductos = () => leer<Producto[]>(CLAVE_PRODUCTOS, productosIniciales);
export const guardarProductos = (lista: Producto[]) => guardar(CLAVE_PRODUCTOS, lista);

export const obtenerUsuarios = () => leer<Usuario[]>(CLAVE_USUARIOS, usuariosIniciales);
export const guardarUsuarios = (lista: Usuario[]) => guardar(CLAVE_USUARIOS, lista);

export const obtenerCarrito = () => leer<ItemCarrito[]>(CLAVE_CARRITO, []);
export const guardarCarrito = (lista: ItemCarrito[]) => guardar(CLAVE_CARRITO, lista);

export const obtenerPedidos = () => leer<Pedido[]>(CLAVE_PEDIDOS, []);
export const guardarPedidos = (lista: Pedido[]) => guardar(CLAVE_PEDIDOS, lista);

export const obtenerConsultas = () => leer<Consulta[]>(CLAVE_CONSULTAS, []);
export const guardarConsultas = (lista: Consulta[]) => guardar(CLAVE_CONSULTAS, lista);

// Sesión: solo se guarda el id del usuario que inició sesión (o null).
export const obtenerIdSesion = () => leer<number | null>(CLAVE_SESION, null);
export const guardarIdSesion = (id: number | null) => guardar(CLAVE_SESION, id);
