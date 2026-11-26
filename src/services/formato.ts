// Funciones de formato para mostrar las compras.
import type { EstadoBoleta } from "../types/Boleta";

// Muestra una fecha del backend (ej: "2026-11-25T10:19:34") como "25-11-26, 10:19".
export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
}

// Texto y color de Bootstrap para cada estado de una compra.
export const ESTADOS: Record<EstadoBoleta, { texto: string; color: string }> = {
  PENDIENTE: { texto: "Pendiente", color: "bg-warning text-dark" },
  EN_REPARTO: { texto: "En reparto", color: "bg-info text-dark" },
  ENTREGADA: { texto: "Entregada", color: "bg-success" },
  CANCELADA: { texto: "Cancelada", color: "bg-secondary" },
};
