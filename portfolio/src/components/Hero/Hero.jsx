import { useEffect, useState } from "react";
import { site } from "../../data/site";
import useScrollVelocity from "../../hooks/useScrollVelocity";
import DraggableFlower from "./DraggableFlower";
import Flower from "../Flower/Flower";
import s from "./Hero.module.css";

/* ============================================================
   ГЛАВНЫЙ ЭКРАН (HERO)
   ============================================================
   Крупный заголовок, описание и живые цветы вокруг.
   ============================================================ */

/* Расположение цветов.
   x и y — в процентах от блока: x=0 слева, x=100 справа.
   reverse — крутить в обратную сторону.
   floatDelay — сдвиг покачивания, чтобы цветы качались вразнобой. */
const FLOWERS = [
  { color: "var(--flower-red)",    size: 190, x: 2,  y: 74, reverse: false, floatDelay: "0s" },
  { color: "var(--flower-yellow)", size: 150, x: 44, y: 92, reverse: true,  floatDelay: "-1.2s" },
  { color: "var(--flower-pink)",   size: 175, x: 82, y: 88, reverse: false, floatDelay: "-2.4s" },
  { color: "var(--flower-purple)", size: 90,  x: 94, y: 30, reverse: true,  floatDelay: "-0.6s" },
  { color: "var(--flower-orange)", size: 70,  x: 66, y: 16, reverse: false, floatDelay: "-1.8s" },
];

/* ---------- ЦВЕТОК ЗА БУКВОЙ ЗАГОЛОВКА ----------
   Крупный цветок лежит позади одной из букв слова
   «Продуктовый» и выглядывает из-за неё.

   LETTER      — за какой буквой прячется
   OCCURRENCE  — какая она по счёту в слове (1 = первая)
   COLOR       — цвет цветка. Светлый жёлтый выбран потому,
                 что чёрная буква поверх него читается лучше
                 всего. Другие варианты из палитры:
                 --flower-pink, --flower-purple, --flower-orange */
const FLOWER_LETTER = "о";
const FLOWER_OCCURRENCE = 2;
const FLOWER_COLOR = "var(--flower-yellow)";

/* Разбивает слово на буквы и подставляет цветок за нужную.
   Остальные буквы выводятся как обычно. */
function LetterWithFlower({ text }) {
  let seen = 0;

  return (
    <>
      {Array.from(text).map((char, i) => {
        const matches = char.toLowerCase() === FLOWER_LETTER;
        if (matches) seen += 1;

        // Не та буква — просто выводим символ
        if (!matches || seen !== FLOWER_OCCURRENCE) {
          return <span key={i}>{char}</span>;
        }

        return (
          <span className={s.letterHost} key={i}>
            {/* Цветок лежит ПОЗАДИ буквы: его серединка совпадает
                с отверстием буквы «о» */}
            <span className={s.letterFlower} aria-hidden="true">
              <span className={s.letterFlowerSpin}>
                <Flower color={FLOWER_COLOR} size={100} />
              </span>
            </span>

            {/* Сама буква поверх цветка */}
            <span className={s.letterChar}>{char}</span>
          </span>
        );
      })}
    </>
  );
}

export default function Hero() {
  /* Скорость прокрутки. Лежит в «коробочке» (ref), а не в
     состоянии React: цветы читают её каждый кадр сами, и блок
     не перерисовывается на каждое движение колёсика. */
  const velocity = useScrollVelocity();

  // На телефоне цветы не таскаются — только вращаются
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);

    update();                                 // проверяем сразу при загрузке
    media.addEventListener("change", update); // и следим за поворотом экрана

    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section className={s.hero} id="top">
      <div className={s.inner}>
        {/* Строка над заголовком: имя · город · возраст */}
        <p className={s.eyebrow}>
          {site.name} · {site.city} · {site.age}
        </p>

        <h1 className={s.title}>
          <span className={s.titleLine}>
            <LetterWithFlower text={site.hero.titleLine1} />
          </span>
          <span className={s.titleLine}>{site.hero.titleLine2}</span>
        </h1>

        <p className={s.subtitle}>{site.hero.subtitle}</p>

        {/* Кнопку показываем, только если файл резюме указан.
            Пусто в site.js — кнопки нет, и никто не наткнётся
            на ссылку в никуда. */}
        {site.resumeUrl && (
          <a className={s.resume} href={site.resumeUrl} download>
            Скачать резюме
          </a>
        )}
      </div>

      {/* Цветы лежат отдельным слоем поверх фона.
          aria-hidden — украшение, программы чтения его пропускают. */}
      <div className={s.flowers} aria-hidden="true">
        {FLOWERS.map((flower, i) => (
          <DraggableFlower
            key={i}
            {...flower}
            velocity={velocity}
            draggable={!isMobile}
          />
        ))}
      </div>
    </section>
  );
}
