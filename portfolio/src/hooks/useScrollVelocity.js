import { useEffect, useRef } from "react";

/* ============================================================
   СКОРОСТЬ ПРОКРУТКИ СТРАНИЦЫ
   ============================================================
   Возвращает «коробочку» с двумя числами, которая обновляется
   на каждое движение колёсика:

   speed  — насколько быстро листают, от 0 (стоим) до 1 (очень
            быстро). Знака нет.
   signed — то же самое, но со знаком: вниз положительное,
            вверх отрицательное. Нужно, чтобы цветы отклонялись
            в правильную сторону.

   ВАЖНО: значения лежат в ref, а не в состоянии React.
   Состояние вызывало бы перерисовку всего блока на каждое
   событие прокрутки — а это как раз и приводило к рывкам.
   Здесь же анимация просто читает свежее число каждый кадр.

   Скорость измеряется в пикселях за секунду, а не за кадр:
   иначе на мониторе 120 Гц цветы вели бы себя иначе, чем
   на обычном 60 Гц.
   ============================================================ */

/* Какую скорость прокрутки считать «очень быстрой», px/сек */
const FAST_SPEED = 2000;

/* Насколько плавно скорость возвращается к нулю после
   остановки. 0.9 — мягкое затухание примерно за треть секунды. */
const DECAY = 0.9;

export default function useScrollVelocity() {
  const velocity = useRef({ speed: 0, signed: 0 });

  useEffect(() => {
    // Если человек отключил анимации в системе — оставляем ноль
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let lastY = window.scrollY;
    let lastTime = performance.now();
    let frameId;

    function onScroll() {
      const now = performance.now();
      const deltaPx = window.scrollY - lastY;
      // Нижняя граница защищает от деления на очень малое число
      const deltaSec = Math.max((now - lastTime) / 1000, 0.008);

      lastY = window.scrollY;
      lastTime = now;

      const pxPerSec = deltaPx / deltaSec;
      const signed = Math.max(-1, Math.min(1, pxPerSec / FAST_SPEED));

      velocity.current = { speed: Math.abs(signed), signed };
    }

    /* Затухание. Пока страницу листают, обработчик выше
       постоянно подкидывает свежие значения. Как только
       прокрутка замерла, событий больше нет — и этот цикл
       плавно уводит скорость к нулю. */
    function decay() {
      const v = velocity.current;
      if (v.speed > 0.001) {
        velocity.current = {
          speed: v.speed * DECAY,
          signed: v.signed * DECAY,
        };
      }
      frameId = requestAnimationFrame(decay);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    decay();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return velocity;
}
