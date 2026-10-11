// Contacto: mapa con la ubicación y formulario de consulta (se guarda en LocalStorage).
import { useState } from "react";
import { obtenerConsultas, guardarConsultas } from "../services/storage";
import { validarCorreo, DOMINIOS_GENERALES } from "../services/validaciones";
import { CampoFormulario } from "../components/CampoFormulario";
import { Mensaje } from "../components/Mensaje";

export const Contacto = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [texto, setTexto] = useState("");
  const [errores, setErrores] = useState({ nombre: "", correo: "", texto: "" });
  const [mensaje, setMensaje] = useState("");

  const enviar = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevos = {
      nombre: nombre.trim() ? "" : "El nombre es obligatorio.",
      correo: validarCorreo(correo.trim().toLowerCase(), DOMINIOS_GENERALES) ? "" : "Ingresa un correo válido.",
      texto: texto.trim().length >= 10 ? "" : "El mensaje debe tener al menos 10 caracteres.",
    };
    setErrores(nuevos);
    if (nuevos.nombre || nuevos.correo || nuevos.texto) {
      setMensaje("");
      return;
    }

    guardarConsultas([
      ...obtenerConsultas(),
      { id: Date.now(), nombre: nombre.trim(), correo: correo.trim().toLowerCase(), mensaje: texto.trim(), fecha: new Date().toLocaleString("es-CL") },
    ]);
    setMensaje("¡Gracias! Recibimos tu consulta.");
    setNombre("");
    setCorreo("");
    setTexto("");
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-6">
        <h1 className="h3 mb-3">Contacto</h1>
        <Mensaje tipo="success" texto={mensaje} />
        <form onSubmit={enviar} noValidate>
          <CampoFormulario id="contactoNombre" etiqueta="Nombre" valor={nombre} onCambio={setNombre} error={errores.nombre} />
          <CampoFormulario id="contactoCorreo" etiqueta="Correo" tipo="email" valor={correo} onCambio={setCorreo} error={errores.correo} />
          <CampoFormulario id="contactoMensaje" etiqueta="Mensaje" tipo="textarea" valor={texto} onCambio={setTexto} error={errores.texto} />
          <button type="submit" className="btn btn-primary">Enviar consulta</button>
        </form>
      </div>
      <div className="col-12 col-lg-6">
        <h2 className="h5">Nuestra ubicación</h2>
        <div className="ratio ratio-4x3">
          <iframe
            title="Mapa de la distribuidora en Chillán"
            src="https://www.google.com/maps?q=Chill%C3%A1n,%20Chile&output=embed"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
