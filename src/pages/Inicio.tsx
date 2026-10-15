// Página de inicio: presentación + productos en oferta.
import { Link } from "react-router";
import { obtenerCategorias, obtenerProductos } from "../services/storage";
import { ProductosLista } from "../components/ProductosLista";

export const Inicio = () => {
  const categorias = obtenerCategorias();
  // filter: nos quedamos solo con los productos que tienen precio de oferta.
  const ofertas = obtenerProductos().filter((p) => p.precioOferta !== undefined);

  return (
    <>
      <section className="hero rounded p-4 p-md-5 mb-5 text-white">
        {/* logo-portada: borde de luz blanca (ver styles.css) para que se vea sobre el azul */}
        <img src="/logo.png" alt="Logo Gas El Volcán" height="130" className="logo-portada mb-3 d-block" />
        <h1 className="display-5 fw-bold">Distribuidora de Gas El Volcán</h1>
        <p className="lead">Cilindros, accesorios y artefactos a gas con entrega en Chillán y alrededores.</p>
        <Link to="/catalogo" className="btn btn-light btn-lg">Ver catálogo</Link>
      </section>

      <h2 className="h4 mb-3">Ofertas</h2>
      <ProductosLista productos={ofertas} categorias={categorias} />
    </>
  );
};
