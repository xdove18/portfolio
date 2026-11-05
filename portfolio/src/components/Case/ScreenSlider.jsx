import { useRef, useState } from "react";
import { thumb } from "./imagePath";
import s from "./Case.module.css";

/* ============================================================
   СЛАЙДЕР ЭКРАНОВ
   ============================================================
   Показывает экраны по одному, с перелистыванием.

   Зачем нужен. Обычная галерея ставит все экраны подряд, и
   группа из трёх широких снимков растягивается на три экрана
   прокрутки. Для главного в кейсе это правильно, а для
   второстепенного — нет: например, старая система, с которой
   кейс спорит, важна, но занимать треть страницы не должна.

   Включается полем slider: true у группы экранов
   в src/data/projects.js.

   Как устроено листание. Лента прокручивается вбок средствами
   самого браузера (scroll-snap в стилях), поэтому на телефоне
   работает привычный смахивающий жест, а на компьютере —
   стрелки и точки под лентой. Своей анимации мы не пишем.
   ============================================================ */
export default function ScreenSlider({ group, alt, onOpen }) {
  const лента = useRef(null);
  const [текущий, setТекущий] = useState(0);

  const всего = group.screens.length;

  /* Прокрутить ленту к экрану под номером. Ширина одного
     экрана равна ширине самой ленты, поэтому сдвиг — это
     просто номер, умноженный на ширину. */
  const листатьК = (номер) => {
    const узел = лента.current;
    if (!узел) return;
    const куда = Math.max(0, Math.min(всего - 1, номер));
    узел.scrollTo({ left: узел.clientWidth * куда, behavior: "smooth" });
  };

  /* Человек мог пролистнуть пальцем, а не кнопкой — узнаём
     текущий экран из положения прокрутки. */
  const приПрокрутке = () => {
    const узел = лента.current;
    if (!узел) return;
    const номер = Math.round(узел.scrollLeft / узел.clientWidth);
    if (номер !== текущий) setТекущий(номер);
  };

  return (
    <div className={s.slider}>
      <div
        className={s.sliderTrack}
        ref={лента}
        onScroll={приПрокрутке}
        /* tabIndex нужен, чтобы ленту можно было листать
           стрелками с клавиатуры */
        tabIndex={0}
        role="group"
        aria-label={alt || "Экраны"}
      >
        {group.screens.map((src, i) => (
          <button
            key={src}
            className={s.sliderSlide}
            onClick={() => onOpen(i)}
            aria-label={`Открыть экран ${i + 1} из ${всего}`}
            data-cursor="image"
          >
            <img
              src={thumb(src)}
              alt={i === 0 ? alt : ""}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Управление появляется, только если листать есть что */}
      {всего > 1 && (
        <div className={s.sliderBar}>
          <button
            className={s.sliderArrow}
            onClick={() => листатьК(текущий - 1)}
            disabled={текущий === 0}
            aria-label="Предыдущий экран"
          >
            ←
          </button>

          <div className={s.sliderDots}>
            {group.screens.map((src, i) => (
              <button
                key={src}
                className={`${s.sliderDot} ${
                  i === текущий ? s.sliderDotActive : ""
                }`}
                onClick={() => листатьК(i)}
                aria-label={`Экран ${i + 1}`}
                aria-current={i === текущий}
              />
            ))}
          </div>

          <button
            className={s.sliderArrow}
            onClick={() => листатьК(текущий + 1)}
            disabled={текущий === всего - 1}
            aria-label="Следующий экран"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
