import s from "./Case.module.css";

/* ============================================================
   СРАВНЕНИЕ ПУТИ «БЫЛО — СТАЛО»
   ============================================================
   Две колонки рядом: слева старый путь пользователя,
   справа новый. У шагов старого пути можно показать процент
   отвала — тогда сразу видно, где люди уходили.

   Как описать в src/data/projects.js:

   flowCompare: {
     note: "5 шагов → 3 шага",
     before: {
       title: "Было — 5 шагов",
       steps: [
         { label: "Контактные данные", drop: "−22%" },
         { label: "Адрес доставки", drop: "−20%" },
       ],
     },
     after: {
       title: "Стало — 3 шага",
       steps: [{ label: "Контакты и адрес" }],
     },
   }
   ============================================================ */

export default function FlowCompare({ data, accent, accentDeep }) {
  if (!data) return null;

  return (
    <div className={s.compare}>
      <FlowColumn column={data.before} tone="before" />
      <FlowColumn column={data.after} tone="after" accent={accent} />

      {data.note && (
        <p className={s.compareNote} style={{ color: accentDeep || accent }}>
          {data.note}
        </p>
      )}
    </div>
  );
}

function FlowColumn({ column, tone, accent }) {
  if (!column) return null;

  const isAfter = tone === "after";

  return (
    <div className={`${s.compareCol} ${isAfter ? s.compareColAfter : ""}`}>
      <h4 className={s.compareTitle}>{column.title}</h4>

      <ol className={s.compareSteps}>
        {column.steps.map((step, i) => (
          <li className={s.compareStep} key={i}>
            <span
              className={s.compareDot}
              style={isAfter && accent ? { background: accent } : undefined}
            />

            <span className={s.compareLabel}>{step.label}</span>

            {/* Процент отвала показываем только там, где он указан */}
            {step.drop && <span className={s.compareDrop}>{step.drop}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
