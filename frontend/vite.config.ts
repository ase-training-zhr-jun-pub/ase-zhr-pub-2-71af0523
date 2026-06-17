import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const PORT = parseInt(process.env.PORT ?? "5174")
const proxyUri = process.env.VSCODE_PROXY_URI
const base = proxyUri
  ? new URL(proxyUri.replace("{{port}}", String(PORT))).pathname
  : "/"

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    {
      // The crucible proxy strips the base-path prefix before forwarding to localhost.
      // Vite would redirect GET / → base, but the proxy strips that again → infinite loop.
      // This middleware rewrites incoming requests to include the base prefix so Vite
      // serves directly without redirecting.
      name: "proxy-base-rewrite",
      configureServer(server) {
        if (base === "/") return
        server.middlewares.use((req, _res, next) => {
          if (!req.url?.startsWith(base)) {
            const stripped = (req.url ?? "/").replace(/^\//, "")
            req.url = base + stripped
          }
          next()
        })
      },
    },
  ],
  server: {
    host: "0.0.0.0",
    port: PORT,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
