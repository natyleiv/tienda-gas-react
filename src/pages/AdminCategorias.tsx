// Administración de categorías (solo administrador): crear, renombrar y eliminar.
// Los cambios se guardan en la base de datos a través de la API.
import { useEffect, useState } from "react";
import type { Categoria } from "../types/Categoria";
import { obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from "../services/productoService";
import { mensajeError } from "../api/axiosConfig";
import { CampoFormulario } from "../components/CampoFormulario";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

export const AdminCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "success" as "success" | "danger", texto: "" });

  const cargarCategorias = async () => {
    try {
      setCategorias(await obtenerCategorias());
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
    } finally {
      setCargando(false);
    }
  };

  // useEffect con [] se ejecuta una sola vez, al abrir la página.
  useEffect(() => {
    const cargar = async () => {
      await cargarCategorias();
    };
    cargar();
  }, []);

  const guardar = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const limpio = nombre.trim();

    if (!limpio) {
      setError("El nombre es obligatorio.");
      return;
    }
    // No se permiten dos categorías con el mismo nombre (el backend también lo revisa).
    const repetida = categorias.some((c) => c.nombre.toLowerCase() === limpio.toLowerCase() && c.id !== editando?.id);
    if (repetida) {
      setError("Ya existe una categoría con ese nombre.");
      return;
    }

    setGuardando(true);
    try {
      if (editando) {
        await actualizarCategoria(editando.id, limpio);
        setMensaje({ tipo: "success", texto: "Categoría actualizada." });
      } else {
        await crearCategoria(limpio);
        setMensaje({ tipo: "success", texto: "Categoría creada." });
      }
      setError("");
      setNombre("");
      setEditando(null);
      await cargarCategorias();
    } catch (err) {
      setMensaje({ tipo: "danger", texto: mensajeError(err) });
    } finally {
      setGuardando(false);
    }
  };

  const editar = (categoria: Categoria) => {
    setEditando(categoria);
    setNombre(categoria.nombre);
    setError("");
  };

  const eliminar = async (categoria: Categoria) => {
    if (!window.confirm("¿Eliminar la categoría?")) return;
    try {
      // Si tiene productos, el backend responde 409 con el motivo.
      await eliminarCategoria(categoria.id);
      setMensaje({ tipo: "success", texto: "Categoría eliminada." });
      await cargarCategorias();
    } catch (err) {
      setMensaje({ tipo: "danger", texto: mensajeError(err) });
    }
  };

  return (
    <>
      <h1 className="h3 mb-3">Categorías</h1>
      <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />

      <form onSubmit={guardar} noValidate className="card card-body mb-4">
        <CampoFormulario id="nombreCategoria" etiqueta={editando ? "Editar categoría" : "Nueva categoría"} valor={nombre} onCambio={setNombre} error={error} />
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Agregar"}
          </button>
          {editando && (
            <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditando(null); setNombre(""); setError(""); }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {cargando ? (
        <Cargando texto="Cargando categorías..." />
      ) : (
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
      )}
    </>
  );
};
