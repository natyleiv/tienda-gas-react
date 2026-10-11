import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";
import App from "./App.tsx";
import { SesionProvider } from "./context/SesionContext";
import { CarritoProvider } from "./context/CarritoContext";

// Los Provider "envuelven" la App para que todos los componentes puedan usar
// la sesión y el carrito.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>,
);
