/* ============================================================
   ИКОНКИ СИЛЬНЫХ СТОРОН
   ============================================================
   Минималистичные значки, нарисованные линиями. Используются
   в разделе «обо мне» вместо эмодзи.

   Чтобы добавить новый значок:
   1. допишите его в список ICONS ниже;
   2. укажите название в src/data/site.js в поле icon.
   ============================================================ */

const ICONS = {
  // Скорость — стрелка вверх в движении
  speed: (
    <>
      <path d="M12 20V6" />
      <path d="M6.5 11.5 12 6l5.5 5.5" />
      <path d="M5 20h3M16 20h3" opacity="0.45" />
    </>
  ),

  // Мультифункциональность — три соединённых узла
  multi: (
    <>
      <circle cx="12" cy="6" r="2.6" />
      <circle cx="6" cy="17" r="2.6" />
      <circle cx="18" cy="17" r="2.6" />
      <path d="M10.6 8.3 7.4 14.7M13.4 8.3l3.2 6.4M8.6 17h6.8" opacity="0.45" />
    </>
  ),

  // Исследование — лупа
  research: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5 20 20" />
    </>
  ),

  // Внимание к деталям — прицел
  focus: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" opacity="0.45" />
    </>
  ),
};

export default function StrengthIcon({ name, size = 24 }) {
  const shape = ICONS[name];

  // Если значка с таким названием нет — рисуем нейтральную точку,
  // чтобы сайт не сломался из-за опечатки
  if (!shape) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.25" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shape}
    </svg>
  );
}
