// Una fila de la tabla de productos de administración.
// - Administrador: botones Editar y Eliminar.
// - Vendedor: solo puede cambiar el stock (campo + botón Guardar stock).
import { useState } from "react";
import type { Producto } from "../types/Producto";
import type { Rol } from "../types/Usuario";
import { formatearPrecio, precioFinal } from "../services/tienda";

interface FilaProductoProps {
  producto: Producto;
  nombreCategoria: string;
  rol: Rol;
  onEditar: (producto: Producto) => void;
  onEliminar: (id: number) => void;
  onCambiarStock: (id: number, stock: number) => void;
}

export const FilaProducto = ({ producto, nombreCategoria, rol, onEditar, onEliminar, onCambiarStock }: FilaProductoProps) => {
  // Estado propio de la fila: el stock que el vendedor está escribiendo.
  const [stockNuevo, setStockNuevo] = useState(String(producto.stock));
  const stockValido = stockNuevo !== "" && Number.isInteger(Number(stockNuevo)) && Number(stockNuevo) >= 0;
  const critico = producto.stock <= producto.stockCritico;

  return (
    <tr>
      <td>{producto.codigo}</td>
      <td>{producto.nombre}</td>
      <td>{nombreCategoria}</td>
      <td>{formatearPrecio(precioFinal(producto))}</td>
      <td>
        {producto.stock}{" "}
        {critico && <span className="badge bg-warning text-dark">Stock crítico</span>}
      </td>
      <td>
        {rol === "administrador" && (
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onEditar(producto)}>Editar</button>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(producto.id)}>Eliminar</button>
          </div>
        )}
        {rol === "vendedor" && (
          <div className="input-group input-group-sm">
            <input
              type="number"
              className="form-control"
              aria-label={"Nuevo stock de " + producto.nombre}
              value={stockNuevo}
              onChange={(e) => setStockNuevo(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              disabled={!stockValido}
              onClick={() => onCambiarStock(producto.id, Number(stockNuevo))}
            >
              Guardar stock
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};
