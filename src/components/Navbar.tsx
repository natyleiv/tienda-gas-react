// Menú superior. Las opciones cambian según el rol del usuario.
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSesion } from "../context/SesionContext";
import { useCarrito } from "../context/CarritoContext";

export const Navbar = () => {
  const { usuario, cerrarSesion } = useSesion();
  const { cantidadTotal } = useCarrito();
  const navigate = useNavigate();

  // Estado para abrir/cerrar el menú en pantallas pequeñas (celular).
  const [abierto, setAbierto] = useState(false);
  const cerrarMenu = () => setAbierto(false);

  const salir = () => {
    cerrarSesion();
    cerrarMenu();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={cerrarMenu}>
          Gas El Volcán
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir menú"
          onClick={() => setAbierto(!abierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={"collapse navbar-collapse" + (abierto ? " show" : "")}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/catalogo" onClick={cerrarMenu}>Catálogo</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto" onClick={cerrarMenu}>Contacto</Link>
            </li>

            {/* Opciones solo para administrador */}
            {usuario?.rol === "administrador" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/usuarios" onClick={cerrarMenu}>Usuarios</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/productos" onClick={cerrarMenu}>Productos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/categorias" onClick={cerrarMenu}>Categorías</Link>
                </li>
              </>
            )}

            {/* Opciones solo para vendedor */}
            {usuario?.rol === "vendedor" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/productos" onClick={cerrarMenu}>Stock</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/usuarios" onClick={cerrarMenu}>Crear clientes</Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/carrito" onClick={cerrarMenu}>
                Carrito <span className="badge bg-light text-primary">{cantidadTotal}</span>
              </Link>
            </li>

            {usuario ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/perfil" onClick={cerrarMenu}>
                    {usuario.nombre} ({usuario.rol})
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" type="button" onClick={salir}>
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={cerrarMenu}>Ingresar</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registro" onClick={cerrarMenu}>Registro</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
