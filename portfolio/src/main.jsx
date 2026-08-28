import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// Порядок подключения стилей важен:
// сначала шрифт, потом переменные (цвета и размеры),
// потом всё остальное.
import "./styles/fonts.css";
import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/animations.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter включает адреса страниц вида /projects/smart-size.

        basename — это начало адреса, общее для всех страниц.
        Оно нужно, когда сайт лежит не в корне, а во вложенной
        папке (так работает GitHub Pages). Значение берётся
        из строки BASE в файле vite.config.js — менять здесь
        ничего не нужно. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
