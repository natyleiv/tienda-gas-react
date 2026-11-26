// Dashboard del administrador: GET /reportes/resumen?periodo=...
// Muestra cantidad de operaciones, monto vendido, productos más vendidos
// y órdenes por estado, filtrado por semana, mes, año o todo.
import { useEffect, useState } from "react";
import type { Periodo, Reporte } from "../types/Reporte";
import type { EstadoBoleta as Estado } from "../types/Boleta";
import { obtenerResumen } from "../services/reporteService";
import { mensajeError } from "../api/axiosConfig";
import { formatearPrecio } from "../services/tienda";
import { ESTADOS } from "../services/formato";
import { EstadoBoleta } from "../components/EstadoBoleta";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

const PERIODOS: { valor: Periodo; texto: string }[] = [
  { valor: "semana", texto: "Última semana" },
  { valor: "mes", texto: "Último mes" },
  { valor: "anio", texto: "Último año" },
  { valor: "todo", texto: "Todo" },
];

export const Dashboard = () => {
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Se vuelve a pedir el reporte cada vez que cambia el periodo.
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        setReporte(await obtenerResumen(periodo));
        setError("");
      } catch (e) {
        setError(mensajeError(e));
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [periodo]);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Dashboard</h1>
        <select
          className="form-select w-auto"
          aria-label="Periodo"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value as Periodo)}
        >
          {PERIODOS.map((p) => (
            <option key={p.valor} value={p.valor}>{p.texto}</option>
          ))}
        </select>
      </div>

      <Mensaje tipo="danger" texto={error} />

      {cargando ? (
        <Cargando texto="Calculando indicadores..." />
      ) : (
        reporte && (
          <>
            {/* Tarjetas con los indicadores principales */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-4">
                <div className="card card-body text-center">
                  <p className="text-muted mb-1">Operaciones</p>
                  <p className="display-6 mb-0">{reporte.totalBoletas}</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card card-body text-center">
                  <p className="text-muted mb-1">Monto vendido</p>
                  <p className="display-6 mb-0">{formatearPrecio(reporte.montoTotal)}</p>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card card-body text-center">
                  <p className="text-muted mb-1">Unidades vendidas</p>
                  <p className="display-6 mb-0">{reporte.unidadesVendidas}</p>
                </div>
              </div>
            </div>
            <p className="text-muted small">El monto y las unidades no consideran las órdenes canceladas.</p>

            <div className="row g-4">
              <div className="col-12 col-lg-7">
                <h2 className="h5">Productos más vendidos</h2>
                {reporte.masVendidos.length === 0 ? (
                  <p>No hay ventas en este periodo.</p>
                ) : (
                  <table className="table table-striped">
                    <thead><tr><th>Producto</th><th>Unidades</th><th className="text-end">Monto</th></tr></thead>
                    <tbody>
                      {reporte.masVendidos.map((p) => (
                        <tr key={p.productoId}>
                          <td>{p.nombre}</td>
                          <td>{p.unidades}</td>
                          <td className="text-end">{formatearPrecio(p.monto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="col-12 col-lg-5">
                <h2 className="h5">Órdenes por estado</h2>
                <ul className="list-group">
                  {(Object.keys(ESTADOS) as Estado[]).map((e) => (
                    <li key={e} className="list-group-item d-flex justify-content-between align-items-center">
                      <EstadoBoleta estado={e} />
                      <strong>{reporte.boletasPorEstado[e] ?? 0}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )
      )}
    </>
  );
};
