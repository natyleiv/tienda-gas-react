// Una línea de un pedido. Se copia el nombre y el precio del momento de la compra.
export interface LineaPedido {
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  fecha: string;
  usuarioId: number;
  correo: string;
  direccion: string;
  lineas: LineaPedido[];
  subtotal: number;
  descuento: number;
  total: number;
  cupon?: string;
}
