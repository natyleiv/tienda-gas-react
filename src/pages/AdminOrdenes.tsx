// Órdenes de compra (GET /boletas).
// - Administrador y vendedor: ven todas las órdenes y su detalle.
// - Solo el administrador cambia el estado (PATCH /boletas/{id}/estado).
import { useEffect, useState } from "react";
import { useSesion } from "../context/SesionContext";
import type { Boleta, EstadoBoleta } from "../types/Boleta";
import { obtenerBoletas, cambiarEstado } from "../services/boletaService";
import { mensajeError } from "../api/axiosConfig";
import { ESTADOS } from "../services/formato";
import { FilaOrden } from "../components/FilaOrden";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

export const AdminOrdenes = () => {
  const { usuario } = useSesion();
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [filtro, setFiltro] = useState<EstadoBoleta | "">(""); // "" = todas
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "success" as "success" | "danger", texto: "" });

  const cargarBoletas = async () => {
    try {
      setBoletas(await obtenerBoletas());
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const cargar = async () => {
      await cargarBoletas();
    };
    cargar();
  }, []);

  if (!usuario) return null;
  const esAdmin = usuario.rol === "ADMINISTRADOR";

  const cambiar = async (boleta: Boleta, estado: EstadoBoleta) => {
    if (estado === "CANCELADA" && !window.confirm("¿Cancelar la orden N° " + boleta.id + "? El stock vuelve al inventario.")) {
      return;
    }
    try {
      await cambiarEstado(boleta.id, estado);
      setMensaje({ tipo: "success", texto: "Orden N° " + boleta.id + " cambiada a \"" + ESTADOS[estado].texto + "\"." });
      await cargarBoletas();
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
    }
  };

  // filter: si hay un estado elegido, solo se muestran esas órdenes.
  const filtradas = filtro ? boletas.filter((b) => b.estado === filtro) : boletas;

  return (
    <>
      <h1 className="h3 mb-3">Órdenes</h1>
      <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />

      <div className="row mb-3">
        <div className="col-12 col-md-4">
          <label htmlFor="filtroEstado" className="form-label">Filtrar por estado</label>
          <select id="filtroEstado" className="form-select" value={filtro} onChange={(e) => setFiltro(e.target.value as EstadoBoleta | "")}>
            <option value="">Todas</option>
            {(Object.keys(ESTADOS) as EstadoBoleta[]).map((e) => (
              <option key={e} value={e}>{ESTADOS[e].texto}</option>
            ))}
          </select>
        </div>
      </div>

      {cargando ? (
        <Cargando texto="Cargando órdenes..." />
      ) : (
        <>
          <p className="text-muted">{filtradas.length} orden(es)</p>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>N°</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th>
                  {esAdmin && <th>Cambiar estado</th>}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((b) => (
                  // key con el estado: al cambiarlo, la fila se vuelve a crear con sus nuevas opciones
                  <FilaOrden key={b.id + b.estado} boleta={b} onCambiarEstado={esAdmin ? cambiar : undefined} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};
