// Tabla de usuarios. Los botones de acción solo aparecen si se entregan
// las funciones (el vendedor ve la tabla sin botones).
import type { Usuario } from "../types/Usuario";

interface TablaUsuariosProps {
  usuarios: Usuario[];
  idSesion: number; // para no permitir eliminar la propia cuenta
  onEditar?: (usuario: Usuario) => void;
  onEliminar?: (id: number) => void;
  onDesbloquear?: (id: number) => void;
}

export const TablaUsuarios = ({ usuarios, idSesion, onEditar, onEliminar, onDesbloquear }: TablaUsuariosProps) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>RUN</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            {onEditar && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.run}</td>
              <td>{u.nombre} {u.apellidos}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>{u.bloqueado ? <span className="badge bg-danger">Bloqueado</span> : <span className="badge bg-success">Activo</span>}</td>
              {onEditar && onEliminar && onDesbloquear && (
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onEditar(u)}>Editar</button>
                    {u.id !== idSesion && (
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(u.id)}>Eliminar</button>
                    )}
                    {u.bloqueado && (
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onDesbloquear(u.id)}>Desbloquear</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
