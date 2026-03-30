import { defineConfig } from "vite";
import { miaodaDevPlugin } from "miaoda-sc-plugin";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    miaodaDevPlugin(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "offlineCache",
              expiration: {
                maxEntries: 200,
              },
            },
          },
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
      includeAssets: ["favicon.png"],
      manifest: {
        name: "Todify - Modern Todo List",
        short_name: "Todify",
        description: "A modern, minimalist PWA todo list application with offline support, drag-and-drop, and priority management.",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        categories: ["productivity", "utilities"],
        screenshots: [
          {
            src: "/favicon.png",
            sizes: "192x192",
            form_factor: "narrow",
            type: "image/png",
          },
          {
            src: "/favicon.png",
            sizes: "512x512",
            form_factor: "wide",
            type: "image/png",
          },
        ],
        icons: [
          {
            src: "favicon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "favicon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Add New Task",
            short_name: "New Task",
            description: "Quickly add a new todo item",
            url: "/?action=add",
            icons: [
              {
                src: "/favicon.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "View Tasks",
            short_name: "Tasks",
            description: "View all your tasks",
            url: "/",
            icons: [
              {
                src: "/favicon.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
