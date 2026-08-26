import { useEffect, useRef, useState } from "react";
import Flower from "../Flower/Flower";
import s from "./Hero.module.css";

/* ============================================================
   ЦВЕТОК В ГЛАВНОМ ЭКРАНЕ
   ============================================================
   Что он умеет:
   • постоянно вращается вокруг своей оси;
   • при прокрутке вращается быстрее и отклоняется в сторону;
   • плавно покачивается вверх-вниз;
   • на компьютере его можно схватить мышью и перетащить,
     после отпускания он возвращается на место.

   Почему вращение написано кодом, а не обычной CSS-анимацией:
   чтобы ускорять вращение, пришлось бы менять длительность
   анимации на ходу. В этот момент браузер пересчитывает, где
   он сейчас находится внутри анимации, и картинка прыгает —
   цветы дёргались вместо плавного разгона.

   Здесь угол поворота просто копится сам: каждый кадр к нему
   прибавляется чуть-чуть. Скорость можно менять в любой момент,
   а угол при этом никуда не скачет.
   ============================================================ */

/* Сколько градусов в секунду проходит цветок */
const IDLE_SPEED = 36;  // в покое: полный оборот за 10 секунд
const FAST_SPEED = 103; // при быстрой прокрутке: за 3.5 секунды

export default function DraggableFlower({
  color,
  size,
  x,             // положение по горизонтали в процентах
  y,             // положение по вертикали в процентах
  velocity,      // «коробочка» со скоростью прокрутки
  floatDelay,    // сдвиг покачивания, чтобы цветы качались вразнобой
  reverse,       // крутить в обратную сторону
  draggable = true,
}) {
  // Насколько цветок утащили от своего места
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // useRef хранит данные между кадрами, но не вызывает перерисовку
  const startPoint = useRef({ x: 0, y: 0 });
  const spinRef = useRef(null);

  /* ---- Собственный цикл вращения ---- */
  useEffect(() => {
    const el = spinRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let angle = Math.random() * 360;   // стартовый угол у каждого свой
    let push = 0;                      // текущее отклонение от «ветра»
    let last = performance.now();
    let frameId;

    function tick(now) {
      // Сколько секунд прошло с прошлого кадра
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const v = velocity?.current ?? { speed: 0, signed: 0 };

      // Скорость вращения: от спокойной до быстрой
      const degPerSec = IDLE_SPEED + (FAST_SPEED - IDLE_SPEED) * v.speed;
      angle += degPerSec * dt * (reverse ? -1 : 1);

      // Отклонение «по ветру» догоняет текущую скорость прокрутки
      // плавно, а не прыжком — отсюда мягкость движения
      push += (v.signed - push) * Math.min(dt * 6, 1);

      el.style.transform =
        `translateY(${push * -26}px) ` +
        `rotate(${angle.toFixed(2)}deg) ` +
        `scale(${1 - Math.abs(push) * 0.06})`;

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [velocity, reverse]);

  /* ---- Перетаскивание мышью ---- */
  function handlePointerDown(event) {
    if (!draggable) return;

    setDragging(true);
    startPoint.current = { x: event.clientX, y: event.clientY };

    // setPointerCapture: браузер продолжит присылать события,
    // даже если курсор уехал за пределы цветка. Без этого
    // перетаскивание срывалось бы при резком движении.
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragging) return;

    setOffset({
      x: event.clientX - startPoint.current.x,
      y: event.clientY - startPoint.current.y,
    });
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);
    setOffset({ x: 0, y: 0 }); // возврат на место, плавность задана в CSS
  }

  return (
    <div
      className={`${s.flowerWrap} ${dragging ? s.flowerDragging : ""} ${
        draggable ? s.flowerDraggable : ""
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        // translate(-50%, -50%) центрирует цветок по своей точке,
        // дальше добавляем смещение от перетаскивания
        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      /* Подсказка курсору: над цветком он превращается в круг
         с бегущей надписью «подвинь меня».
         На телефоне перетаскивания нет — и подписи тоже. */
      data-cursor={draggable ? "drag" : undefined}
    >
      {/* Слой покачивания: медленно плывёт вверх-вниз */}
      <div className={s.flowerFloat} style={{ animationDelay: floatDelay }}>
        {/* Слой вращения и «ветра» — им управляет код выше */}
        <div className={s.flowerSpin} ref={spinRef}>
          <Flower color={color} size={size} />
        </div>
      </div>
    </div>
  );
}
