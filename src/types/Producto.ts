// Un producto de la tienda (tal como lo devuelve la API).
// precioOferta es opcional: si existe, es el precio rebajado y debe ser menor que precio.
export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoriaId: number;
  categoriaNombre?: string; // lo agrega el backend para no tener que buscarla
  precio: number;
  precioOferta?: number | null; // el backend envía null cuando no hay oferta
  imagen: string;
  stock: number;
  stockCritico: number; // si stock <= stockCritico se muestra una alerta
  descripcion: string;
}

// Los datos que se envían al crear o editar un producto.
export type DatosProducto = Omit<Producto, "id" | "categoriaNombre">;
