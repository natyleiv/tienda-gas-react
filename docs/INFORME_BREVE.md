# Informe breve – Migración de la tienda a React

**Asignatura:** DSY1104 – Desarrollo FullStack II · **Evaluación Parcial 2**
**Proyecto:** Tienda de la Distribuidora de Gas El Volcán

## 1. Migración
La tienda de la Evaluación 1 (HTML, CSS y JavaScript) se reconstruyó con React, TypeScript, Vite y Bootstrap 5. Cada página HTML pasó a ser una página React dentro de `src/pages/`, y las partes que se repetían (menú, pie de página, tarjetas de producto, formularios) pasaron a componentes dentro de `src/components/`. La navegación usa React Router (`Routes`, `Route`, `Link`, `useParams`, `useNavigate`).

Se conservaron las reglas de negocio de la Evaluación 1: registro con RUN validado (módulo 11) y correo @duoc.cl, contraseña de 4 a 10 caracteres, bloqueo de cuenta a los 3 intentos fallidos, filtros de catálogo por categoría y precio, control de stock, cupones de descuento, descuento de stock al comprar y formulario de contacto con mapa.

## 2. Organización del proyecto
| Carpeta | Contenido |
|---|---|
| `types/` | Interfaces (`Producto`, `Usuario`, `Rol`, `Pedido`…) |
| `data/` | Datos iniciales |
| `services/` | Lectura/escritura en LocalStorage, validaciones y reglas de compra |
| `context/` | `SesionContext` (usuario actual) y `CarritoContext` (carrito) |
| `components/` | Componentes reutilizables |
| `pages/` | Pantallas |

Decisiones principales:
- **Estado compartido con Context:** la sesión y el carrito los necesitan componentes alejados entre sí (menú, tarjetas, páginas), igual que el `PerfilContext` visto en clases.
- **Estado local en las páginas:** listas y formularios guardan su estado con `useState` y, al cambiar, también lo escriben en LocalStorage.
- **Un formulario, varios usos:** `FormularioUsuario` sirve para el registro y para la administración; `CampoFormulario` es el campo de todos los formularios.
- **Un componente por responsabilidad:** `ProductoCard` muestra un producto; `ProductosLista` muestra la grilla y se usa en Inicio y Catálogo.

## 3. Roles y permisos
| Rol | Puede |
|---|---|
| Administrador | CRUD de usuarios (asigna cualquier rol), productos y categorías; desbloquear cuentas |
| Vendedor | Consultar productos y modificar su stock; crear usuarios solo con rol cliente |
| Cliente | Usar la tienda |
| Todos | Navegar, comprar y editar su propio perfil (sin cambiar el rol) |

El registro público crea siempre cuentas de cliente. Las rutas de administración se protegen con `RutaProtegida`, y el menú muestra solo las opciones del rol. Esto es una simulación académica: no es seguridad real.

## 4. Persistencia
Se usa LocalStorage con una clave por colección (`tiendaGas.productos`, `tiendaGas.usuarios`, etc.). Al comprar se descuenta el stock y se guarda el pedido; al eliminar una categoría se revisa que no tenga productos.

## 5. Interfaz y responsividad
Bootstrap 5 con grilla (`row`, `col-12 col-md-6 col-lg-4`), tablas con `table-responsive`, menú que se contrae en pantallas pequeñas y formularios con `form-control` / `form-select`.

## 6. Diferencias con la Evaluación 1
- No se guardan las contraseñas codificadas: siguen el ejemplo del profesor (texto plano, solo para simulación).
- Se reemplaza "región y comuna" por "región" (lo que pide el perfil de esta evaluación).
- No hay historial de pedidos en pantalla (los pedidos sí se guardan).
