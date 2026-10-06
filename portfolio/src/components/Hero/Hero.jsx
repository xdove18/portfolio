import { useEffect, useRef, useState } from "react";
import { site } from "../../data/site";
import { fixHangingWords } from "../../utils/typography";
import { asset } from "../../utils/asset";
import useScrollVelocity from "../../hooks/useScrollVelocity";
import DraggableFlower from "./DraggableFlower";
import Flower from "../Flower/Flower";
import HeroWheel from "./HeroWheel";
import s from "./Hero.module.css";

/* ============================================================
   ГЛАВНЫЙ ЭКРАН (HERO)
   ============================================================
   Слева крупный заголовок и описание, справа — колесо кейсов,
   вокруг живые цветы.

   Секция намеренно высокая (несколько экранов), а её
   содержимое «прилипает» к окну и не уезжает, пока человек
   листает: за это время мимо проезжают все четыре кейса.
   Потом страница идёт дальше, к разделу «обо мне».

   Высота задана в Hero.module.css, свойством height у .hero.
   ============================================================ */

/* Расположение цветов.
   x и y — в процентах от блока: x=0 слева, x=100 справа.

   Места подобраны так, чтобы цветы не налезали на колесо
   кейсов справа и на подпись под ним: они держатся левой
   части, низа и двух верхних углов.

   mx и my — запасные места для телефона. Там колонки стоят
   друг под другом, подпись кейса съезжает на середину экрана,
   и цветы уходят ещё ниже, чтобы её не перекрывать.
   Если запасного места нет, берутся обычные x и y.
   reverse — крутить в обратную сторону.
   floatDelay — сдвиг покачивания, чтобы цветы качались вразнобой. */
const FLOWERS = [
  { color: "var(--flower-red)",    size: 190, x: 1,  y: 70, mx: 1,  my: 100, reverse: false, floatDelay: "0s" },
  { color: "var(--flower-yellow)", size: 150, x: 26, y: 97, mx: 42, my: 106, reverse: true,  floatDelay: "-1.2s" },
  { color: "var(--flower-pink)",   size: 175, x: 62, y: 99, mx: 80, my: 100, reverse: false, floatDelay: "-2.4s" },
  { color: "var(--flower-purple)", size: 90,  x: 96, y: 13, reverse: true,  floatDelay: "-0.6s" },
  { color: "var(--flower-orange)", size: 70,  x: 40, y: 10, reverse: false, floatDelay: "-1.8s" },
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

  /* Подсказка «листайте — 4 кейса» стоит в левой колонке,
     а растворяет её колесо кейсов, когда человек начал
     листать. Поэтому сам элемент создаётся здесь, а передаём
     его колесу — чтобы ему было что гасить. */
  const подсказкаРеф = useRef(null);

  // На телефоне цветы не таскаются — только вращаются
  const [isMobile, setIsMobile] = useState(false);

  /* Узкий экран — это когда колонки встали друг под друга.
     Граница здесь 900px, та же, что в HeroWheel.module.css:
     с неё кейсы превращаются в ленту, подпись съезжает на
     середину экрана, и цветам нужны запасные места. */
  const [узкий, setУзкий] = useState(false);

  useEffect(() => {
    const телефон = window.matchMedia("(max-width: 768px)");
    const колонка = window.matchMedia("(max-width: 900px)");

    const update = () => {
      setIsMobile(телефон.matches);
      setУзкий(колонка.matches);
    };

    update();                                   // проверяем сразу при загрузке
    телефон.addEventListener("change", update); // и следим за поворотом экрана
    колонка.addEventListener("change", update);

    return () => {
      телефон.removeEventListener("change", update);
      колонка.removeEventListener("change", update);
    };
  }, []);

  return (
    <section className={s.hero} id="top">
      {/* Этот слой прилипает к окну, пока секция проезжает мимо */}
      <div className={s.sticky}>
        <div className={s.inner}>
          {/* Левая колонка: заголовок и описание */}
          <div className={s.textCol}>
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
          <a
            className={s.resume}
            href={asset(site.resumeUrl)}
            /* download подсказывает браузеру сохранить файл,
               а не открывать его во вкладке. Значение — имя,
               под которым файл ляжет в «Загрузки». */
            download={`${site.name} — резюме.pdf`}
          >
            Скачать резюме
          </a>
        )}

        {/* Подсказка: дальше листают, и мимо едут кейсы */}
        <p className={s.scrollHint} ref={подсказкаРеф}>
          <span className={s.hintMouse} aria-hidden="true">
            <span className={s.hintWheel} />
          </span>
          {fixHangingWords("листайте — 4 кейса")}
        </p>
          </div>

          {/* Правая колонка: кейсы, которые едут по дуге */}
          <HeroWheel подсказкаРеф={подсказкаРеф} />
        </div>

        {/* Цветы лежат отдельным слоем поверх фона.
            aria-hidden — украшение, программы чтения его пропускают. */}
        <div className={s.flowers} aria-hidden="true">
          {FLOWERS.map((flower, i) => (
            <DraggableFlower
              key={i}
              color={flower.color}
              size={flower.size}
              /* ?? означает «если не задано — возьми второе» */
              x={узкий ? flower.mx ?? flower.x : flower.x}
              y={узкий ? flower.my ?? flower.y : flower.y}
              reverse={flower.reverse}
              floatDelay={flower.floatDelay}
              velocity={velocity}
              draggable={!isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
