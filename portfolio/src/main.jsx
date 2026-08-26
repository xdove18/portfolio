import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// Порядок подключения стилей важен:
// сначала переменные (цвета и размеры), потом всё остальное.
import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/animations.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter включает адреса страниц вида /projects/smart-size */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
