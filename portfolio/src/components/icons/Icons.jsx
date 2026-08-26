/* ============================================================
   ИКОНКИ
   ============================================================
   Мелкие значки, которые используются в разных местах сайта.
   Нарисованы кодом — остаются чёткими на любом экране.
   ============================================================ */

/* ------------------------------------------------------------
   ЛОГОТИП — ЧЕТЫРЁХКОНЕЧНАЯ ИСКРА
   ------------------------------------------------------------
   Контур строго симметричен: острия смотрят ровно вверх, вниз,
   влево и вправо, центр фигуры совпадает с центром квадрата
   24×24. Между остриями стороны вогнуты внутрь — за счёт этого
   лучи выглядят острыми.

   Эта же форма используется в курсоре мыши, поэтому вынесена
   в отдельную переменную: правите здесь — меняется везде.
   ------------------------------------------------------------ */
export const SPARKLE_PATH =
  "M12 0 C 12.6 6.4 17.6 11.4 24 12 C 17.6 12.6 12.6 17.6 12 24 C 11.4 17.6 6.4 12.6 0 12 C 6.4 11.4 11.4 6.4 12 0 Z";

export function LogoMark({ size = 26, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={SPARKLE_PATH} fill={color} />
    </svg>
  );
}

/* Telegram */
export function TelegramIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M21.9 4.3 18.9 19c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.25.25-.45.45-.9.45l.3-4.6L18.3 6c.36-.32-.08-.5-.56-.18L6.4 12.9l-4.5-1.4c-1-.3-1-1 .2-1.5l17.6-6.8c.8-.3 1.5.2 1.2 1.1z"
        fill={color}
      />
    </svg>
  );
}

/* Стрелка вправо — в кнопках «перейти» */
export function ArrowIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13M12 5l7 7-7 7" />
    </svg>
  );
}

/* Крестик — закрыть окно */
export function CloseIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

/* Галочка — подтверждённая гипотеза, пункты результата */
export function CheckIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12.5l5.5 5.5L20 6.5" />
    </svg>
  );
}

/* Бургер-меню и его закрытое состояние (для телефона).
   open = true — вместо трёх полосок показывается крестик */
export function BurgerIcon({ open = false, size = 22, color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M5 5l14 14" />
          <path d="M19 5L5 19" />
        </>
      ) : (
        <>
          <path d="M3 7h18" />
          <path d="M3 12h18" />
          <path d="M3 17h18" />
        </>
      )}
    </svg>
  );
}
