// Administración de productos.
// - Administrador: crear, editar y eliminar productos.
// - Vendedor: ver los productos y modificar SOLO el stock.
import { useState } from "react";
import { useSesion } from "../context/SesionContext";
import type { DatosProducto, Producto } from "../types/Producto";
import { obtenerCategorias, obtenerProductos, guardarProductos } from "../services/storage";
import { FormularioProducto } from "../components/FormularioProducto";
import { FilaProducto } from "../components/FilaProducto";
import { Mensaje } from "../components/Mensaje";

export const AdminProductos = () => {
  const { usuario } = useSesion();
  const [productos, setProductos] = useState(obtenerProductos);
  const [categorias] = useState(obtenerCategorias);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [mensaje, setMensaje] = useState("");

  if (!usuario) return null;
  const esAdmin = usuario.rol === "administrador";

  const actualizarLista = (lista: Producto[]) => {
    setProductos(lista);
    guardarProductos(lista);
  };

  const guardar = (datos: DatosProducto) => {
    if (editando) {
      actualizarLista(productos.map((p) => (p.id === editando.id ? { ...p, ...datos } : p)));
      setMensaje("Producto actualizado.");
      setEditando(null);
    } else {
      actualizarLista([...productos, { ...datos, id: Date.now() }]);
      setMensaje("Producto creado.");
    }
  };

  const eliminar = (id: number) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    actualizarLista(productos.filter((p) => p.id !== id));
    setMensaje("Producto eliminado.");
  };

  // Solo cambia el stock (lo usa el vendedor).
  const cambiarStock = (id: number, stock: number) => {
    actualizarLista(productos.map((p) => (p.id === id ? { ...p, stock } : p)));
    setMensaje("Stock actualizado.");
  };

  return (
    <>
      <h1 className="h3 mb-3">{esAdmin ? "Productos" : "Stock de productos"}</h1>
      <Mensaje tipo="success" texto={mensaje} />

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

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <FilaProducto
                key={p.id}
                producto={p}
                nombreCategoria={categorias.find((c) => c.id === p.categoriaId)?.nombre ?? "Sin categoría"}
                rol={usuario.rol}
                onEditar={setEditando}
                onEliminar={eliminar}
                onCambiarStock={cambiarStock}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
