// Carrito de compras: modificar cantidades, cupón de descuento y confirmar la compra.
// Los productos (precio y stock actualizados) se piden a la API y la compra
// se confirma con POST /boletas.
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useCarrito } from "../context/CarritoContext";
import { useSesion } from "../context/SesionContext";
import { cupones } from "../data/cupones";
import { obtenerProductos } from "../services/productoService";
import { comprar } from "../services/boletaService";
import { mensajeError } from "../api/axiosConfig";
import { calcularTotales, formatearPrecio, precioFinal } from "../services/tienda";
import type { LineaCarrito } from "../types/Carrito";
import type { Producto } from "../types/Producto";
import type { Boleta } from "../types/Boleta";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

export const Carrito = () => {
  const { items, cambiarCantidad, quitar, vaciar } = useCarrito();
  const { usuario } = useSesion();

  const [codigo, setCodigo] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState({ tipo: "danger" as "success" | "danger" | "info", texto: "" });
  const [boleta, setBoleta] = useState<Boleta | null>(null); // compra recién confirmada
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [comprando, setComprando] = useState(false);

  // Productos actualizados desde el backend (precio y stock reales).
  const cargarProductos = async () => {
    try {
      setProductos(await obtenerProductos());
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
    } finally {
      setCargando(false);
    }
  };

  // useEffect con [] se ejecuta una sola vez, al abrir la página.
  useEffect(() => {
    const cargar = async () => {
      await cargarProductos();
    };
    cargar();
  }, []);

  // Se une cada item del carrito con su producto completo.
  const lineas: LineaCarrito[] = [];
  for (const item of items) {
    const producto = productos.find((p) => p.id === item.productoId);
    if (producto) lineas.push({ producto, cantidad: item.cantidad });
  }

  const { subtotal, descuento, total } = calcularTotales(lineas, cuponAplicado);

  const cambiar = (producto: Producto, cantidad: number) => {
    const error = cambiarCantidad(producto, cantidad);
    setMensaje(error ? { tipo: "danger", texto: error } : { tipo: "danger", texto: "" });
  };

  const aplicarCupon = () => {
    const limpio = codigo.trim().toUpperCase();
    if (cupones[limpio] !== undefined) {
      setCuponAplicado(limpio);
      setMensaje({ tipo: "success", texto: "Cupón aplicado: " + limpio });
    } else {
      setCuponAplicado(null);
      setMensaje({ tipo: "danger", texto: "El cupón no es válido." });
    }
  };

  const confirmar = async () => {
    if (!usuario) return;
    setComprando(true);
    try {
      // Solo se envían los productos que siguen existiendo (las líneas visibles).
      const enviados = lineas.map((l) => ({ productoId: l.producto.id, cantidad: l.cantidad }));
      const nueva = await comprar(enviados, cuponAplicado);
      setBoleta(nueva);
      vaciar();
      setCuponAplicado(null);
      setCodigo("");
      setMensaje({ tipo: "danger", texto: "" });
    } catch (e) {
      // Ej: "No hay stock suficiente de ...". Se recargan los productos para ver el stock real.
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
      await cargarProductos();
    } finally {
      setComprando(false);
    }
  };

  // Compra terminada: se muestra el resumen que devolvió el backend.
  if (boleta) {
    return (
      <div className="alert alert-success">
        <h1 className="h4">¡Compra realizada!</h1>
        <p className="mb-1">Boleta N° {boleta.id} · {new Date(boleta.fecha).toLocaleString("es-CL")}</p>
        <p className="mb-1">Total pagado: <strong>{formatearPrecio(boleta.total)}</strong></p>
        <p>Despacho a: {boleta.direccion}</p>
        <Link to="/catalogo" className="btn btn-primary">Seguir comprando</Link>
      </div>
    );
  }

  if (cargando) return <Cargando texto="Cargando carrito..." />;

  if (lineas.length === 0) {
    return (
      <>
        <h1 className="h3">Carrito</h1>
        <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />
        <p>Tu carrito está vacío.</p>
        <Link to="/catalogo" className="btn btn-primary">Ir al catálogo</Link>
      </>
    );
  }

  return (
    <>
      <h1 className="h3 mb-3">Carrito</h1>
      <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
              </thead>
              <tbody>
                {lineas.map((l) => (
                  <tr key={l.producto.id}>
                    <td>{l.producto.nombre}</td>
                    <td>{formatearPrecio(precioFinal(l.producto))}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => cambiar(l.producto, l.cantidad - 1)}>-</button>
                        <span>{l.cantidad}</span>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => cambiar(l.producto, l.cantidad + 1)}>+</button>
                      </div>
                    </td>
                    <td>{formatearPrecio(precioFinal(l.producto) * l.cantidad)}</td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => quitar(l.producto.id)}>Quitar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-outline-secondary" onClick={vaciar}>Vaciar carrito</button>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card card-body">
            <h2 className="h5">Resumen</h2>

            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Código de cupón"
                aria-label="Código de cupón"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
              <button type="button" className="btn btn-outline-primary" onClick={aplicarCupon}>Aplicar</button>
            </div>

            <p className="d-flex justify-content-between mb-1"><span>Subtotal</span><span>{formatearPrecio(subtotal)}</span></p>
            <p className="d-flex justify-content-between mb-1"><span>Descuento</span><span>-{formatearPrecio(descuento)}</span></p>
            <p className="d-flex justify-content-between fs-5 fw-bold"><span>Total</span><span>{formatearPrecio(total)}</span></p>

            {usuario ? (
              <button type="button" className="btn btn-primary" onClick={confirmar} disabled={comprando}>
                {comprando ? "Procesando..." : "Confirmar compra"}
              </button>
            ) : (
              <Mensaje tipo="info" texto="Debes iniciar sesión para comprar." />
            )}
            {!usuario && <Link to="/login" className="btn btn-primary">Ingresar</Link>}
          </div>
        </div>
      </div>
    </>
  );
};
