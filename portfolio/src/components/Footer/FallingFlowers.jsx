import { useEffect, useRef } from "react";
import { SHAPES } from "./flowerShapes";
import s from "./Footer.module.css";

/* ============================================================
   ПАДАЮЩИЕ ЦВЕТЫ В ФУТЕРЕ
   ============================================================
   Цветы медленно осыпаются сверху вниз и плавно вращаются.
   Вокруг курсора есть невидимый круг: как только цветок в него
   попадает — его мягко отталкивает прочь. Потом он успокаивается
   и продолжает падать.

   Форм цветов пять, они чередуются — см. файл flowerShapes.js.

   Почему это написано на JavaScript, а не только на CSS:
   отталкивание требует знать, где цветок находится прямо
   сейчас. CSS-анимация этого не сообщает, поэтому положение
   каждого цветка считается вручную, кадр за кадром.
   ============================================================ */

const COLORS = [
  "var(--flower-red)",
  "var(--flower-yellow)",
  "var(--flower-pink)",
  "var(--flower-purple)",
  "var(--flower-orange)",
];

const COUNT = 18;          // сколько цветов летает
const REPEL_RADIUS = 140;  // радиус «щита» вокруг курсора, в пикселях
const REPEL_FORCE = 2.4;   // насколько сильно отталкивает
const FRICTION = 0.93;     // торможение: 1 — не тормозит, 0.9 — быстро

/* Предел скорости вращения. Без него от толчка курсором цветок
   раскручивался как юла и рябил в глазах. */
const MAX_SPIN = 0.55;

export default function FallingFlowers() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Если человек отключил анимации в системе — ничего не запускаем
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const container = containerRef.current;
    if (!container) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;

    /* ---- Создаём цветы ----
       Каждый цветок — это элемент на странице плюс набор чисел:
       где он, куда летит, как быстро крутится. */
    const flowers = Array.from({ length: COUNT }, (_, i) => {
      const size = 15 + (i % 5) * 7;
      const shape = SHAPES[i % SHAPES.length];

      const el = document.createElement("div");
      el.className = s.flower;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.color = COLORS[i % COLORS.length];
      // Уникальный номер нужен, чтобы маски внутри картинок
      // не путались между собой
      el.innerHTML = shape(`footerFlower${i}`);
      container.appendChild(el);

      return {
        el,
        x: Math.random() * width,
        y: Math.random() * height - height, // стартуют выше футера
        // Скорость падения: крупные падают чуть быстрее
        fall: 0.22 + (size / 60) * 0.45,
        vx: 0,                              // толчок вбок от курсора
        vy: 0,                              // толчок вверх-вниз от курсора
        angle: Math.random() * 360,
        // Спокойное вращение: медленное и у каждого своё
        spin: (Math.random() - 0.5) * 0.35,
        sway: Math.random() * Math.PI * 2,  // фаза покачивания
      };
    });

    /* ---- Где сейчас курсор ----
       Держим координаты в обычной переменной, а не в состоянии
       React: состояние вызывало бы перерисовку на каждое
       движение мыши, и страница бы тормозила.

       Слушаем всё окно, а не сам футер: слой с цветами прозрачен
       для мыши, иначе он перекрывал бы ссылки под собой. */
    let mouse = { x: -9999, y: -9999 };

    function onMouseMove(event) {
      const box = container.getBoundingClientRect();

      // Курсор далеко от футера — щит не нужен
      if (
        event.clientY < box.top - REPEL_RADIUS ||
        event.clientY > box.bottom + REPEL_RADIUS
      ) {
        mouse = { x: -9999, y: -9999 };
        return;
      }

      // Переводим координаты окна в координаты футера
      mouse = { x: event.clientX - box.left, y: event.clientY - box.top };
    }

    function onResize() {
      width = container.offsetWidth;
      height = container.offsetHeight;
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize);

    /* ---- Главный цикл: пересчёт кадра ---- */
    let frameId;

    function tick() {
      for (const f of flowers) {
        // 1. Обычное падение и лёгкое покачивание вбок
        f.y += f.fall;
        f.sway += 0.007;
        f.x += Math.sin(f.sway) * 0.3;
        f.angle += f.spin;

        // 2. Отталкивание от курсора
        const dx = f.x - mouse.x;
        const dy = f.y - mouse.y;
        // Расстояние до курсора по теореме Пифагора
        const distance = Math.hypot(dx, dy);

        if (distance < REPEL_RADIUS && distance > 0) {
          // Чем ближе к курсору, тем сильнее толчок
          const strength = (1 - distance / REPEL_RADIUS) * REPEL_FORCE;
          f.vx += (dx / distance) * strength;
          f.vy += (dy / distance) * strength;
          // Вращение от толчка почти не меняем — иначе цветок
          // начинает крутиться как юла и рябит в глазах
          f.spin += strength * 0.012;
        }

        // 3. Толчок затухает — цветок успокаивается
        f.x += f.vx;
        f.y += f.vy;
        f.vx *= FRICTION;
        f.vy *= FRICTION;

        // Скорость вращения держим в спокойных пределах
        f.spin = Math.max(-MAX_SPIN, Math.min(MAX_SPIN, f.spin));

        // 4. Улетел за край — возвращаем с другой стороны
        if (f.y > height + 40) {
          f.y = -40;
          f.x = Math.random() * width;
          f.vx = 0;
          f.vy = 0;
        }
        if (f.y < -140) f.y = -40;
        if (f.x < -40) f.x = width + 30;
        if (f.x > width + 40) f.x = -30;

        // 5. Рисуем. transform не заставляет браузер пересчитывать
        //    вёрстку, поэтому анимация остаётся плавной.
        f.el.style.transform = `translate3d(${f.x}px, ${f.y}px, 0) rotate(${f.angle}deg)`;
      }

      frameId = requestAnimationFrame(tick);
    }

    tick();

    /* ---- Уборка: когда футер исчезает со страницы ----
       Останавливаем цикл и снимаем слушатели, иначе они
       продолжали бы работать впустую и тратить батарею. */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      flowers.forEach((f) => f.el.remove());
    };
  }, []);

  return <div className={s.flowerField} ref={containerRef} aria-hidden="true" />;
}
