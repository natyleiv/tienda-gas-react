// Administración de usuarios.
// - Administrador: crear, editar, eliminar, desbloquear y asignar cualquier rol.
// - Vendedor: solo puede crear usuarios con rol cliente (y ve la lista de clientes).
import { useState } from "react";
import { useSesion } from "../context/SesionContext";
import type { DatosUsuario, Usuario } from "../types/Usuario";
import { obtenerUsuarios, guardarUsuarios } from "../services/storage";
import { DOMINIOS_GENERALES } from "../services/validaciones";
import { FormularioUsuario } from "../components/FormularioUsuario";
import { TablaUsuarios } from "../components/TablaUsuarios";
import { Mensaje } from "../components/Mensaje";

export const AdminUsuarios = () => {
  const { usuario, actualizarSesion } = useSesion();
  const [usuarios, setUsuarios] = useState(obtenerUsuarios);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [mensaje, setMensaje] = useState("");

  if (!usuario) return null;
  const esAdmin = usuario.rol === "administrador";

  // Actualiza el estado y LocalStorage a la vez.
  const actualizarLista = (lista: Usuario[]) => {
    setUsuarios(lista);
    guardarUsuarios(lista);
  };

  const guardar = (datos: DatosUsuario) => {
    // Nadie puede cambiar su propio rol (igual que en Perfil).
    // El vendedor solo puede crear clientes: se fuerza el rol por seguridad.
    const rol = editando?.id === usuario.id ? usuario.rol
              : esAdmin ? datos.rol
              : "cliente";

    if (editando) {
      actualizarLista(usuarios.map((u) => (u.id === editando.id ? { ...u, ...datos, rol } : u)));
      setMensaje("Usuario actualizado.");
      setEditando(null);
      if (editando.id === usuario.id) actualizarSesion(); // si se editó a sí mismo
    } else {
      const nuevo: Usuario = { ...datos, rol, id: Date.now(), intentosFallidos: 0, bloqueado: false };
      actualizarLista([...usuarios, nuevo]);
      setMensaje("Usuario creado.");
    }
  };

  const eliminar = (id: number) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    actualizarLista(usuarios.filter((u) => u.id !== id));
    setMensaje("Usuario eliminado.");
  };

  const desbloquear = (id: number) => {
    actualizarLista(usuarios.map((u) => (u.id === id ? { ...u, bloqueado: false, intentosFallidos: 0 } : u)));
    setMensaje("Cuenta desbloqueada.");
  };

  // El vendedor solo ve clientes.
  const visibles = esAdmin ? usuarios : usuarios.filter((u) => u.rol === "cliente");

  return (
    <>
      <h1 className="h3 mb-3">{esAdmin ? "Usuarios" : "Crear clientes"}</h1>
      <Mensaje tipo="success" texto={mensaje} />

      <section className="card card-body mb-4">
        <h2 className="h5">{editando ? "Editar usuario" : "Nuevo usuario"}</h2>
        {/* key: al cambiar de usuario a editar, el formulario se vuelve a crear con esos datos */}
        <FormularioUsuario
          key={editando?.id ?? "nuevo"}
          inicial={editando ?? undefined}
          rolesDisponibles={
            editando?.id === usuario.id ? [usuario.rol]
            : esAdmin ? ["administrador", "vendedor", "cliente"]
            : ["cliente"]
          }
          dominios={DOMINIOS_GENERALES}
          textoBoton={editando ? "Guardar cambios" : "Crear usuario"}
          limpiarAlGuardar={!editando}
          onGuardar={guardar}
          onCancelar={editando ? () => setEditando(null) : undefined}
        />
      </section>

      <TablaUsuarios
        usuarios={visibles}
        idSesion={usuario.id}
        onEditar={esAdmin ? setEditando : undefined}
        onEliminar={esAdmin ? eliminar : undefined}
        onDesbloquear={esAdmin ? desbloquear : undefined}
      />
    </>
  );
};