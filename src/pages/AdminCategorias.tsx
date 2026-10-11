// Administración de categorías (solo administrador): crear, renombrar y eliminar.
import { useState } from "react";
import type { Categoria } from "../types/Categoria";
import { obtenerCategorias, guardarCategorias, obtenerProductos } from "../services/storage";
import { CampoFormulario } from "../components/CampoFormulario";
import { Mensaje } from "../components/Mensaje";

export const AdminCategorias = () => {
  const [categorias, setCategorias] = useState(obtenerCategorias);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "success" as "success" | "danger", texto: "" });

  const actualizarLista = (lista: Categoria[]) => {
    setCategorias(lista);
    guardarCategorias(lista);
  };

  const guardar = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const limpio = nombre.trim();

    if (!limpio) {
      setError("El nombre es obligatorio.");
      return;
    }
    // No se permiten dos categorías con el mismo nombre (sin importar mayúsculas).
    const repetida = categorias.some((c) => c.nombre.toLowerCase() === limpio.toLowerCase() && c.id !== editando?.id);
    if (repetida) {
      setError("Ya existe una categoría con ese nombre.");
      return;
    }

    if (editando) {
      actualizarLista(categorias.map((c) => (c.id === editando.id ? { ...c, nombre: limpio } : c)));
      setMensaje({ tipo: "success", texto: "Categoría actualizada." });
    } else {
      actualizarLista([...categorias, { id: Date.now(), nombre: limpio }]);
      setMensaje({ tipo: "success", texto: "Categoría creada." });
    }
    setError("");
    setNombre("");
    setEditando(null);
  };

  const editar = (categoria: Categoria) => {
    setEditando(categoria);
    setNombre(categoria.nombre);
    setError("");
  };

  const eliminar = (categoria: Categoria) => {
    // Coherencia de datos: no se puede borrar una categoría que tiene productos.
    if (obtenerProductos().some((p) => p.categoriaId === categoria.id)) {
      setMensaje({ tipo: "danger", texto: "No se puede eliminar: hay productos en \"" + categoria.nombre + "\"." });
      return;
    }
    if (!window.confirm("¿Eliminar la categoría?")) return;
    actualizarLista(categorias.filter((c) => c.id !== categoria.id));
    setMensaje({ tipo: "success", texto: "Categoría eliminada." });
  };

  return (
    <>
      <h1 className="h3 mb-3">Categorías</h1>
      <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />

      <form onSubmit={guardar} noValidate className="card card-body mb-4">
        <CampoFormulario id="nombreCategoria" etiqueta={editando ? "Editar categoría" : "Nueva categoría"} valor={nombre} onCambio={setNombre} error={error} />
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">{editando ? "Guardar cambios" : "Agregar"}</button>
          {editando && (
            <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditando(null); setNombre(""); setError(""); }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Nombre</th><th>Acciones</th></tr></thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editar(c)}>Editar</button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(c)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
