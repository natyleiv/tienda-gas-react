// Protege una página según el rol. Se usa en App.tsx envolviendo la página:
// <RutaProtegida roles={["administrador"]}><AdminCategorias /></RutaProtegida>
import type { ReactNode } from "react";
import { Link, Navigate } from "react-router";
import { useSesion } from "../context/SesionContext";
import type { Rol } from "../types/Usuario";

interface RutaProtegidaProps {
  roles?: Rol[]; // si no se indica, basta con haber iniciado sesión
  children: ReactNode;
}

export const RutaProtegida = ({ roles, children }: RutaProtegidaProps) => {
  const { usuario } = useSesion();

  // Sin sesión: se manda al login.
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Con sesión pero con un rol que no corresponde: se avisa.
  if (roles && !roles.includes(usuario.rol)) {
    return (
      <div className="alert alert-warning">
        <h2 className="h5">Acceso no autorizado</h2>
        <p className="mb-2">Tu rol ({usuario.rol}) no puede ver esta página.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  return <>{children}</>;
};
