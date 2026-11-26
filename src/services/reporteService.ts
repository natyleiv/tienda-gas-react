// Llamada a la API de reportes (solo ADMINISTRADOR).
import { api } from "../api/axiosConfig";
import type { Periodo, Reporte } from "../types/Reporte";

export const obtenerResumen = async (periodo: Periodo) => {
  const respuesta = await api.get<Reporte>("/reportes/resumen", { params: { periodo } });
  return respuesta.data;
};
