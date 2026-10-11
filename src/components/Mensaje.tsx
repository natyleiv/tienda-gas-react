// Muestra un aviso de Bootstrap (alert). Si no hay texto, no muestra nada
// (renderizado condicional).
interface MensajeProps {
  tipo: "success" | "danger" | "warning" | "info";
  texto: string;
}

export const Mensaje = ({ tipo, texto }: MensajeProps) => {
  if (!texto) return null;
  return (
    <div className={"alert alert-" + tipo} role="alert">
      {texto}
    </div>
  );
};
