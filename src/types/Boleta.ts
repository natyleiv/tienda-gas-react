// Boleta (compra) tal como la devuelve el backend.
export type EstadoBoleta = "PENDIENTE" | "EN_REPARTO" | "ENTREGADA" | "CANCELADA";

// Una línea de la boleta. Se guarda el nombre y precio del momento de la compra.
export interface DetalleBoleta {
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Boleta {
  id: number;
  fecha: string;
  usuarioId: number;
  cliente: string;
  correo: string;
  direccion: string;
  estado: EstadoBoleta;
  subtotal: number;
  descuento: number;
  total: number;
  cupon?: string | null;
  detalles: DetalleBoleta[];
}
