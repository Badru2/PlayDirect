/** @type {import('tailwindcss').Config} */
import { addIconSelectors } from "@iconify/tailwind";
import daisyui from "daisyui";

module.exports = {
  content: [
    "./src/*.jsx",
    "./src/**/*.jsx",
    "./public/css/*.css",
    "*.html",
    "./node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui, addIconSelectors()],
  daisyui: {
    themes: [],
  },
  darkMode: "class",
};
