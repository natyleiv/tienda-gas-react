// Muestra una lista de productos en una grilla de Bootstrap.
// Se reutiliza en Inicio (ofertas) y en Catálogo (filtrado).
import { useState } from "react";
import type { Producto } from "../types/Producto";
import type { Categoria } from "../types/Categoria";
import { useCarrito } from "../context/CarritoContext";
import { ProductoCard } from "./ProductoCard";
import { Mensaje } from "./Mensaje";

interface ProductosListaProps {
  productos: Producto[];
  categorias: Categoria[];
}

export const ProductosLista = ({ productos, categorias }: ProductosListaProps) => {
  const { agregar } = useCarrito();
  // Mensaje que aparece al agregar un producto (error de stock o confirmación).
  const [mensaje, setMensaje] = useState({ tipo: "success" as "success" | "danger", texto: "" });

  const manejarAgregar = (id: number) => {
    const error = agregar(id);
    if (error) {
      setMensaje({ tipo: "danger", texto: error });
    } else {
      setMensaje({ tipo: "success", texto: "Producto agregado al carrito." });
    }
  };

  // Si no hay productos, se muestra un aviso en vez de la grilla.
  if (productos.length === 0) {
    return <p className="text-muted">No hay productos que coincidan.</p>;
  }

  return (
    <>
      <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />
      <div className="row g-4">
        {productos.map((p) => (
          // col-12 (móvil) / col-sm-6 (tablet) / col-lg-4 y col-xl-3 (PC)
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={p.id}>
            <ProductoCard
              producto={p}
              nombreCategoria={categorias.find((c) => c.id === p.categoriaId)?.nombre ?? "Sin categoría"}
              onAgregar={manejarAgregar}
            />
          </div>
        ))}
      </div>
    </>
  );
};
