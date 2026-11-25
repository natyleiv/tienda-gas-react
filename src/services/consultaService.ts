// Envía el formulario de contacto al backend.
import { api } from "../api/axiosConfig";
import type { DatosConsulta } from "../types/Consulta";

export const enviarConsulta = async (datos: DatosConsulta) => {
  await api.post("/consultas", datos);
};
