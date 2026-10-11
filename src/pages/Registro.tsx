// Registro público: siempre crea una cuenta con rol "cliente".
import { useNavigate } from "react-router";
import type { DatosUsuario } from "../types/Usuario";
import { obtenerUsuarios, guardarUsuarios } from "../services/storage";
import { DOMINIOS_REGISTRO } from "../services/validaciones";
import { FormularioUsuario } from "../components/FormularioUsuario";

export const Registro = () => {
  const navigate = useNavigate();

  const registrar = (datos: DatosUsuario) => {
    const nuevo = {
      ...datos,
      rol: "cliente" as const, // aunque alguien cambie el formulario, aquí se fuerza cliente
      id: Date.now(),
      intentosFallidos: 0,
      bloqueado: false,
    };
    guardarUsuarios([...obtenerUsuarios(), nuevo]);
    alert("Cuenta creada. Ya puedes iniciar sesión.");
    navigate("/login");
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <h1 className="h3 mb-3">Crear cuenta</h1>
        <p className="text-muted">Solo se aceptan correos @duoc.cl.</p>
        <FormularioUsuario
          rolesDisponibles={["cliente"]}
          dominios={DOMINIOS_REGISTRO}
          textoBoton="Registrarme"
          onGuardar={registrar}
        />
      </div>
    </div>
  );
};
