// Registro público: el backend siempre crea la cuenta con rol CLIENTE.
import { useState } from "react";
import { useNavigate } from "react-router";
import type { DatosUsuario } from "../types/Usuario";
import { registrar } from "../services/authService";
import { mensajeError } from "../api/axiosConfig";
import { DOMINIOS_REGISTRO } from "../services/validaciones";
import { FormularioUsuario } from "../components/FormularioUsuario";
import { Mensaje } from "../components/Mensaje";

export const Registro = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Devuelve true si se guardó (así el formulario sabe si puede limpiarse).
  const guardar = async (datos: DatosUsuario) => {
    try {
      await registrar(datos);
      alert("Cuenta creada. Ya puedes iniciar sesión.");
      navigate("/login");
      return true;
    } catch (e) {
      setError(mensajeError(e)); // ej: "Ese correo ya está registrado"
      return false;
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <h1 className="h3 mb-3">Crear cuenta</h1>
        <p className="text-muted">Solo se aceptan correos @duoc.cl.</p>
        <Mensaje tipo="danger" texto={error} />
        <FormularioUsuario
          rolesDisponibles={["CLIENTE"]}
          dominios={DOMINIOS_REGISTRO}
          textoBoton="Registrarme"
          onGuardar={guardar}
        />
      </div>
    </div>
  );
};
