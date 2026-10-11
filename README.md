# Gas El Volcán – Tienda (Evaluación Parcial 2, DSY1104)

React + TypeScript + Vite + Bootstrap 5 + React Router. Persistencia con LocalStorage (simulación académica, sin backend).

## Cómo ejecutarlo

```
npm install
npm run dev
```

Abrir http://localhost:5173/

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@duoc.cl | admin123 |
| Vendedor | vendedor@duoc.cl | vende123 |
| Cliente | cliente@duoc.cl | cliente123 |

Cupones: `GASVOLCAN10` (10%) y `BIENVENIDO5` (5%).

Para reiniciar los datos: DevTools (F12) → Application → Local Storage → borrar las claves `tiendaGas.*`.

## Estructura (carpeta `src/`)

- `types/` interfaces de TypeScript (Producto, Usuario, Pedido…)
- `data/` datos iniciales (productos, categorías, usuarios, regiones, cupones)
- `services/` LocalStorage (`storage.ts`), validaciones y reglas de compra (`tienda.ts`)
- `context/` sesión y carrito, compartidos con `useContext`
- `components/` piezas reutilizables (tarjetas, formularios, tablas, menú)
- `pages/` una por cada pantalla de la aplicación
- `styles/` estilos propios mínimos (el resto es Bootstrap)
