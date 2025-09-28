import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/weather-app-challenge/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', "icons/*.svg"],
      manifestFilename: 'manifest.webmanifest',
      manifest: {
        name: "Weather App Challenge",
        short_name: "WeatherApp",
        description: "Weather App Challenge Solution by Sumaiya Kawsar",
        theme_color: "#1e1e1e",
        background_color: "#ffffff",
        display: 'standalone',
        start_url: '/weather-app-challenge/',
        icons: [
          {
            src: "icons/favicon.svg",
            sizes: "40x40",
            type: "image/svg+xml"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
