// Controles de filtro del catálogo. No guarda estado: el estado vive en la
// página Catálogo (estado elevado) y llega por props.
import type { Categoria } from "../types/Categoria";
import { CampoFormulario } from "./CampoFormulario";

interface FiltrosCatalogoProps {
  categorias: Categoria[];
  categoriaId: string;
  precioMin: string;
  precioMax: string;
  onCategoria: (valor: string) => void;
  onPrecioMin: (valor: string) => void;
  onPrecioMax: (valor: string) => void;
  onLimpiar: () => void;
}

export const FiltrosCatalogo = ({
  categorias,
  categoriaId,
  precioMin,
  precioMax,
  onCategoria,
  onPrecioMin,
  onPrecioMax,
  onLimpiar,
}: FiltrosCatalogoProps) => {
  return (
    <section className="card card-body mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-4">
          <CampoFormulario
            id="filtroCategoria"
            etiqueta="Categoría"
            valor={categoriaId}
            onCambio={onCategoria}
            textoVacio="Todas"
            opciones={categorias.map((c) => ({ valor: String(c.id), texto: c.nombre }))}
          />
        </div>
        <div className="col-6 col-md-3">
          <CampoFormulario id="precioMin" etiqueta="Precio mínimo" tipo="number" valor={precioMin} onCambio={onPrecioMin} />
        </div>
        <div className="col-6 col-md-3">
          <CampoFormulario id="precioMax" etiqueta="Precio máximo" tipo="number" valor={precioMax} onCambio={onPrecioMax} />
        </div>
        <div className="col-12 col-md-2 mb-3">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={onLimpiar}>
            Limpiar
          </button>
        </div>
      </div>
    </section>
  );
};
