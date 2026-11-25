// Administración de usuarios (solo administrador, datos desde la API):
// crear, editar, eliminar, desbloquear y asignar rol.
import { useEffect, useState } from "react";
import { useSesion } from "../context/SesionContext";
import type { DatosUsuario, Usuario } from "../types/Usuario";
import {
  obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, desbloquearUsuario,
} from "../services/usuarioService";
import { mensajeError } from "../api/axiosConfig";
import { DOMINIOS_GENERALES } from "../services/validaciones";
import { FormularioUsuario } from "../components/FormularioUsuario";
import { TablaUsuarios } from "../components/TablaUsuarios";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

export const AdminUsuarios = () => {
  const { usuario, actualizarUsuario: actualizarSesion } = useSesion();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "success" as "success" | "danger", texto: "" });

  const cargarUsuarios = async () => {
    try {
      setUsuarios(await obtenerUsuarios());
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
    } finally {
      setCargando(false);
    }
  };

  // useEffect con [] se ejecuta una sola vez, al abrir la página.
  useEffect(() => {
    const cargar = async () => {
      await cargarUsuarios();
    };
    cargar();
  }, []);

  if (!usuario) return null;

  const guardar = async (datos: DatosUsuario) => {
    try {
      if (editando) {
        // Nadie puede cambiar su propio rol: el backend lo ignora si lo intenta.
        const actualizado = await actualizarUsuario(editando.id, datos);
        setMensaje({ tipo: "success", texto: "Usuario actualizado." });
        setEditando(null);
        if (actualizado.id === usuario.id) actualizarSesion(actualizado); // se editó a sí mismo
      } else {
        await crearUsuario(datos);
        setMensaje({ tipo: "success", texto: "Usuario creado." });
      }
      await cargarUsuarios();
      return true;
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
      return false;
    }
  };

  const eliminar = async (id: number) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      setMensaje({ tipo: "success", texto: "Usuario eliminado." });
      await cargarUsuarios();
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
    }
  };

  const desbloquear = async (id: number) => {
    try {
      await desbloquearUsuario(id);
      setMensaje({ tipo: "success", texto: "Cuenta desbloqueada." });
      await cargarUsuarios();
    } catch (e) {
      setMensaje({ tipo: "danger", texto: mensajeError(e) });
    }
  };

  return (
    <>
      <h1 className="h3 mb-3">Usuarios</h1>
      <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />

      <section className="card card-body mb-4">
        <h2 className="h5">{editando ? "Editar usuario" : "Nuevo usuario"}</h2>
        {/* key: al cambiar de usuario a editar, el formulario se vuelve a crear con esos datos */}
        <FormularioUsuario
          key={editando?.id ?? "nuevo"}
          inicial={editando ?? undefined}
          rolesDisponibles={editando?.id === usuario.id ? [usuario.rol] : ["ADMINISTRADOR", "VENDEDOR", "CLIENTE"]}
          dominios={DOMINIOS_GENERALES}
          textoBoton={editando ? "Guardar cambios" : "Crear usuario"}
          limpiarAlGuardar={!editando}
          onGuardar={guardar}
          onCancelar={editando ? () => setEditando(null) : undefined}
        />
      </section>

      {cargando ? (
        <Cargando texto="Cargando usuarios..." />
      ) : (
        <TablaUsuarios
          usuarios={usuarios}
          idSesion={usuario.id}
          onEditar={setEditando}
          onEliminar={eliminar}
          onDesbloquear={desbloquear}
        />
      )}
    </>
  );
};
