import type { Producto } from "../types/Producto";

// Productos iniciales. Dos parten sin stock (0) y dos con stock crítico,
// para poder probar esas reglas.
export const productosIniciales: Producto[] = [
  { id: 1, codigo: "CIL-5", nombre: "Cilindro de Gas 5 kg", categoriaId: 1, precio: 8990, imagen: "/img/cilindro5.jpg", stock: 40, stockCritico: 8, descripcion: "Cilindro de gas licuado de 5 kg, ideal para cocinillas portátiles." },
  { id: 2, codigo: "CIL-11", nombre: "Cilindro de Gas 11 kg", categoriaId: 1, precio: 14990, imagen: "/img/cilindro11.jpg", stock: 60, stockCritico: 10, descripcion: "El formato más usado en los hogares. Rinde para cocina y agua caliente." },
  { id: 3, codigo: "CIL-15", nombre: "Cilindro de Gas 15 kg", categoriaId: 1, precio: 18990, imagen: "/img/cilindro15.jpg", stock: 35, stockCritico: 8, descripcion: "Mayor duración para familias grandes o uso en cocina y calefacción." },
  { id: 4, codigo: "CIL-45", nombre: "Cilindro de Gas 45 kg", categoriaId: 1, precio: 54990, imagen: "/img/cilindro45.jpg", stock: 6, stockCritico: 6, descripcion: "Formato industrial para locales comerciales y restaurantes." },
  { id: 5, codigo: "ACC-REG", nombre: "Regulador de Gas", categoriaId: 2, precio: 6990, imagen: "/img/regulador.jpg", stock: 50, stockCritico: 10, descripcion: "Regulador compatible con cilindros de 5, 11, 15 y 45 kg." },
  { id: 6, codigo: "ACC-MAN", nombre: "Manguera de Gas 1,5 m", categoriaId: 2, precio: 4990, imagen: "/img/manguera.jpg", stock: 45, stockCritico: 10, descripcion: "Manguera flexible reforzada de 1,5 metros." },
  { id: 7, codigo: "ACC-ABR", nombre: "Abrazaderas (par)", categoriaId: 2, precio: 2490, imagen: "/img/abrazadera.jpg", stock: 0, stockCritico: 5, descripcion: "Par de abrazaderas metálicas para asegurar la manguera." },
  { id: 8, codigo: "ACC-DET", nombre: "Detector de Fuga de Gas", categoriaId: 2, precio: 15990, precioOferta: 12990, imagen: "/img/detector.jpg", stock: 20, stockCritico: 4, descripcion: "Alarma sonora que avisa si hay gas en el ambiente." },
  { id: 9, codigo: "ART-COC", nombre: "Cocinilla a Gas 2 Platos", categoriaId: 3, precio: 34990, imagen: "/img/anafe.jpg", stock: 15, stockCritico: 3, descripcion: "Cocinilla de 2 platos con encendido automático." },
  { id: 10, codigo: "ART-CAL", nombre: "Calefont a Gas 5 L", categoriaId: 3, precio: 149990, imagen: "/img/calefont.jpg", stock: 3, stockCritico: 2, descripcion: "Calefont instantáneo de 5 litros por minuto." },
  { id: 11, codigo: "ART-EST", nombre: "Estufa a Gas Catalítica", categoriaId: 3, precio: 69990, imagen: "/img/estufa.jpg", stock: 0, stockCritico: 3, descripcion: "Calefacción silenciosa, sin llama visible." },
  { id: 12, codigo: "ART-ANA", nombre: "Anafe Portátil", categoriaId: 3, precio: 27990, precioOferta: 22990, imagen: "/img/cocinilla.jpg", stock: 22, stockCritico: 5, descripcion: "Anafe compacto, perfecto para camping o como respaldo." },
];
