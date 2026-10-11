// Perfil personal: todos los roles pueden ver y editar sus propios datos.
// El rol se muestra pero NO se puede cambiar.
import { useState } from "react";
import { useSesion } from "../context/SesionContext";
import { regiones } from "../data/regiones";
import { obtenerUsuarios, guardarUsuarios } from "../services/storage";
import { calcularEdad, validarUsuario, DOMINIOS_GENERALES } from "../services/validaciones";
import type { ErroresUsuario } from "../services/validaciones";
import { CampoFormulario } from "../components/CampoFormulario";
import { Mensaje } from "../components/Mensaje";

export const Perfil = () => {
  const { usuario, actualizarSesion } = useSesion();

  // Un estado por campo editable (valores iniciales = datos actuales del usuario).
  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [apellidos, setApellidos] = useState(usuario?.apellidos ?? "");
  const [correo, setCorreo] = useState(usuario?.correo ?? "");
  const [fechaNacimiento, setFechaNacimiento] = useState(usuario?.fechaNacimiento ?? "");
  const [region, setRegion] = useState(usuario?.region ?? "");
  const [direccion, setDireccion] = useState(usuario?.direccion ?? "");
  const [errores, setErrores] = useState<ErroresUsuario>({});
  const [mensaje, setMensaje] = useState("");

  if (!usuario) return null;

  const guardar = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Se reutiliza la misma validación de usuarios; run, contraseña y rol no cambian.
    const datos = {
      run: usuario.run,
      password: usuario.password,
      rol: usuario.rol,
      nombre,
      apellidos,
      correo: correo.trim().toLowerCase(),
      fechaNacimiento,
      region,
      direccion,
    };
    const nuevosErrores = validarUsuario(datos, obtenerUsuarios(), DOMINIOS_GENERALES, usuario.id);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje("");
      return;
    }

    guardarUsuarios(obtenerUsuarios().map((u) => (u.id === usuario.id ? { ...u, ...datos } : u)));
    actualizarSesion(); // refresca el usuario guardado en el contexto
    setMensaje("Perfil actualizado correctamente.");
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="d-flex align-items-center gap-3 mb-3">
          {/* Avatar genérico: círculo con la inicial del nombre */}
          <div className="avatar">{usuario.nombre.charAt(0).toUpperCase()}</div>
          <div>
            <h1 className="h3 mb-0">Mi perfil</h1>
            <span className="badge bg-primary">{usuario.rol}</span>
          </div>
        </div>

        <Mensaje tipo="success" texto={mensaje} />

        <form onSubmit={guardar} noValidate>
          <div className="row">
            <div className="col-12 col-md-6">
              <CampoFormulario id="perfilNombre" etiqueta="Nombre" valor={nombre} onCambio={setNombre} error={errores.nombre} />
            </div>
            <div className="col-12 col-md-6">
              <CampoFormulario id="perfilApellidos" etiqueta="Apellidos" valor={apellidos} onCambio={setApellidos} error={errores.apellidos} />
            </div>
            <div className="col-12 col-md-6">
              <CampoFormulario id="perfilFecha" etiqueta="Fecha de nacimiento" tipo="date" valor={fechaNacimiento} onCambio={setFechaNacimiento} error={errores.fechaNacimiento} />
            </div>
            <div className="col-12 col-md-6">
              {/* La edad no se escribe: se calcula con la fecha */}
              <CampoFormulario id="perfilEdad" etiqueta="Edad" valor={fechaNacimiento ? String(calcularEdad(fechaNacimiento)) : ""} onCambio={() => {}} deshabilitado />
            </div>
            <div className="col-12 col-md-6">
              <CampoFormulario id="perfilCorreo" etiqueta="Correo" tipo="email" valor={correo} onCambio={setCorreo} error={errores.correo} />
            </div>
            <div className="col-12 col-md-6">
              <CampoFormulario id="perfilRegion" etiqueta="Región" valor={region} onCambio={setRegion} opciones={regiones.map((r) => ({ valor: r, texto: r }))} error={errores.region} />
            </div>
            <div className="col-12 col-md-6">
              <CampoFormulario id="perfilDireccion" etiqueta="Dirección" valor={direccion} onCambio={setDireccion} error={errores.direccion} />
            </div>
            <div className="col-12 col-md-6">
              <CampoFormulario id="perfilRol" etiqueta="Rol (no editable)" valor={usuario.rol} onCambio={() => {}} deshabilitado />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
};
