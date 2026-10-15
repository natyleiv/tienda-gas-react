// Menú superior. Las opciones cambian según el rol del usuario.
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
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
        {/* El logo sigue siendo Link: no necesita destacarse */}
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
          {/* NavLink agrega la clase "active" al link de la página actual */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/catalogo" onClick={cerrarMenu}>Catálogo</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contacto" onClick={cerrarMenu}>Contacto</NavLink>
            </li>

            {/* Opciones solo para administrador */}
            {usuario?.rol === "administrador" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/usuarios" onClick={cerrarMenu}>Usuarios</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/productos" onClick={cerrarMenu}>Productos</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/categorias" onClick={cerrarMenu}>Categorías</NavLink>
                </li>
              </>
            )}

            {/* Opciones solo para vendedor */}
            {usuario?.rol === "vendedor" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/productos" onClick={cerrarMenu}>Stock</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/usuarios" onClick={cerrarMenu}>Crear clientes</NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/carrito" onClick={cerrarMenu}>
                <i className="bi bi-cart3 me-1"></i>
                Carrito <span className="badge bg-light text-primary">{cantidadTotal}</span>
              </NavLink>
            </li>

            {usuario ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/perfil" onClick={cerrarMenu}>
                    {usuario.nombre} ({usuario.rol})
                  </NavLink>
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
                  <NavLink className="nav-link" to="/login" onClick={cerrarMenu}>Ingresar</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/registro" onClick={cerrarMenu}>Registro</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};