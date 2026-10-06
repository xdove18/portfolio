import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "../../data/projects";
import { thumb } from "../Case/imagePath";
import s from "./HeroWheel.module.css";

/* ============================================================
   КОЛЕСО КЕЙСОВ НА ПЕРВОМ ЭКРАНЕ
   ============================================================
   Справа от заголовка кейсы едут по дуге, как кабинки
   колеса обозрения: следующий выезжает снизу справа,
   предыдущий уходит вверх.

   Двигает их обычная прокрутка страницы. Первый экран на это
   время «прилипает» к окну и не уезжает, пока все четыре
   кейса не покажутся. Потом страница идёт дальше как обычно.

   На телефоне колеса нет: там кейсы лежат лентой, которую
   листают пальцем вбок. Подпись и полоски под ними работают
   так же.

   Картинки кейсов берутся из src/data/projects.js, поле cover.
   Поменяете их там — поменяются и здесь.
   ============================================================ */

/* ---------- Настройки колеса ----------
   Можно менять, ничего больше трогать не нужно. */

/* Радиус колеса в пикселях. Больше число — дуга более пологая,
   кейсы едут почти по прямой. */
const РАДИУС = 620;

/* Угол между соседними кейсами, в радианах (0.62 ≈ 35°).
   Больше — кейсы стоят на колесе реже и уезжают дальше. */
const ШАГ = 0.62;

/* Насколько плавно колесо догоняет прокрутку: 0.07 — мягкая
   инерция, 1 — жёстко следом за колёсиком мыши. */
const ПЛАВНОСТЬ = 0.07;

/* Сколько кейсов показываем. Прокрутка первого экрана
   рассчитана именно на это число. */
const СКОЛЬКО = 4;

const ГРАДУС = 180 / Math.PI;
const зажать = (v, от = 0, до = 1) => Math.min(до, Math.max(от, v));

/* ------------------------------------------------------------
   КАК РАЗЛОЖЕНЫ ЭКРАНЫ В КАЖДОМ КЕЙСЕ
   ------------------------------------------------------------
   Чтобы кейсы не выглядели одинаково, у каждого своя
   раскладка. Слева — адрес кейса из projects.js, справа —
   название раскладки:

   ноутбук   — один широкий экран внутри корпуса ноутбука
   веер      — три телефона, средний крупнее и выше
   лесенка   — три телефона уступами, по диагонали
   внахлёст  — три телефона друг на друге, под углом

   Добавите новый кейс — допишите строку сюда. Если забудете,
   он возьмёт «веер», ничего не сломается.
   ------------------------------------------------------------ */
const РАСКЛАДКА = {
  "agency-crm": "ноутбук",
  "smart-size": "веер",
  checkout: "лесенка",
  habits: "внахлёст",
};

/* Какому названию раскладки какой класс стилей соответствует */
const КЛАСС = {
  ноутбук: "laptop",
  веер: "fan",
  лесенка: "stairs",
  внахлёст: "stack",
};

/* ------------------------------------------------------------
   ЭКРАНЫ ОДНОГО КЕЙСА
   ------------------------------------------------------------
   Берутся из поля cover в src/data/projects.js — тех же
   обложек, что стоят на странице кейса. Поменяете там —
   поменяется и здесь.
   ------------------------------------------------------------ */
function Экраны({ кейс }) {
  const экраны = кейс.cover || [];
  if (экраны.length === 0) return null;

  const вид = РАСКЛАДКА[кейс.slug] || "веер";

  /* Ноутбук: широкий экран лежит внутри тёмного корпуса,
     под ним основание с выемкой — как у настоящего. */
  if (вид === "ноутбук") {
    return (
      <div className={s.laptop}>
        <div className={s.laptopBody}>
          <img src={thumb(экраны[0])} alt="" className={s.laptopShot} />
        </div>
        <div className={s.laptopBase}>
          <span className={s.laptopNotch} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${s.deck} ${s[КЛАСС[вид]]}`}>
      {экраны.map((src) => (
        <img
          key={src}
          /* Лёгкая копия: экран виден небольшим, полная
             версия здесь была бы лишним весом */
          src={thumb(src)}
          alt=""
          className={s.phone}
        />
      ))}
    </div>
  );
}

export default function HeroWheel({ подсказкаРеф }) {
  const navigate = useNavigate();
  const боксРеф = useRef(null);
  const лентаРеф = useRef(null);

  const кейсы = useMemo(
    () => projects.filter((p) => !p.comingSoon).slice(0, СКОЛЬКО),
    []
  );

  /* Телефон или компьютер. От этого зависит, что двигает кейсы:
     прокрутка страницы (колесо) или палец вбок (лента). */
  const [режим, setРежим] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 900px)").matches
      ? "лента"
      : "колесо"
  );

  useEffect(() => {
    const окно = window.matchMedia("(max-width: 900px)");
    const следить = () => setРежим(окно.matches ? "лента" : "колесо");
    следить();
    окно.addEventListener("change", следить);
    return () => окно.removeEventListener("change", следить);
  }, []);

  /* ---------- Что двигается каждый кадр ----------
     Эти элементы меняются по шестьдесят раз в секунду, поэтому
     их двигает не React, а код напрямую. Иначе страница
     перерисовывалась бы на каждое движение колёсика. */
  const сцены = useRef([]);
  const подписи = useRef([]);
  const полоски = useRef([]);
  const точки = useRef([]);
  const кольцо = useRef(null);
  const заливка = useRef(null);
  const ручка = useRef(null);

  /* Положение колеса: 0 — первый кейс в центре, 3 — последний.
     «цель» — куда нужно приехать, «сейчас» — где находимся. */
  const сейчас = useRef(0);
  const цель = useRef(0);
  const тянут = useRef(false);

  useEffect(() => {
    const мягко = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    /* ---------- Куда должно приехать колесо ---------- */
    function прочитатьЦель() {
      if (режим === "лента") {
        /* Лента: положение берём прямо из того, насколько
           её пролистали пальцем вбок. */
        const лента = лентаРеф.current;
        if (!лента) return;
        const пролёт = лента.scrollWidth - лента.clientWidth;
        цель.current = пролёт > 0
          ? (лента.scrollLeft / пролёт) * (кейсы.length - 1)
          : 0;
        return;
      }

      const экран = боксРеф.current?.closest("section");
      if (!экран) return;

      const r = экран.getBoundingClientRect();
      const пролёт = r.height - window.innerHeight;

      /* Насколько пролистан первый экран: 0 — только зашли,
         1 — пролистали его целиком. */
      const p = зажать(-r.top / (пролёт || 1));

      /* Поля в начале и в конце (−0.25 и ×3.5): первый и
         последний кейс задерживаются в центре чуть дольше,
         а не пролетают мимо на самом краю прокрутки. */
      let сырое = зажать(p * 3.5 - 0.25, 0, кейсы.length - 1);

      /* Мягкая остановка у каждого кейса. Между соседними
         кейсами скорость сначала растёт, потом падает —
         получается «переключение», а не равномерное ползание. */
      const i = Math.min(кейсы.length - 2, Math.floor(сырое));
      const f = сырое - i;
      сырое = i + (1 - Math.cos(Math.PI * f)) / 2;

      цель.current = сырое;
    }

    /* ---------- Рисуем положение t ---------- */
    function нарисовать(t) {
      сцены.current.forEach((эл, i) => {
        if (!эл) return;

        const d = i - t;          // насколько кейс далеко от центра
        const ad = Math.abs(d);

        if (режим === "лента") {
          /* В ленте кейсы просто стоят в ряд — двигать нечего,
             их везёт сама прокрутка пальцем. */
          эл.style.transform = "";
          эл.style.opacity = "";
          эл.style.zIndex = "";
          return;
        }

        const a = d * ШАГ;        // угол поворота по дуге

        эл.style.transform =
          `translate3d(${РАДИУС * (1 - Math.cos(a))}px, ` +
          `${РАДИУС * Math.sin(a)}px, 0) ` +
          `rotate(${-a * ГРАДУС}deg) ` +
          `scale(${1 - зажать(ad * 0.28, 0, 0.6)})`;

        // Дальние кейсы растворяются, ближний — непрозрачный
        эл.style.opacity = зажать(1 - Math.pow(ad, 1.4) * 0.85);

        // Ближний кейс лежит поверх остальных
        эл.style.zIndex = 10 - Math.round(ad);
      });

      // Подпись активного кейса видна, соседние уходят
      подписи.current.forEach((эл, i) => {
        if (!эл) return;
        const d = i - t;
        const ad = Math.abs(d);
        эл.style.opacity = зажать(1 - ad * 2.2);
        эл.style.transform = `translateY(${d * 18}px)`;
        // Нажимается только та подпись, которая сейчас видна
        эл.style.pointerEvents = ad < 0.4 ? "auto" : "none";
      });

      // Полоски прогресса под подписью
      полоски.current.forEach((эл, i) => {
        if (эл) эл.style.width = `${зажать(t - i + 1) * 100}%`;
      });

      if (кольцо.current) {
        кольцо.current.style.transform = `rotate(${-t * ШАГ * ГРАДУС}deg)`;
      }

      // Ползунок справа от сцены
      const доля = (t / (кейсы.length - 1)) * 100;
      if (заливка.current) заливка.current.style.height = `${доля}%`;
      if (ручка.current) ручка.current.style.top = `${доля}%`;

      точки.current.forEach((эл, i) => {
        if (!эл) return;
        эл.classList.toggle(s.tickPassed, Math.round(t) >= i);
        эл.classList.toggle(s.tickNow, Math.round(t) === i);
      });

      /* Подсказка «листайте» живёт в левой колонке, рядом
         с описанием. Нужна она только в самом начале —
         дальше растворяется. */
      if (подсказкаРеф?.current) {
        подсказкаРеф.current.style.opacity = зажать(1 - t * 3);
      }
    }

    /* ---------- Кадр за кадром ----------
       Каждый кадр колесо немного приближается к цели. За счёт
       этого оно едет мягко и продолжает ехать по инерции,
       когда прокрутка уже остановилась. */
    let прошлое = performance.now();
    let кадр = 0;
    let идёт = false;

    function шаг(время) {
      const dt = Math.min(64, время - прошлое);
      прошлое = время;

      прочитатьЦель();

      /* Формула со степенью нужна, чтобы скорость не зависела
         от частоты кадров: на мониторе 120 Гц колесо едет
         ровно так же, как на обычном 60 Гц. */
      const k = мягко ? 1 - Math.pow(1 - ПЛАВНОСТЬ, dt / 16.67) : 1;
      сейчас.current += (цель.current - сейчас.current) * k;

      нарисовать(сейчас.current);
      кадр = requestAnimationFrame(шаг);
    }

    function запустить() {
      if (идёт) return;
      идёт = true;
      прошлое = performance.now();
      кадр = requestAnimationFrame(шаг);
    }

    function остановить() {
      if (!идёт) return;
      идёт = false;
      cancelAnimationFrame(кадр);
    }

    /* Пока первый экран не виден, считать нечего —
       и ноутбук не греется впустую. */
    const бокс = боксРеф.current;
    const наблюдатель = new IntersectionObserver(
      ([запись]) => (запись.isIntersecting ? запустить() : остановить()),
      { rootMargin: "100px" }
    );
    if (бокс) наблюдатель.observe(бокс);

    return () => {
      наблюдатель.disconnect();
      остановить();
    };
  }, [режим, кейсы.length, подсказкаРеф]);

  /* ---------- Прокрутить страницу к нужному кейсу ----------
     Обратный счёт: по номеру кейса считаем, куда поставить
     страницу, чтобы он оказался в центре колеса. */
  function кКейсу(номер, плавно) {
    if (режим === "лента") {
      const лента = лентаРеф.current;
      if (!лента) return;
      const пролёт = лента.scrollWidth - лента.clientWidth;
      лента.scrollTo({
        left: (номер / (кейсы.length - 1)) * пролёт,
        behavior: плавно ? "smooth" : "auto",
      });
      return;
    }

    const экран = боксРеф.current?.closest("section");
    if (!экран) return;

    const пролёт = экран.offsetHeight - window.innerHeight;
    const p = зажать((номер + 0.25) / 3.5);

    window.scrollTo({
      top: экран.getBoundingClientRect().top + window.scrollY + p * пролёт,
      behavior: плавно ? "smooth" : "auto",
    });
  }

  /* ---------- Ползунок справа ----------
     Его можно тянуть мышью — страница едет следом. */
  function поПолзунку(e) {
    const полоса = e.currentTarget.getBoundingClientRect();
    const доля = зажать((e.clientY - полоса.top) / полоса.height);
    кКейсу(доля * (кейсы.length - 1), false);
  }

  function взяли(e) {
    if (e.target.closest("button")) return;   // нажали на точку
    тянут.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    поПолзунку(e);
  }

  if (кейсы.length === 0) return null;

  return (
    <div className={s.wrap} ref={боксРеф}>
      {/* ---------- СЦЕНА: сами кейсы ---------- */}
      <div className={s.stage} ref={лентаРеф}>
        {/* Пунктирная окружность — след колеса */}
        <div className={s.ring} ref={кольцо} aria-hidden="true" />

        {кейсы.map((кейс, i) => (
          <div
            key={кейс.slug}
            className={s.scene}
            ref={(эл) => (сцены.current[i] = эл)}
          >
            <button
              type="button"
              className={s.panel}
              onClick={() => navigate(`/projects/${кейс.slug}`)}
              aria-label={`Открыть кейс «${кейс.title}»`}
              /* Клавиатура ведёт по подписи под сценой — там
                 же лежит название, так что две одинаковые
                 остановки подряд не нужны */
              tabIndex={-1}
              data-cursor="image"
            >
              <Экраны кейс={кейс} />
            </button>
          </div>
        ))}

        {/* ---------- ПОЛЗУНОК 01–04 ---------- */}
        <div
          className={s.slider}
          onPointerDown={взяли}
          onPointerMove={(e) => тянут.current && поПолзунку(e)}
          onPointerUp={() => (тянут.current = false)}
        >
          <div className={s.sliderTrack} />
          <div className={s.sliderFill} ref={заливка} />

          {кейсы.map((кейс, i) => (
            <button
              key={кейс.slug}
              type="button"
              className={s.tick}
              style={{ top: `${(i / (кейсы.length - 1)) * 100}%` }}
              ref={(эл) => (точки.current[i] = эл)}
              onClick={() => кКейсу(i, true)}
              aria-label={`Показать кейс «${кейс.title}»`}
            >
              <span className={s.tickDot} />
            </button>
          ))}

          <div className={s.sliderKnob} ref={ручка} aria-hidden="true" />
        </div>
      </div>

      {/* ---------- ПОДПИСЬ И ПРОГРЕСС ---------- */}
      <div className={s.below}>
        <div className={s.captions}>
          {кейсы.map((кейс, i) => (
            <button
              key={кейс.slug}
              type="button"
              className={s.caption}
              ref={(эл) => (подписи.current[i] = эл)}
              onClick={() => navigate(`/projects/${кейс.slug}`)}
            >
              <span className={s.capNum}>
                {String(i + 1).padStart(2, "0")} / {String(кейсы.length).padStart(2, "0")}
              </span>
              <span className={s.capTitle}>{кейс.title}</span>
              <span className={s.capText}>
                {кейс.tagline}
                <span className={s.capArrow}> →</span>
              </span>
            </button>
          ))}
        </div>

        <div className={s.bars} aria-hidden="true">
          {кейсы.map((кейс, i) => (
            <div key={кейс.slug} className={s.bar}>
              <div
                className={s.barFill}
                ref={(эл) => (полоски.current[i] = эл)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
