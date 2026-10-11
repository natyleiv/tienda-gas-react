// App: define el menú, el pie de página y la relación URL -> página.
import { Route, Routes } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { RutaProtegida } from "./components/RutaProtegida";
import { Inicio } from "./pages/Inicio";
import { Catalogo } from "./pages/Catalogo";
import { DetalleProducto } from "./pages/DetalleProducto";
import { Carrito } from "./pages/Carrito";
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";
import { Perfil } from "./pages/Perfil";
import { Contacto } from "./pages/Contacto";
import { AdminUsuarios } from "./pages/AdminUsuarios";
import { AdminProductos } from "./pages/AdminProductos";
import { AdminCategorias } from "./pages/AdminCategorias";
import { NoEncontrada } from "./pages/NoEncontrada";

const App = () => {
  return (
    <>
      {/* Navbar y Footer se repiten en todas las páginas, por eso van aquí una sola vez */}
      <Navbar />
      <main className="container py-4">
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Cualquier usuario con sesión */}
          <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />

          {/* Administración: cada ruta indica qué roles pueden entrar */}
          <Route
            path="/admin/usuarios"
            element={<RutaProtegida roles={["administrador", "vendedor"]}><AdminUsuarios /></RutaProtegida>}
          />
          <Route
            path="/admin/productos"
            element={<RutaProtegida roles={["administrador", "vendedor"]}><AdminProductos /></RutaProtegida>}
          />
          <Route
            path="/admin/categorias"
            element={<RutaProtegida roles={["administrador"]}><AdminCategorias /></RutaProtegida>}
          />

          {/* Cualquier otra dirección */}
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
