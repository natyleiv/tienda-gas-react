// Formulario para crear o editar un producto (solo lo usa el administrador).
import { useState } from "react";
import type { DatosProducto, Producto } from "../types/Producto";
import type { Categoria } from "../types/Categoria";
import { CampoFormulario } from "./CampoFormulario";

interface FormularioProductoProps {
  inicial?: Producto;
  categorias: Categoria[];
  productos: Producto[]; // para revisar que el código no esté repetido
  onGuardar: (datos: DatosProducto) => void;
  onCancelar?: () => void;
}

// En el formulario todo se escribe como texto; los números se convierten al guardar.
interface FormTexto {
  codigo: string;
  nombre: string;
  categoriaId: string;
  precio: string;
  precioOferta: string;
  imagen: string;
  stock: string;
  stockCritico: string;
  descripcion: string;
}

type ErroresProducto = Partial<Record<keyof FormTexto, string>>;

const vacio: FormTexto = {
  codigo: "", nombre: "", categoriaId: "", precio: "", precioOferta: "",
  imagen: "https://placehold.co/400x300/1e5591/ffffff?text=Producto",
  stock: "0", stockCritico: "5", descripcion: "",
};

export const FormularioProducto = ({ inicial, categorias, productos, onGuardar, onCancelar }: FormularioProductoProps) => {
  const [datos, setDatos] = useState<FormTexto>(
    inicial
      ? {
          codigo: inicial.codigo,
          nombre: inicial.nombre,
          categoriaId: String(inicial.categoriaId),
          precio: String(inicial.precio),
          precioOferta: inicial.precioOferta ? String(inicial.precioOferta) : "",
          imagen: inicial.imagen,
          stock: String(inicial.stock),
          stockCritico: String(inicial.stockCritico),
          descripcion: inicial.descripcion,
        }
      : vacio,
  );
  const [errores, setErrores] = useState<ErroresProducto>({});

  const cambiar = (campo: keyof FormTexto, valor: string) => setDatos({ ...datos, [campo]: valor });

  const enviar = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nuevos: ErroresProducto = {};
    const precio = Number(datos.precio);
    const stock = Number(datos.stock);
    const stockCritico = Number(datos.stockCritico);

    if (!datos.codigo.trim()) {
      nuevos.codigo = "El código es obligatorio.";
    } else if (productos.some((p) => p.codigo === datos.codigo.trim() && p.id !== inicial?.id)) {
      nuevos.codigo = "Ya existe un producto con ese código.";
    }
    if (!datos.nombre.trim() || datos.nombre.length > 100) nuevos.nombre = "El nombre es obligatorio (máximo 100 caracteres).";
    if (!datos.categoriaId) nuevos.categoriaId = "Selecciona una categoría.";
    if (!(precio > 0)) nuevos.precio = "El precio debe ser mayor a 0.";
    if (datos.precioOferta !== "" && !(Number(datos.precioOferta) > 0 && Number(datos.precioOferta) < precio)) {
      nuevos.precioOferta = "La oferta debe ser mayor a 0 y menor que el precio.";
    }
    if (!Number.isInteger(stock) || stock < 0) nuevos.stock = "El stock debe ser un entero desde 0.";
    if (!Number.isInteger(stockCritico) || stockCritico < 0) nuevos.stockCritico = "El stock crítico debe ser un entero desde 0.";
    if (!datos.descripcion.trim()) nuevos.descripcion = "La descripción es obligatoria.";

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    onGuardar({
      codigo: datos.codigo.trim(),
      nombre: datos.nombre.trim(),
      categoriaId: Number(datos.categoriaId),
      precio,
      precioOferta: datos.precioOferta === "" ? undefined : Number(datos.precioOferta),
      imagen: datos.imagen.trim() || vacio.imagen,
      stock,
      stockCritico,
      descripcion: datos.descripcion.trim(),
    });
    if (!inicial) setDatos(vacio); // al crear, se limpia el formulario
  };

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row">
        <div className="col-12 col-md-4">
          <CampoFormulario id="codigo" etiqueta="Código" valor={datos.codigo} onCambio={(v) => cambiar("codigo", v)} error={errores.codigo} />
        </div>
        <div className="col-12 col-md-8">
          <CampoFormulario id="nombreProducto" etiqueta="Nombre" valor={datos.nombre} onCambio={(v) => cambiar("nombre", v)} error={errores.nombre} />
        </div>
        <div className="col-12 col-md-4">
          <CampoFormulario id="categoriaProducto" etiqueta="Categoría" valor={datos.categoriaId} onCambio={(v) => cambiar("categoriaId", v)} opciones={categorias.map((c) => ({ valor: String(c.id), texto: c.nombre }))} error={errores.categoriaId} />
        </div>
        <div className="col-6 col-md-4">
          <CampoFormulario id="precio" etiqueta="Precio" tipo="number" valor={datos.precio} onCambio={(v) => cambiar("precio", v)} error={errores.precio} />
        </div>
        <div className="col-6 col-md-4">
          <CampoFormulario id="precioOferta" etiqueta="Precio oferta (opcional)" tipo="number" valor={datos.precioOferta} onCambio={(v) => cambiar("precioOferta", v)} error={errores.precioOferta} />
        </div>
        <div className="col-6 col-md-4">
          <CampoFormulario id="stock" etiqueta="Stock" tipo="number" valor={datos.stock} onCambio={(v) => cambiar("stock", v)} error={errores.stock} />
        </div>
        <div className="col-6 col-md-4">
          <CampoFormulario id="stockCritico" etiqueta="Stock crítico" tipo="number" valor={datos.stockCritico} onCambio={(v) => cambiar("stockCritico", v)} error={errores.stockCritico} />
        </div>
        <div className="col-12 col-md-4">
          <CampoFormulario id="imagen" etiqueta="URL de la imagen" valor={datos.imagen} onCambio={(v) => cambiar("imagen", v)} />
        </div>
        <div className="col-12">
          <CampoFormulario id="descripcion" etiqueta="Descripción" tipo="textarea" valor={datos.descripcion} onCambio={(v) => cambiar("descripcion", v)} error={errores.descripcion} />
        </div>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">{inicial ? "Guardar cambios" : "Crear producto"}</button>
        {onCancelar && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>
        )}
      </div>
    </form>
  );
};
