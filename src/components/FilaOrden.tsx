// Una fila de la tabla de órdenes.
// Si llega onCambiarEstado (administrador) y la orden no está terminada,
// se muestra un select para cambiar su estado.
import { useState } from "react";
import { Link } from "react-router";
import type { Boleta, EstadoBoleta as Estado } from "../types/Boleta";
import { formatearPrecio } from "../services/tienda";
import { formatearFecha, ESTADOS } from "../services/formato";
import { EstadoBoleta } from "./EstadoBoleta";

interface FilaOrdenProps {
  boleta: Boleta;
  onCambiarEstado?: (boleta: Boleta, estado: Estado) => void;
}

export const FilaOrden = ({ boleta, onCambiarEstado }: FilaOrdenProps) => {
  // ENTREGADA y CANCELADA son estados finales (el backend no permite cambiarlos).
  const terminada = boleta.estado === "ENTREGADA" || boleta.estado === "CANCELADA";
  // Solo se ofrecen los estados que van "hacia adelante":
  // Pendiente -> En reparto -> Entregada, o Cancelada.
  const todos = Object.keys(ESTADOS) as Estado[];
  const opciones = todos.slice(todos.indexOf(boleta.estado) + 1);
  const [nuevoEstado, setNuevoEstado] = useState<Estado>(opciones[0]);

  return (
    <tr>
      <td>{boleta.id}</td>
      <td>{formatearFecha(boleta.fecha)}</td>
      <td>{boleta.cliente}</td>
      <td>{formatearPrecio(boleta.total)}</td>
      <td><EstadoBoleta estado={boleta.estado} /></td>
      {onCambiarEstado && (
        <td>
          {terminada ? (
            <span className="text-muted small">Sin cambios</span>
          ) : (
            <div className="d-flex gap-2">
              <select
                className="form-select form-select-sm w-auto"
                aria-label={"Nuevo estado de la orden " + boleta.id}
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value as Estado)}
              >
                {opciones.map((e) => (
                  <option key={e} value={e}>{ESTADOS[e].texto}</option>
                ))}
              </select>
              <button type="button" className="btn btn-sm btn-primary" onClick={() => onCambiarEstado(boleta, nuevoEstado)}>
                Cambiar
              </button>
            </div>
          )}
        </td>
      )}
      <td>
        <Link to={"/compras/" + boleta.id} className="btn btn-sm btn-outline-primary">Ver detalle</Link>
      </td>
    </tr>
  );
};
