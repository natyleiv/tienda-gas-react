// Detalle de una compra: GET /boletas/{id}
// El cliente solo puede ver las suyas (si no, el backend responde 403).
// El administrador y el vendedor pueden ver cualquiera.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Boleta } from "../types/Boleta";
import { obtenerBoleta } from "../services/boletaService";
import { mensajeError } from "../api/axiosConfig";
import { useSesion } from "../context/SesionContext";
import { formatearPrecio } from "../services/tienda";
import { formatearFecha } from "../services/formato";
import { EstadoBoleta } from "../components/EstadoBoleta";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

export const DetalleCompra = () => {
  const { id } = useParams();
  const { usuario } = useSesion();
  const [boleta, setBoleta] = useState<Boleta | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        setBoleta(await obtenerBoleta(Number(id)));
        setError("");
      } catch (e) {
        setBoleta(null);
        setError(mensajeError(e)); // ej: "No puedes ver una boleta de otro usuario"
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  // El botón "Volver" lleva a la lista que corresponde según el rol.
  const volver = usuario?.rol === "CLIENTE" ? "/mis-compras" : "/admin/ordenes";

  if (cargando) return <Cargando texto="Cargando compra..." />;

  if (!boleta) {
    return (
      <>
        <Mensaje tipo="danger" texto={error} />
        <Link to={volver}>Volver</Link>
      </>
    );
  }

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Compra N° {boleta.id}</h1>
        <EstadoBoleta estado={boleta.estado} />
      </div>

      <div className="card card-body mb-4">
        <p className="mb-1"><strong>Fecha:</strong> {formatearFecha(boleta.fecha)}</p>
        <p className="mb-1"><strong>Cliente:</strong> {boleta.cliente} ({boleta.correo})</p>
        <p className="mb-0"><strong>Dirección de despacho:</strong> {boleta.direccion}</p>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th className="text-end">Subtotal</th></tr>
          </thead>
          <tbody>
            {boleta.detalles.map((d) => (
              <tr key={d.productoId}>
                <td>{d.nombre}</td>
                <td>{formatearPrecio(d.precioUnitario)}</td>
                <td>{d.cantidad}</td>
                <td className="text-end">{formatearPrecio(d.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={3}>Subtotal</td><td className="text-end">{formatearPrecio(boleta.subtotal)}</td></tr>
            {boleta.descuento > 0 && (
              <tr className="text-success">
                <td colSpan={3}>Descuento (cupón {boleta.cupon})</td>
                <td className="text-end">-{formatearPrecio(boleta.descuento)}</td>
              </tr>
            )}
            <tr className="fw-bold"><td colSpan={3}>Total</td><td className="text-end">{formatearPrecio(boleta.total)}</td></tr>
          </tfoot>
        </table>
      </div>

      <Link to={volver} className="btn btn-outline-secondary">Volver</Link>
    </>
  );
};
