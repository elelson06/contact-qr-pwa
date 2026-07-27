import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "src/core"),
      "@features": path.resolve(__dirname, "src/features"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  plugins: [
    VitePWA({
      registerType: "prompt",
      injectRegister: false, // registramos el SW manualmente en main.ts para controlar el flujo de confirmación
      manifest: false, // usamos public/manifest.json escrito a mano (más control sobre íconos/colores)
      workbox: {
        // skipWaiting queda en false (default): la nueva versión NO toma
        // control automáticamente. Solo se activa cuando el usuario
        // confirma "Actualizar" en el banner (ver src/main.ts).
        clientsClaim: true, // una vez que el usuario confirma, la nueva versión controla la página sin necesitar otra navegación
        cleanupOutdatedCaches: true, // borra automáticamente los archivos cacheados de versiones anteriores
        // Cache-first: la app carga instantánea offline; solo revalida en segundo plano
        globPatterns: ["**/*.{js,css,html,svg,png,ico,json}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "document" ||
              request.destination === "script" ||
              request.destination === "style",
            handler: "CacheFirst",
            options: { cacheName: "app-shell-cache" },
          },
        ],
      },
    }),
  ],
});
