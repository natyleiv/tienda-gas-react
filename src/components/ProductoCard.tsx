// Tarjeta de UN producto. No decide nada: recibe los datos y la función por props.
import { Link } from "react-router";
import type { Producto } from "../types/Producto";
import { formatearPrecio } from "../services/tienda";

interface ProductoCardProps {
  producto: Producto;
  nombreCategoria: string;
  onAgregar: (id: number) => void;
}

export const ProductoCard = ({ producto, nombreCategoria, onAgregar }: ProductoCardProps) => {
  const sinStock = producto.stock <= 0;

  return (
    <article className="card h-100 shadow-sm">
      <img src={producto.imagen} alt={producto.nombre} className="card-img-top" />
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary align-self-start mb-2">{nombreCategoria}</span>
        <h2 className="h6 card-title">{producto.nombre}</h2>

        {/* Renderizado condicional: precio con oferta o precio normal */}
        {producto.precioOferta ? (
          <p className="mb-1">
            <span className="text-decoration-line-through text-muted me-2">
              {formatearPrecio(producto.precio)}
            </span>
            <strong className="text-danger">{formatearPrecio(producto.precioOferta)}</strong>
          </p>
        ) : (
          <p className="mb-1">
            <strong>{formatearPrecio(producto.precio)}</strong>
          </p>
        )}

        {sinStock ? (
          <p className="text-danger small">Sin stock</p>
        ) : (
          <p className="text-success small">Stock disponible: {producto.stock}</p>
        )}

        <div className="mt-auto d-grid gap-2">
          <Link to={"/catalogo/" + producto.id} className="btn btn-outline-primary btn-sm">
            Ver detalle
          </Link>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={sinStock}
            onClick={() => onAgregar(producto.id)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
};
