# Gas El Volcán – Tienda (DSY1104)

Frontend en React + TypeScript + Vite + Bootstrap 5 + React Router, conectado con Axios
al backend Spring Boot ([backendTiendaGas](https://github.com/natyleiv/backendTiendaGas)).
Los datos (productos, categorías, usuarios, compras y consultas) se guardan en MySQL a través de la API REST.

## Cómo ejecutarlo

1. Encender MySQL (XAMPP) y levantar el backend (ver el README del backend). La API queda en `http://localhost:8080/api/v1`.
2. En esta carpeta:

```
npm install
npm run dev
```

3. Abrir http://localhost:5173/

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@duoc.cl | admin123 |
| Vendedor | vendedor@duoc.cl | vende123 |
| Cliente | cliente@duoc.cl | cliente123 |

Cupones: `GASVOLCAN10` (10%) y `BIENVENIDO5` (5%).

## Sesión y seguridad

- Al iniciar sesión el backend entrega un **token JWT** (30 min) y un **refreshToken** (7 días).
- Se guardan en LocalStorage (`tiendaGas.token`, `tiendaGas.refreshToken`, `tiendaGas.usuario`) para que la sesión no se pierda al recargar.
- `src/api/axiosConfig.ts` agrega el header `Authorization: Bearer <token>` a cada petición. Si el token vence (401), pide uno nuevo con el refreshToken y repite la petición; si no se puede, cierra la sesión.
- "Salir" borra el token y los datos del usuario.
- Las rutas por rol (`RutaProtegida`) solo ocultan pantallas: la seguridad real la aplica el backend.
- El carrito sigue en LocalStorage hasta confirmar la compra (`POST /boletas`).

## Estructura (carpeta `src/`)

- `api/` configuración de Axios (URL base, token e interceptores)
- `services/` llamadas a la API por recurso (`authService`, `productoService`, `usuarioService`, `boletaService`, `consultaService`), sesión, carrito, validaciones y cálculo de totales
- `types/` interfaces de TypeScript (Producto, Usuario, Boleta…)
- `data/` regiones y cupones
- `context/` sesión y carrito, compartidos con `useContext`
- `components/` piezas reutilizables (tarjetas, formularios, tablas, menú, spinner)
- `pages/` una por cada pantalla de la aplicación
- `styles/` estilos propios mínimos (el resto es Bootstrap)
