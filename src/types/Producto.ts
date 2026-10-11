// Un producto de la tienda.
// precioOferta es opcional (?): si existe, es el precio rebajado y debe ser menor que precio.
export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoriaId: number; // id de la categoría a la que pertenece
  precio: number;
  precioOferta?: number;
  imagen: string;
  stock: number;
  stockCritico: number; // si stock <= stockCritico se muestra una alerta
  descripcion: string;
}

// Los datos de un producto sin el id (lo que llena el formulario).
export type DatosProducto = Omit<Producto, "id">;
