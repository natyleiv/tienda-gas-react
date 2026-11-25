// Formulario de usuario reutilizado en:
//  - Registro público (solo rol cliente)
//  - Administración (el administrador crea y edita usuarios)
import { useState } from "react";
import type { DatosUsuario, Rol, Usuario } from "../types/Usuario";
import { regiones } from "../data/regiones";
import { validarUsuario } from "../services/validaciones";
import type { ErroresUsuario } from "../services/validaciones";
import { CampoFormulario } from "./CampoFormulario";

interface FormularioUsuarioProps {
  inicial?: Usuario; // si viene, el formulario está en modo "editar"
  rolesDisponibles: Rol[];
  dominios: string[]; // dominios de correo permitidos
  textoBoton: string;
  limpiarAlGuardar?: boolean;
  // Devuelve true si el backend guardó los datos (Promise: la respuesta tarda).
  onGuardar: (datos: DatosUsuario) => Promise<boolean>;
  onCancelar?: () => void;
}

const datosVacios: DatosUsuario = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  fechaNacimiento: "",
  region: "",
  direccion: "",
  rol: "CLIENTE",
};

// Comprueba que un texto sea realmente un Rol (igual que la validación del Header en clases).
const esRol = (valor: string): valor is Rol =>
  valor === "ADMINISTRADOR" || valor === "VENDEDOR" || valor === "CLIENTE";

export const FormularioUsuario = ({
  inicial,
  rolesDisponibles,
  dominios,
  textoBoton,
  limpiarAlGuardar = false,
  onGuardar,
  onCancelar,
}: FormularioUsuarioProps) => {
  // Un solo estado con todos los datos del formulario, y otro con los errores.
  // Al editar, la contraseña parte vacía: si no se escribe una nueva, se mantiene la actual.
  const [datos, setDatos] = useState<DatosUsuario>(
    inicial ? { ...inicial, password: "" } : { ...datosVacios, rol: rolesDisponibles[0] },
  );
  const [errores, setErrores] = useState<ErroresUsuario>({});
  const [guardando, setGuardando] = useState(false);

  // Cambia UN campo y deja el resto igual (spread + propiedad calculada).
  const cambiar = (campo: keyof DatosUsuario, valor: string) => {
    setDatos({ ...datos, [campo]: valor });
  };

  const enviar = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); // evita que la página se recargue

    const limpios = { ...datos, correo: datos.correo.trim().toLowerCase(), run: datos.run.trim().toUpperCase() };
    const nuevosErrores = validarUsuario(limpios, dominios, inicial !== undefined);
    setErrores(nuevosErrores);

    // Si hay errores, no se envía al backend.
    if (Object.keys(nuevosErrores).length > 0) return;

    setGuardando(true);
    const guardado = await onGuardar(limpios);
    setGuardando(false);

    if (guardado && limpiarAlGuardar) {
      setDatos({ ...datosVacios, rol: rolesDisponibles[0] });
    }
  };

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row">
        <div className="col-12 col-md-6">
          <CampoFormulario id="run" etiqueta="RUN" valor={datos.run} onCambio={(v) => cambiar("run", v)} placeholder="12345678-5" error={errores.run} />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="fechaNacimiento" etiqueta="Fecha de nacimiento" tipo="date" valor={datos.fechaNacimiento} onCambio={(v) => cambiar("fechaNacimiento", v)} error={errores.fechaNacimiento} />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="nombre" etiqueta="Nombre" valor={datos.nombre} onCambio={(v) => cambiar("nombre", v)} error={errores.nombre} />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="apellidos" etiqueta="Apellidos" valor={datos.apellidos} onCambio={(v) => cambiar("apellidos", v)} error={errores.apellidos} />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onCambio={(v) => cambiar("correo", v)} error={errores.correo} />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="password" etiqueta={inicial ? "Nueva contraseña (opcional)" : "Contraseña (4 a 10 caracteres)"} tipo="password" valor={datos.password} onCambio={(v) => cambiar("password", v)} error={errores.password} />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="region" etiqueta="Región" valor={datos.region} onCambio={(v) => cambiar("region", v)} opciones={regiones.map((r) => ({ valor: r, texto: r }))} error={errores.region} />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="direccion" etiqueta="Dirección" valor={datos.direccion} onCambio={(v) => cambiar("direccion", v)} error={errores.direccion} />
        </div>
        <div className="col-12 col-md-6">
          {/* Si solo hay un rol posible, el campo queda bloqueado */}
          <CampoFormulario
            id="rol"
            etiqueta="Rol"
            valor={datos.rol}
            deshabilitado={rolesDisponibles.length === 1}
            onCambio={(v) => {
              if (esRol(v)) setDatos({ ...datos, rol: v });
            }}
            opciones={rolesDisponibles.map((r) => ({ valor: r, texto: r.toLowerCase() }))}
          />
        </div>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? "Guardando..." : textoBoton}
        </button>
        {onCancelar && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>
        )}
      </div>
    </form>
  );
};
