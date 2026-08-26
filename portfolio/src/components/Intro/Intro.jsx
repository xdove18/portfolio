import { useEffect, useState } from "react";
import { site } from "../../data/site";
import Flower from "../Flower/Flower";
import Bee from "./Bee";
import s from "./Intro.module.css";

/* ============================================================
   ЗАСТАВКА: ЦВЕТЫ РАСТУТ, СВЕРХУ ЛЕТИТ ПЧЁЛКА
   ============================================================
   Заставка идёт 1.5 секунды и проходит четыре стадии:

   1. Рост    — цветы вырастают снизу вверх, один за другим
   2. Полёт   — пчёлка летит справа налево над цветами,
                за ней вспыхивают чёрточки и тут же гаснут —
                как инверсионный след за самолётом
   3. Разлёт  — цветы разлетаются в стороны
   4. Уход    — фон растворяется, открывается сайт

   Чтобы сделать заставку короче или длиннее, меняйте числа
   в TIMING ниже. Они в миллисекундах: 1000 = одна секунда.
   ============================================================ */

const TIMING = {
  grow: 180,      // пауза перед тем, как цветы полезут вверх
  fly: 1020,      // сколько длится стадия полёта
  scatter: 220,   // цветы разлетаются
  fade: 80,       // фон растворяется
};

/* Сколько времени пчёлке нужно на ВЕСЬ путь через экран.
   Это число намеренно больше стадии полёта: так пчёлка летит
   спокойно, её легко разглядеть, а заставка не затягивается —
   она просто заканчивается, когда пчёлка ещё в пути —
   примерно на середине экрана.
   Чем больше значение, тем медленнее полёт. */
const BEE_DURATION = 2600;

/* Кривая, по которой летит пчёлка. Та же самая используется
   для чёрточек следа, поэтому они ложатся точно по её пути. */
const FLIGHT_PATH =
  "M1020 60 C 820 10, 700 150, 520 95 S 240 20, -20 110";

/* Сколько чёрточек в следе. Чем больше, тем плотнее пунктир. */
const DASH_COUNT = 18;

/* Сколько миллисекунд чёрточка живёт, прежде чем погаснуть.
   Это и есть «длина хвоста»: больше время — длиннее след.
   Должно быть заметно меньше времени полёта, иначе к концу
   заставки след ещё висит на экране. */
const DASH_LIFE = 400;

/* Цветы стоят вдоль нижнего края.
   left  — положение по горизонтали в процентах
   size  — размер цветка
   rise  — на сколько пикселей он поднимается над краем
   x, y  — куда улетает при разлёте
   delay — на сколько опаздывает от остальных */
const FLOWERS = [
  { color: "var(--flower-red)",    size: 130, left: 12, rise: 210, x: -420, y: -320, spin: -200, delay: 0 },
  { color: "var(--flower-yellow)", size: 104, left: 26, rise: 150, x: -220, y: -400, spin:  240, delay: 90 },
  { color: "var(--flower-pink)",   size: 146, left: 40, rise: 250, x:  -60, y: -430, spin:  180, delay: 45 },
  { color: "var(--flower-purple)", size: 92,  left: 54, rise: 140, x:  180, y: -380, spin: -260, delay: 150 },
  { color: "var(--flower-orange)", size: 120, left: 68, rise: 220, x:  340, y: -340, spin:  220, delay: 70 },
  { color: "var(--flower-red)",    size: 84,  left: 82, rise: 130, x:  480, y: -280, spin: -180, delay: 190 },
  { color: "var(--flower-yellow)", size: 68,  left: 94, rise: 180, x:  560, y: -220, spin:  300, delay: 120 },
];

/* Заранее считаем, где стоит каждая чёрточка следа и когда
   она должна вспыхнуть.

   Чёрточка загорается ровно в тот момент, когда пчёлка
   пролетает мимо неё. Поэтому задержка = момент старта полёта
   плюс доля пути, которую пчёлка к этому времени пролетела.
   Ради точного совпадения пчела летит равномерно (linear). */
const DASHES = Array.from({ length: DASH_COUNT }, (_, i) => {
  const progress = (i + 0.5) / DASH_COUNT; // доля пути, 0…1
  return {
    distance: progress * 100,
    // Считаем от времени полёта пчёлки, а не от стадии:
    // иначе след убегал бы вперёд неё
    delay: TIMING.grow + BEE_DURATION * progress,
  };
});

export default function Intro({ onDone }) {
  /* Текущая стадия:
     "grow"    — цветы растут
     "fly"     — пчёлка в полёте
     "scatter" — цветы разлетаются */
  const [stage, setStage] = useState("grow");

  useEffect(() => {
    // Если человек отключил анимации в системе — сразу показываем сайт
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDone();
      return;
    }

    const timers = [
      setTimeout(() => setStage("fly"), TIMING.grow),
      setTimeout(() => setStage("scatter"), TIMING.grow + TIMING.fly),
      setTimeout(
        onDone,
        TIMING.grow + TIMING.fly + TIMING.scatter + TIMING.fade
      ),
    ];

    // Отменяем таймеры, если заставку убрали раньше времени
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const grown = stage !== "grow";
  const scattering = stage === "scatter";

  return (
    <div
      className={`${s.intro} ${scattering ? s.introFading : ""}`}
      aria-hidden="true"
    >
      {/* ---------- ПОЛЁТ ПЧЁЛКИ ---------- */}
      <div
        className={s.flightZone}
        style={{
          // Путь задаётся один раз здесь и читается из CSS,
          // чтобы пчёлка и чёрточки летели строго по одной кривой
          "--flight": `path("${FLIGHT_PATH}")`,
          // Длительность и задержка полёта тоже приходят отсюда:
          // так тайминг в коде и в стилях не может разъехаться
          "--fly-dur": `${BEE_DURATION}ms`,
          "--fly-delay": `${TIMING.grow}ms`,
        }}
      >
        {/* След: каждая чёрточка вспыхивает, когда пчёлка
            проходит мимо, и через мгновение гаснет */}
        {DASHES.map((dash, i) => (
          <span
            key={i}
            className={s.dash}
            style={{
              "--d": `${dash.distance}%`,
              "--delay": `${dash.delay}ms`,
              "--life": `${DASH_LIFE}ms`,
            }}
          />
        ))}

        <div className={s.bee}>
          <Bee size={70} />
        </div>
      </div>

      {/* ---------- НАДПИСЬ В ЦЕНТРЕ ----------
          Появляется, пока пчёлка летит. Текст правится
          в файле src/data/site.js, поле introText. */}
      <p className={`${s.caption} ${grown ? s.captionIn : ""}`}>
        {site.introText}
      </p>

      {/* ---------- ЦВЕТЫ ВДОЛЬ НИЖНЕГО КРАЯ ---------- */}
      <div className={s.field}>
        {FLOWERS.map((flower, i) => (
          <div
            key={i}
            className={`${s.stem} ${grown ? s.stemGrown : ""} ${
              scattering ? s.stemScatter : ""
            }`}
            style={{
              left: `${flower.left}%`,
              "--rise": `${flower.rise}px`,
              "--x": `${flower.x}px`,
              "--y": `${flower.y}px`,
              "--spin": `${flower.spin}deg`,
              /* Задержки разлёта ужаты: вся стадия длится
                 доли секунды, и при исходных значениях
                 последние цветы не успевали улететь */
              "--delay": `${Math.round(flower.delay * 0.2)}ms`,
              "--grow-delay": `${i * 22}ms`,
            }}
          >
            <div className={s.sway}>
              <Flower color={flower.color} size={flower.size} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
