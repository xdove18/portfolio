import { useEffect, useRef } from "react";
import CatMascot from "./CatMascot";
import s from "./CatMascot.module.css";

// Пол — нижний край окна, пока в него не входит верх футера.
export default function CaseCat() {
  const rail = useRef(null);

  useEffect(() => {
    const footer = document.getElementById("contacts");
    const prose = document.querySelectorAll(
      "[data-case-content] p, [data-case-content] li, [data-case-content] h2, [data-case-content] h3, [data-case-content] table"
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = footer?.getBoundingClientRect().top ?? window.innerHeight;
      const bottom = Math.max(0, window.innerHeight - top);
      const overFooter = top < window.innerHeight;
      // Начало сцены не зависит от прокрутки: смена начала координат
      // при появлении футера переносила кошку в другую часть окна.
      const left = Math.max(0, document.documentElement.clientWidth - 280);
      const floor = Math.min(top, window.innerHeight);
      // Широкий текст теперь доходит до правого края. Не перекрываем
      // его кошкой: на иллюстрациях и у футера она остаётся видимой.
      const coversText = !overFooter && [...prose].some((element) => {
        const rect = element.getBoundingClientRect();
        return rect.right > left && rect.left < window.innerWidth &&
          rect.bottom > floor - 140 && rect.top < floor;
      });
      rail.current.style.left = `${left}px`;
      rail.current.style.bottom = `${Math.round(bottom)}px`;
      rail.current.hidden = top < 180 || coversText;
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
