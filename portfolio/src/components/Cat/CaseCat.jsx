import { useEffect, useRef } from "react";
import CatMascot from "./CatMascot";
import s from "./CatMascot.module.css";

// Пол — нижний край окна, пока в него не входит верх футера.
export default function CaseCat() {
  const rail = useRef(null);

  useEffect(() => {
    const footer = document.getElementById("contacts");
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = footer?.getBoundingClientRect().top ?? window.innerHeight;
      const bottom = Math.max(0, window.innerHeight - top);
      const text = document.querySelector("#overview p");
      const safeLeft = Math.ceil((text?.getBoundingClientRect().right ?? 0) + 24);
      const overFooter = top < window.innerHeight;
      const hasRoom = window.innerWidth - safeLeft >= 220;
      // Начало сцены не зависит от прокрутки: смена начала координат
      // при появлении футера переносила кошку в другую часть окна.
      const left = hasRoom ? safeLeft : Math.max(0, window.innerWidth - 260);
      rail.current.style.left = `${left}px`;
      rail.current.style.bottom = `${Math.round(bottom)}px`;
      rail.current.hidden = top < 180 || (!overFooter && !hasRoom);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={rail} className={s.viewportRail} data-case-cat="">
      <CatMascot autoWalk jumpChance={0} walkDistance={320} />
    </div>
  );
}
