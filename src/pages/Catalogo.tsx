// Catálogo con filtros combinados (categoría + rango de precio).
import { useState } from "react";
import { obtenerCategorias, obtenerProductos } from "../services/storage";
import { precioFinal } from "../services/tienda";
import { FiltrosCatalogo } from "../components/FiltrosCatalogo";
import { ProductosLista } from "../components/ProductosLista";

export const Catalogo = () => {
  const [productos] = useState(obtenerProductos);
  const [categorias] = useState(obtenerCategorias);

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
      <p className="text-muted">{filtrados.length} producto(s) encontrado(s)</p>
      <ProductosLista productos={filtrados} categorias={categorias} />
    </>
  );
};
