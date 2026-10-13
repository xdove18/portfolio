import { useEffect, useState } from "react";
import s from "./ThemeToggle.module.css";

/* ============================================================
   ПЕРЕКЛЮЧАТЕЛЬ СВЕТЛОЙ И ТЁМНОЙ ТЕМЫ
   ============================================================
   Кнопка ставит на страницу пометку data-theme="light" или
   "dark". Всё остальное делает файл src/styles/variables.css:
   там для каждой пометки записан свой набор цветов.

   Выбор запоминается в браузере и переживает закрытие вкладки.
   Если человек ничего не выбирал, берётся настройка системы.

   Чтобы сайт не моргал светлой темой при загрузке, пометка
   ставится ещё до отрисовки — маленьким кодом в index.html.
   ============================================================ */

/* Под каким именем браузер хранит выбор */
const КЛЮЧ = "theme";

function системная() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [тема, setТема] = useState("light");

  // Узнаём, какая тема стоит сейчас
  useEffect(() => {
    const сохранённая = localStorage.getItem(КЛЮЧ);
    setТема(сохранённая || системная());
  }, []);

  function переключить() {
    const новая = тема === "dark" ? "light" : "dark";
    setТема(новая);
    document.documentElement.dataset.theme = новая;

    /* localStorage — долгая память браузера. Оборачиваем
       в try: в режиме инкогнито запись может быть запрещена,
       и без этого переключатель сломался бы целиком. */
    try {
      localStorage.setItem(КЛЮЧ, новая);
    } catch {
      /* не смогли запомнить — тема всё равно переключилась */
    }
  }

  const тёмная = тема === "dark";

  return (
    <button
      type="button"
      className={s.toggle}
      onClick={переключить}
      aria-label={тёмная ? "Включить светлую тему" : "Включить тёмную тему"}
      title={тёмная ? "Светлая тема" : "Тёмная тема"}
    >
      {/* Два значка лежат друг на друге: видный уезжает вверх,
          следующий приезжает снизу */}
      <span className={`${s.icon} ${тёмная ? s.iconOff : ""}`}>
        <Луна />
      </span>
      <span className={`${s.icon} ${тёмная ? "" : s.iconOff}`}>
        <Солнце />
      </span>
    </button>
  );
}

function Луна() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M13.5 10.2A6 6 0 0 1 5.8 2.5a6 6 0 1 0 7.7 7.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Солнце() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="3.2" fill="currentColor" />
      <g
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1" />
        <path d="M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2L3.1 3.1" />
      </g>
    </svg>
  );
}
