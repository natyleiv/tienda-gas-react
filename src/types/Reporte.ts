// Indicadores del dashboard (respuesta de GET /reportes/resumen).
export type Periodo = "semana" | "mes" | "anio" | "todo";

export interface ProductoVendido {
  productoId: number;
  nombre: string;
  unidades: number;
  monto: number;
}

export interface Reporte {
  periodo: Periodo;
  totalBoletas: number; // cantidad de operaciones
  montoTotal: number; // total vendido (sin contar las canceladas)
  unidadesVendidas: number;
  masVendidos: ProductoVendido[]; // top 5
  boletasPorEstado: Record<string, number>; // ej: { PENDIENTE: 2, ENTREGADA: 4 }
}
