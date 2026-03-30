import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>
);

// Enhanced Service Worker registration with update handling
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js?t=" + new Date().getTime(), {
        scope: "/",
      });

      console.log("Service Worker registered successfully:", registration);

      // Listen for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New service worker available, show update notification
              console.log("New service worker available, ready to update");
              
              // Optionally show a toast or notification to user
              if ("serviceWorker" in navigator && registration.waiting) {
                console.log("Update available");
                // You can dispatch a custom event here for UI notification
                window.dispatchEvent(
                  new CustomEvent("sw-update-available", {
                    detail: { registration },
                  })
                );
              }
            }
          });
        }
      });

      // Handle controller change (when new SW takes over)
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}

