// Catálogo con filtros combinados (categoría + rango de precio).
// Los productos y categorías se piden al backend con Axios.
import { useEffect, useState } from "react";
import type { Producto } from "../types/Producto";
import type { Categoria } from "../types/Categoria";
import { obtenerCategorias, obtenerProductos } from "../services/productoService";
import { mensajeError } from "../api/axiosConfig";
import { precioFinal } from "../services/tienda";
import { FiltrosCatalogo } from "../components/FiltrosCatalogo";
import { ProductosLista } from "../components/ProductosLista";
import { Cargando } from "../components/Cargando";
import { Mensaje } from "../components/Mensaje";

export const Catalogo = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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

  // Un estado por cada filtro (viven aquí y se pasan por props a FiltrosCatalogo).
  const [categoriaId, setCategoriaId] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  // filter con las tres condiciones juntas: un filtro vacío no restringe nada.
  const filtrados = productos.filter((p) => {
    const cumpleCategoria = categoriaId === "" || p.categoriaId === Number(categoriaId);
    const cumpleMin = precioMin === "" || precioFinal(p) >= Number(precioMin);
    const cumpleMax = precioMax === "" || precioFinal(p) <= Number(precioMax);
    return cumpleCategoria && cumpleMin && cumpleMax;
  });

  const limpiar = () => {
    setCategoriaId("");
    setPrecioMin("");
    setPrecioMax("");
  };

  return (
    <>
      <h1 className="h3 mb-3">Catálogo</h1>
      <FiltrosCatalogo
        categorias={categorias}
        categoriaId={categoriaId}
        precioMin={precioMin}
        precioMax={precioMax}
        onCategoria={setCategoriaId}
        onPrecioMin={setPrecioMin}
        onPrecioMax={setPrecioMax}
        onLimpiar={limpiar}
      />
      <Mensaje tipo="danger" texto={error} />
      {cargando ? (
        <Cargando texto="Cargando productos..." />
      ) : (
        !error && (
          <>
            <p className="text-muted">{filtrados.length} producto(s) encontrado(s)</p>
            <ProductosLista productos={filtrados} categorias={categorias} />
          </>
        )
      )}
    </>
  );
};
