import { Link } from "react-router";

// Se muestra cuando la URL no coincide con ninguna ruta.
export const NoEncontrada = () => {
  return (
    <>
      <h1 className="h3">Página no encontrada</h1>
      <Link to="/">Volver al inicio</Link>
    </>
  );
};
