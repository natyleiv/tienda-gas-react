// Administración de productos (datos desde la API).
// - Administrador: crear, editar y eliminar productos.
// - Vendedor: solo visualiza los productos (Anexo 1).
import { useEffect, useState } from "react";
import { useSesion } from "../context/SesionContext";
import type { DatosProducto, Producto } from "../types/Producto";
import type { Categoria } from "../types/Categoria";
import {
  obtenerProductos, obtenerCategorias, crearProducto, actualizarProducto, eliminarProducto,
} from "../services/productoService";
import { mensajeError } from "../api/axiosConfig";
import { FormularioProducto } from "../components/FormularioProducto";
import { FilaProducto } from "../components/FilaProducto";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

export const AdminProductos = () => {
  const { usuario } = useSesion();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "success" as "success" | "danger", texto: "" });

  // Vuelve a pedir la lista al backend (después de crear, editar o eliminar).
  const cargarProductos = async () => {
    try {
      setProductos(await obtenerProductos());
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const cargar = async () => {
      try {
        setCategorias(await obtenerCategorias());
      } catch (e) {
        setMensaje({ tipo: "danger", texto: mensajeError(e) });
      }
      await cargarProductos();
    };
    cargar();
  }, []);

  if (!usuario) return null;
  const esAdmin = usuario.rol === "ADMINISTRADOR";

  const guardar = async (datos: DatosProducto) => {
    try {
      if (editando) {
        await actualizarProducto(editando.id, datos);
        setMensaje({ tipo: "success", texto: "Producto actualizado." });
        setEditando(null);
      } else {
        await crearProducto(datos);
        setMensaje({ tipo: "success", texto: "Producto creado." });
      }
      await cargarProductos();
      return true;
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
      return false;
    }
  };

  const eliminar = async (producto: Producto) => {
    if (!window.confirm("¿Eliminar \"" + producto.nombre + "\"?")) return;
    try {
      await eliminarProducto(producto.id);
      setMensaje({ tipo: "success", texto: "Producto eliminado." });
      await cargarProductos();
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
    }
  };

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>
      <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />

      {esAdmin && (
        <section className="card card-body mb-4">
          <h2 className="h5">{editando ? "Editar producto" : "Nuevo producto"}</h2>
          {categorias.length === 0 ? (
            <Mensaje tipo="warning" texto="Primero crea al menos una categoría." />
          ) : (
            <FormularioProducto
              key={editando?.id ?? "nuevo"}
              inicial={editando ?? undefined}
              categorias={categorias}
              productos={productos}
              onGuardar={guardar}
              onCancelar={editando ? () => setEditando(null) : undefined}
            />
          )}
        </section>
      )}

      {cargando ? (
        <Cargando texto="Cargando productos..." />
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <FilaProducto
                  key={p.id}
                  producto={p}
                  onEditar={esAdmin ? setEditando : undefined}
                  onEliminar={esAdmin ? eliminar : undefined}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
