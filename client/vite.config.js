import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  plugins: [react()],
  // define: {
  //   "process.env": process.env,
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: process.env.CLIENT_PORT,
    proxy: {
      "/api": {
        target: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`, // Replace with your backend URL
        changeOrigin: true,
        secure: false,
      },
      "/public": {
        target: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`, // Replace with your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
