// Página de inicio: presentación + productos en oferta (traídos desde la API).
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Producto } from "../types/Producto";
import type { Categoria } from "../types/Categoria";
import { obtenerCategorias, obtenerProductos } from "../services/productoService";
import { mensajeError } from "../api/axiosConfig";
import { ProductosLista } from "../components/ProductosLista";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

export const Inicio = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // useEffect con [] se ejecuta una sola vez, al mostrar la página.
  useEffect(() => {
    const cargar = async () => {
      try {
        setProductos(await obtenerProductos());
        setCategorias(await obtenerCategorias());
      } catch (e) {
        setError(mensajeError(e));
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // filter: nos quedamos solo con los productos que tienen precio de oferta.
  const ofertas = productos.filter((p) => p.precioOferta);

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
      <Mensaje tipo="danger" texto={error} />
      {cargando ? <Cargando /> : !error && <ProductosLista productos={ofertas} categorias={categorias} />}
    </>
  );
};
