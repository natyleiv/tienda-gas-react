// Un campo de formulario reutilizable: etiqueta + input (o select / textarea) + mensaje de error.
// Se usa en TODOS los formularios, así no repetimos el mismo HTML una y otra vez.
interface Opcion {
  valor: string;
  texto: string;
}

interface CampoFormularioProps {
  id: string;
  etiqueta: string;
  valor: string;
  onCambio: (valor: string) => void;
  tipo?: "text" | "email" | "password" | "date" | "number" | "textarea";
  opciones?: Opcion[]; // si viene, el campo es un <select>
  error?: string;
  placeholder?: string;
  deshabilitado?: boolean;
  textoVacio?: string; // texto de la primera opción del select
}

export const CampoFormulario = ({
  id,
  etiqueta,
  valor,
  onCambio,
  tipo = "text",
  opciones,
  error,
  placeholder,
  deshabilitado = false,
  textoVacio = "Selecciona...",
}: CampoFormularioProps) => {
  // Si hay error, Bootstrap pinta el borde rojo con la clase is-invalid.
  const clase = (base: string) => base + (error ? " is-invalid" : "");

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {etiqueta}
      </label>

      {opciones ? (
        <select
          id={id}
          className={clase("form-select")}
          value={valor}
          disabled={deshabilitado}
          onChange={(e) => onCambio(e.target.value)}
        >
          <option value="">{textoVacio}</option>
          {opciones.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
      ) : tipo === "textarea" ? (
        <textarea
          id={id}
          className={clase("form-control")}
          rows={3}
          value={valor}
          placeholder={placeholder}
          disabled={deshabilitado}
          onChange={(e) => onCambio(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={tipo}
          className={clase("form-control")}
          value={valor}
          placeholder={placeholder}
          disabled={deshabilitado}
          onChange={(e) => onCambio(e.target.value)}
        />
      )}

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};
