/* ============================================================
   ЛОГОТИПЫ ПРОГРАММ ДЛЯ РАЗДЕЛА «СТЕК»
   ============================================================
   Каждая иконка нарисована кодом. Обычно она серая, а при
   наведении на плитку становится фирменного цвета программы.

   За переключение цвета отвечает CSS, здесь только форма.

   Чтобы добавить новую программу:
   1. допишите иконку в список ICONS ниже;
   2. укажите её название в файле src/data/stack.js.
   ============================================================ */

const ICONS = {
  figma: (
    <>
      <path d="M8 3h4v6H8a3 3 0 1 1 0-6z" />
      <path d="M12 3h4a3 3 0 1 1 0 6h-4z" />
      <path d="M8 9h4v6H8a3 3 0 1 1 0-6z" />
      <path d="M8 15h4v3a3 3 0 1 1-4-3z" />
      <circle cx="16" cy="12" r="3" />
    </>
  ),
  protopie: (
    <>
      <path d="M4 17 12 4l8 13z" />
      <path d="M4 17h16l-4 4H8z" opacity="0.55" />
    </>
  ),
  principle: (
    <>
      <path d="M7 21V7a4 4 0 0 1 4-4h2a5 5 0 0 1 0 10h-3" />
    </>
  ),
  illustrator: <IconLetters text="Ai" />,
  photoshop: <IconLetters text="Ps" />,
  aftereffects: <IconLetters text="Ae" />,
  lyssna: (
    <>
      <path d="M3 16c0-5 1.6-9 3.2-9S9.4 11 9.4 16s1.6 5 3.2 0 1.6-9 3.2-9S19 11 19 16" />
    </>
  ),
  amplitude: (
    <>
      <path d="M3 17c3.5 0 4.5-11 8-11s4.5 11 8 11" />
      <path d="M3 17h18" opacity="0.4" />
    </>
  ),
  claude: (
    <>
      <path d="M6 18 11 6h2l5 12h-2.4l-1.1-2.8H9.5L8.4 18z" />
      <path d="M10.2 13.4h3.6L12 8.6z" fill="#fff" stroke="none" />
    </>
  ),
};

/* Иконки-буквы для продуктов Adobe: квадрат со скруглением + текст */
function IconLetters({ text }) {
  return (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" />
      <text
        x="12"
        y="16.2"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="var(--font)"
      >
        {text}
      </text>
    </>
  );
}

export default function StackIcon({ name, size = 34 }) {
  const shape = ICONS[name];

  // Если иконки с таким названием нет — рисуем кружок с первой буквой.
  // Так сайт не сломается из-за опечатки в файле stack.js.
  if (!shape) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="currentColor"
        >
          {(name || "?").charAt(0).toUpperCase()}
        </text>
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
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shape}
    </svg>
  );
}
