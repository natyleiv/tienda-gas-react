// Muestra el estado de una compra como una etiqueta (badge) de color.
import type { EstadoBoleta as Estado } from "../types/Boleta";
import { ESTADOS } from "../services/formato";

export const EstadoBoleta = ({ estado }: { estado: Estado }) => {
  return <span className={"badge " + ESTADOS[estado].color}>{ESTADOS[estado].texto}</span>;
};
