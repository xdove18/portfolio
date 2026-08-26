import { useEffect, useRef, useState } from "react";
import { asset } from "../../utils/asset";
import { isSlowNetwork } from "../../utils/network";
import s from "./Projects.module.css";

/* ============================================================
   ВИДЕО НА ОБЛОЖКЕ ПАПКИ
   ============================================================
   Под видео всегда лежит рисованный знак проекта. Видео
   появляется поверх него, когда загрузится. Благодаря этому
   обложка никогда не бывает пустой: сначала видно рисунок,
   потом он сменяется видео.

   Видео грузится по двум правилам:

   1. Только когда карточка появилась на экране — пока человек
      не долистал до проектов, видео для браузера не существует.

   2. Не грузится совсем, если человек включил экономию трафика
      или сеть совсем медленная (2G). Тогда навсегда остаётся
      рисунок — и страница не тратит мегабайты впустую.
   ============================================================ */

export default function CoverVideo({ src, className, fallback }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (isSlowNetwork()) {
      setSkip(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    /* IntersectionObserver сообщает, когда элемент показался
       на экране. rootMargin: 300px — начинаем чуть заранее,
       чтобы видео успело подготовиться. */
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Подложка: видна всегда, пока видео не готово */}
      {fallback}

      {/* Видео появляется поверх рисунка, когда загрузилось */}
      {!skip && (
        <video
          ref={ref}
          className={`${className || s.coverVideo} ${
            ready ? s.coverVideoReady : ""
          }`}
          src={visible ? asset(src) : undefined}
          autoPlay={visible}
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          /* Проявляем видео только когда есть что показывать,
             иначе на мгновение мелькнёт пустой прямоугольник */
          onCanPlay={() => setReady(true)}
        />
      )}
    </>
  );
}
