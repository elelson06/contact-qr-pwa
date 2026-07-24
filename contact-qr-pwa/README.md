# Mi Contacto QR (PWA)

Comparte tu contacto acercando la pantalla — sin dictar números, sin internet, sin instalar nada del otro lado.

## Requisitos

- Node.js 18+ (recomendado 20 LTS)
- VSCode

## Setup en VSCode

1. Abre la carpeta del proyecto en VSCode: `code contact-qr-pwa`
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de entorno (no hay secretos, es solo un placeholder para el futuro ID de AdSense):
   ```bash
   cp .env.example .env
   ```
4. Corre el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

## Extensiones de VSCode recomendadas

Al abrir el proyecto, VSCode debería sugerir instalarlas automáticamente (quedaron configuradas en `.vscode/extensions.json`):

- **Tailwind CSS IntelliSense** — autocompletado de clases.
- **ESLint** (opcional, si luego agregamos linting).
- **Vitest** — para correr tests desde el editor.

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción a `dist/` (incluye Service Worker + manifest) |
| `npm run preview` | Sirve el build de producción localmente, para probar el modo offline real |
| `npm run test` | Corre los tests unitarios (Vitest) |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:e2e` | Tests end-to-end (Playwright) — requiere `npx playwright install` la primera vez |

## Notas importantes

- **No hay backend.** Todo el contacto se guarda localmente en IndexedDB del navegador. Cero servidores, cero base de datos externa.
- **Riesgo conocido en iOS/Safari:** WebKit puede borrar el almacenamiento local de una PWA si no se abre en ~7 días (política ITP). Por eso existe el botón "Descargar respaldo (.vcf)" en la pantalla de configuración — genera un archivo `.vcf` real que el usuario puede guardar y reimportar si esto ocurre.
- **"Brillo adaptativo al máximo"** del brief original no es técnicamente posible desde el navegador (no existe API web para controlar el brillo físico de la pantalla). En su lugar, la pantalla de QR usa fondo blanco puro de máximo contraste + Wake Lock API para que la pantalla no se apague mientras se muestra el QR.

## Estructura del proyecto

Ver la explicación completa de carpetas en la conversación donde se diseñó la arquitectura. Resumen rápido:

- `src/core/` → lógica de negocio pura (vCard, storage), sin DOM, 100% testeable.
- `src/features/` → las dos pantallas (configuración y QR).
- `src/shared/` → componentes de UI genéricos y utilidades de navegador (descarga de archivos, Wake Lock).
- `src/app.ts` → router mínimo entre las dos pantallas.

## Desplegar

El proyecto está listo para desplegar en **Vercel** o **Netlify** sin configuración adicional:

```bash
npm run build
```

Sube la carpeta `dist/` o conecta el repo de Git directamente — ambos servicios detectan Vite automáticamente. Recuerda que el Service Worker requiere HTTPS (Vercel/Netlify lo dan gratis).

## Pendientes del plan original

- **Pruebas cross-device reales** (cámara nativa de iPhone/Android escaneando el QR) — requiere dispositivos físicos, no se puede automatizar completamente.
- **Integración de Google AdSense** — hay un placeholder marcado en `src/features/qr-display/QrDisplay.ts` (`#ad-slot-qr-screen`), pero activar AdSense real requiere que el sitio esté en producción con dominio propio primero (Google exige revisión del sitio).
