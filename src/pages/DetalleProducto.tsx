// Detalle de un producto. La ruta es /catalogo/:id (igual que DetalleCurso en clases).
// El producto se pide al backend: GET /productos/{id}
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Producto } from "../types/Producto";
import { obtenerProducto } from "../services/productoService";
import { formatearPrecio } from "../services/tienda";
import { useCarrito } from "../context/CarritoContext";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

export const DetalleProducto = () => {
  const { id } = useParams(); // siempre llega como texto (string)
  const { agregar } = useCarrito();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "success" as "success" | "danger", texto: "" });

  // Se vuelve a ejecutar si cambia el id de la URL.
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        setProducto(await obtenerProducto(Number(id)));
      } catch {
        setProducto(null); // 404 u otro error: se muestra "no encontrado"
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  if (cargando) return <Cargando texto="Cargando producto..." />;

  if (!producto) {
    return (
      <>
        <h1 className="h3">Producto no encontrado</h1>
        <Link to="/catalogo">Volver al catálogo</Link>
      </>
    );
  }

  const sinStock = producto.stock <= 0;

  const manejarAgregar = () => {
    const error = agregar(producto);
    setMensaje(error ? { tipo: "danger", texto: error } : { tipo: "success", texto: "Producto agregado al carrito." });
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-md-5">
        <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
      </div>
      <div className="col-12 col-md-7">
        <span className="badge bg-secondary mb-2">{producto.categoriaNombre ?? "Sin categoría"}</span>
        <h1 className="h3">{producto.nombre}</h1>
        <p className="text-muted">Código: {producto.codigo}</p>

        {producto.precioOferta ? (
          <p className="fs-4">
            <span className="text-decoration-line-through text-muted me-2">{formatearPrecio(producto.precio)}</span>
            <strong className="text-danger">{formatearPrecio(producto.precioOferta)}</strong>
          </p>
        ) : (
          <p className="fs-4"><strong>{formatearPrecio(producto.precio)}</strong></p>
        )}

        <p>{producto.descripcion}</p>
        <p className={sinStock ? "text-danger" : "text-success"}>
          {sinStock ? "Sin stock" : "Disponibilidad: " + producto.stock + " unidades"}
        </p>

        <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary" disabled={sinStock} onClick={manejarAgregar}>
            Agregar al carrito
          </button>
          <Link to="/catalogo" className="btn btn-outline-secondary">Volver</Link>
        </div>
      </div>
    </div>
  );
};
