// Spinner de Bootstrap que se muestra mientras se espera la respuesta del backend.
interface CargandoProps {
  texto?: string;
}

export const Cargando = ({ texto = "Cargando..." }: CargandoProps) => {
  return (
    <div className="d-flex align-items-center gap-2 my-4 text-muted">
      <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
      <span>{texto}</span>
    </div>
  );
};
