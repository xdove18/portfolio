import { fixHangingWordsDeep } from "../utils/typography";

/* ============================================================
   СТЕК ТЕХНОЛОГИЙ
   ============================================================
   name  — название программы
   desc  — за что она отвечает (видно при наведении)
   icon  — какая иконка рисуется. Список готовых иконок лежит
           в файле src/components/Stack/StackIcons.jsx
           Если поставить название, которого там нет,
           нарисуется кружок с первой буквой — сайт не сломается.
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
