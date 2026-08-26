import { useEffect, useState } from "react";
import { SPARKLE_PATH } from "../icons/Icons";
import RichText from "./RichText";
import s from "./Case.module.css";

/* ============================================================
   ГИПОТЕЗЫ
   ============================================================
   Показывает гипотезы широкими карточками. Если их больше, чем
   помещается на экран, появляются стрелки для перелистывания.

   Сколько карточек видно одновременно:
   • широкий экран — 2
   • планшет и телефон — 1

   Стрелки оформлены в стиле логотипа: круглая кнопка с искрой,
   которая раскручивается при наведении.
   ============================================================ */

export default function Hypotheses({ items, color }) {
  // Номер первой видимой карточки
  const [start, setStart] = useState(0);
  // Сколько карточек помещается сейчас
  const [perView, setPerView] = useState(2);

  /* Следим за шириной экрана: на узком показываем по одной */
  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const update = () => setPerView(media.matches ? 1 : 2);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  /* Если после смены размера окна текущая позиция вышла
     за границу списка — подтягиваем её обратно */
  useEffect(() => {
    const maxStart = Math.max(0, items.length - perView);
    setStart((current) => Math.min(current, maxStart));
  }, [perView, items.length]);

  if (!items || items.length === 0) return null;

  const maxStart = Math.max(0, items.length - perView);
  const needsArrows = items.length > perView;
  const visible = items.slice(start, start + perView);

  return (
    <div className={s.hypoBlock}>
      {/* Шапка: счётчик и стрелки */}
      {needsArrows && (
        <div className={s.hypoNav}>
          <span className={s.hypoCounter}>
            {start + 1}
            {perView > 1 && visible.length > 1 ? `–${start + visible.length}` : ""}
            {" из "}
            {items.length}
          </span>

          <div className={s.hypoArrows}>
            <ArrowButton
              direction="prev"
              disabled={start === 0}
              onClick={() => setStart((v) => Math.max(0, v - 1))}
            />
            <ArrowButton
              direction="next"
              disabled={start >= maxStart}
              onClick={() => setStart((v) => Math.min(maxStart, v + 1))}
            />
          </div>
        </div>
      )}

      {/* Сами карточки */}
      <div
        className={s.hypotheses}
        style={{ "--per-view": perView }}
      >
        {visible.map((item, i) => {
          const number = start + i + 1;
          const rejected = item.status === "rejected";

          return (
            <article className={s.hypothesis} key={number}>
              <p className={s.hypothesisNumber}>гипотеза {number}</p>

              <p className={s.hypothesisText}>{item.text}</p>

              <div
                className={`${s.hypothesisResult} ${
                  rejected ? s.hypothesisRejected : s.hypothesisConfirmed
                }`}
              >
                {/* Рядом со статусом стоит значок, а не только цвет —
                    чтобы смысл читался и при дальтонизме */}
                <span className={s.hypothesisStatus}>
                  {rejected ? "✗ опровергнута" : "✓ подтверждена"}
                </span>
                <p>
                  <RichText>{item.conclusion}</RichText>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Точки-указатели: сколько всего экранов и где мы сейчас */}
      {needsArrows && (
        <div className={s.hypoDots} aria-hidden="true">
          {Array.from({ length: maxStart + 1 }, (_, i) => (
            <span
              key={i}
              className={`${s.hypoDot} ${i === start ? s.hypoDotActive : ""}`}
              style={i === start ? { background: color } : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   КНОПКА-СТРЕЛКА В СТИЛЕ ЛОГОТИПА
   ------------------------------------------------------------
   Круг, внутри искра из логотипа и шеврон-указатель.
   При наведении искра раскручивается.
   ------------------------------------------------------------ */
function ArrowButton({ direction, disabled, onClick }) {
  const isNext = direction === "next";

  return (
    <button
      className={s.hypoArrow}
      onClick={onClick}
      disabled={disabled}
      aria-label={isNext ? "Следующая гипотеза" : "Предыдущая гипотеза"}
    >
      {/* Искра — фирменная деталь, крутится при наведении */}
      <svg className={s.hypoArrowSpark} viewBox="0 0 24 24" aria-hidden="true">
        <path d={SPARKLE_PATH} />
      </svg>

      {/* Шеврон показывает направление */}
      <svg
        className={s.hypoArrowChevron}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={isNext ? "M10 6l6 6-6 6" : "M14 6l-6 6 6 6"}
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
