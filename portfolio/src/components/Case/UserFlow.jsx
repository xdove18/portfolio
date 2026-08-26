import s from "./Case.module.css";

/* ============================================================
   ПУТЬ ПОЛЬЗОВАТЕЛЯ
   ============================================================
   Шаги оформлены как карточки на общей ленте: у каждой свой
   номер, подпись и подпись-роль (начало / шаг / цель).
   Между карточками — тонкие стрелки-шевроны.

   Первый и последний шаги выделены цветом проекта: так сразу
   видно, откуда пользователь приходит и чем всё заканчивается.
   ============================================================ */

export default function UserFlow({ steps, color, colorDeep }) {
  if (!steps || steps.length === 0) return null;

  return (
    <ol className={s.flow}>
      {steps.map((step, i) => {
        const isFirst = i === 0;
        const isLast = i === steps.length - 1;
        const isEdge = isFirst || isLast;

        return (
          <li className={s.flowItem} key={i}>
            <div
              className={`${s.flowCard} ${isEdge ? s.flowCardEdge : ""}`}
              style={
                isEdge
                  ? { background: isLast ? colorDeep || color : color }
                  : undefined
              }
            >
              <span className={s.flowIndex}>
                {/* Номер шага с ведущим нулём: 01, 02, 03… */}
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className={s.flowText}>{step}</span>

              <span className={s.flowRole}>
                {isFirst ? "вход" : isLast ? "цель" : "шаг"}
              </span>
            </div>

            {/* Стрелку не рисуем после последнего шага */}
            {!isLast && (
              <span className={s.flowChevron} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
