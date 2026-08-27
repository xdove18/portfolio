import { useEffect, useState } from "react";
import s from "./BackToTop.module.css";

/* ============================================================
   КНОПКА «НАВЕРХ»
   ============================================================
   Появляется в правом нижнем углу, когда человек пролистал
   примерно половину страницы, и увозит его в самое начало.

   Половину, а не «почти до конца»: на длинных страницах
   кейсов возвращаться наверх хочется задолго до конца.

   Порог задаётся числом ниже. 0.5 — это половина, 0.3 —
   треть, 0.7 — две трети.
   ============================================================ */

const ПОРОГ = 0.5;

export default function BackToTop() {
  const [видна, setВидна] = useState(false);

  useEffect(() => {
    function проверить() {
      /* Сколько всего можно прокрутить: вся высота страницы
         минус то, что и так помещается на экране. */
      const всего =
        document.documentElement.scrollHeight - window.innerHeight;

      // Совсем короткая страница — кнопка не нужна
      if (всего < 400) {
        setВидна(false);
        return;
      }

      setВидна(window.scrollY > всего * ПОРОГ);
    }

    проверить();

    /* passive: true — обещание браузеру, что мы не будем
       мешать прокрутке. Благодаря этому она остаётся плавной
       даже на слабом телефоне. */
    window.addEventListener("scroll", проверить, { passive: true });
    window.addEventListener("resize", проверить);

    return () => {
      window.removeEventListener("scroll", проверить);
      window.removeEventListener("resize", проверить);
    };
  }, []);

  function наверх() {
    /* Если человек отключил анимации в системе (бывает при
       мигренях и укачивании) — прыгаем сразу, без прокрутки. */
    const безАнимаций = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({ top: 0, behavior: безАнимаций ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      className={`${s.button} ${видна ? s.visible : ""}`}
      onClick={наверх}
      aria-label="Вернуться наверх страницы"
      /* Пока кнопка спрятана, она не должна ловить нажатия
         и не должна попадать в обход с клавиатуры */
      tabIndex={видна ? 0 : -1}
      aria-hidden={!видна}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
