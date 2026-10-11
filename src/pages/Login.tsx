// Inicio de sesión. Toda la lógica (intentos, bloqueo) está en SesionContext.
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSesion } from "../context/SesionContext";
import { validarCorreo, DOMINIOS_GENERALES } from "../services/validaciones";
import { CampoFormulario } from "../components/CampoFormulario";
import { Mensaje } from "../components/Mensaje";

export const Login = () => {
  const { iniciarSesion } = useSesion();
  const navigate = useNavigate(); // sirve para cambiar de página desde el código

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const enviar = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const correoLimpio = correo.trim().toLowerCase();

    // Validaciones básicas antes de revisar las credenciales.
    const eCorreo = validarCorreo(correoLimpio, DOMINIOS_GENERALES) ? "" : "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).";
    const ePassword = password ? "" : "Ingresa tu contraseña.";
    setErrorCorreo(eCorreo);
    setErrorPassword(ePassword);
    if (eCorreo || ePassword) return;

    const error = iniciarSesion(correoLimpio, password);
    if (error) {
      setMensaje(error);
    } else {
      navigate("/"); // login correcto: vamos al inicio
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <h1 className="h3 mb-3">Ingresar</h1>
        <Mensaje tipo="danger" texto={mensaje} />
        <form onSubmit={enviar} noValidate>
          <CampoFormulario id="loginCorreo" etiqueta="Correo" tipo="email" valor={correo} onCambio={setCorreo} error={errorCorreo} />
          <CampoFormulario id="loginPassword" etiqueta="Contraseña" tipo="password" valor={password} onCambio={setPassword} error={errorPassword} />
          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>
        <p className="mt-3">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      </div>
    </div>
  );
};
