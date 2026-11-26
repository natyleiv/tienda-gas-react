// Historial de compras del cliente con sesión: GET /boletas/mis-boletas
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Boleta } from "../types/Boleta";
import { obtenerMisBoletas } from "../services/boletaService";
import { mensajeError } from "../api/axiosConfig";
import { formatearPrecio } from "../services/tienda";
import { formatearFecha } from "../services/formato";
import { EstadoBoleta } from "../components/EstadoBoleta";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

export const MisCompras = () => {
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        setBoletas(await obtenerMisBoletas());
      } catch (e) {
        setError(mensajeError(e));
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return (
    <>
      <h1 className="h3 mb-3">Mis compras</h1>
      <Mensaje tipo="danger" texto={error} />

      {cargando ? (
        <Cargando texto="Cargando compras..." />
      ) : boletas.length === 0 ? (
        !error && (
          <p>
            Aún no tienes compras. <Link to="/catalogo">Ir al catálogo</Link>
          </p>
        )
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>N°</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {boletas.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{formatearFecha(b.fecha)}</td>
                  <td>{b.detalles.reduce((suma, d) => suma + d.cantidad, 0)} unidad(es)</td>
                  <td>{formatearPrecio(b.total)}</td>
                  <td><EstadoBoleta estado={b.estado} /></td>
                  <td>
                    <Link to={"/compras/" + b.id} className="btn btn-sm btn-outline-primary">Ver detalle</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
