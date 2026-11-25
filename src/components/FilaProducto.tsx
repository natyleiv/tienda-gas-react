// Una fila de la tabla de productos de administración.
// - Administrador: botones Editar y Eliminar.
// - Vendedor: solo visualiza (Anexo 1: el vendedor no modifica productos).
import type { Producto } from "../types/Producto";
import { formatearPrecio, precioFinal } from "../services/tienda";

interface FilaProductoProps {
  producto: Producto;
  // Si no llegan las funciones, la fila queda de solo lectura.
  onEditar?: (producto: Producto) => void;
  onEliminar?: (producto: Producto) => void;
}

export const FilaProducto = ({ producto, onEditar, onEliminar }: FilaProductoProps) => {
  const critico = producto.stock <= producto.stockCritico;

  return (
    <tr>
      <td>{producto.codigo}</td>
      <td>{producto.nombre}</td>
      <td>{producto.categoriaNombre ?? "Sin categoría"}</td>
      <td>{formatearPrecio(precioFinal(producto))}</td>
      <td>
        {producto.stock}{" "}
        {critico && <span className="badge bg-warning text-dark">Stock crítico</span>}
      </td>
      {onEditar && onEliminar && (
        <td>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onEditar(producto)}>Editar</button>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(producto)}>Eliminar</button>
          </div>
        </td>
      )}
    </tr>
  );
};
