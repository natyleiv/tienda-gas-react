// Lo que se envía desde el formulario de contacto (POST /consultas).
export interface DatosConsulta {
  nombre: string;
  correo: string;
  mensaje: string;
}
