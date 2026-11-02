import { fixHangingWordsDeep } from "../utils/typography";

/* ============================================================
   СТЕК ТЕХНОЛОГИЙ
   ============================================================
   name  — название программы. На сайте показываются только
           названия, одной строкой в разделе «о себе».

   desc и icon остались от прошлой версии сайта, где стек
   показывался плашками с иконками. Сейчас они никуда
   не выводятся — можно заполнять, а можно не трогать.
   ============================================================ */

const список = [
  { name: "Figma", desc: "Продуктовый дизайн, UX/UI", icon: "figma" },
  { name: "Protopie", desc: "Интерактивное прототипирование", icon: "protopie" },
  { name: "Miro", desc: "Исследования, CJM, воркшопы", icon: "miro" },
  { name: "Illustrator", desc: "Векторная графика", icon: "illustrator" },
  { name: "After Effects", desc: "Motion graphics", icon: "aftereffects" },
  { name: "Lyssna", desc: "User research, интервью", icon: "lyssna" },
  { name: "Claude", desc: "AI-помощник в дизайне", icon: "claude" },
];

/* Тексты прогоняются через типографику: короткие предлоги
   не повисают в конце строки. */
export const stack = fixHangingWordsDeep(список);
