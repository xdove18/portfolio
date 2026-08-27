import { useCallback, useEffect, useState } from "react";
import { lockScroll, unlockScroll } from "../utils/scrollLock";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Projects from "../components/Projects/Projects";
import Stack from "../components/Stack/Stack";
import Footer from "../components/Footer/Footer";
import Intro from "../components/Intro/Intro";
import { site } from "../data/site";

/* ============================================================
   ГЛАВНАЯ СТРАНИЦА
   ============================================================
   Порядок секций задаётся здесь: чтобы поменять их местами,
   просто переставьте строки внутри <main>.

   Как часто показывать заставку с цветами — настраивается
   в файле src/data/site.js, поле introMode.
   ============================================================ */

/* Ключ, под которым браузер запоминает дату последнего показа
   заставки. Нужен только для режима «раз в сутки». */
const INTRO_KEY = "introLastShown";

/* Решает, показывать ли заставку сейчас.
   Режим задаётся в файле src/data/site.js, поле introMode. */
function shouldShowIntro() {
  if (site.introMode === "off") return false;

  // Человек отключил анимации в системе — заставку не показываем
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  if (site.introMode === "once-a-day") {
    /* localStorage — долгая память браузера, переживает
       закрытие вкладки. Храним дату последнего показа
       и сравниваем с сегодняшней. */
    const last = localStorage.getItem(INTRO_KEY);
    const today = new Date().toDateString();
    return last !== today;
  }

  // "every-visit" и любое другое значение — показываем всегда
  return true;
}

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (shouldShowIntro()) setShowIntro(true);
  }, []);

  // useCallback нужен, чтобы функция не создавалась заново
  // при каждой перерисовке — иначе таймеры в заставке
  // сбрасывались бы и она не заканчивалась
  const finishIntro = useCallback(() => {
    if (site.introMode === "once-a-day") {
      localStorage.setItem(INTRO_KEY, new Date().toDateString());
    }
    setShowIntro(false);
  }, []);

  /* Пока идёт заставка — страница под ней не прокручивается */
  useEffect(() => {
    if (!showIntro) return;

    lockScroll();
    return unlockScroll;
  }, [showIntro]);

  return (
    <>
      {showIntro && <Intro onDone={finishIntro} />}

      <Header />

      <main>
        <Hero />
        <About />
        <Projects />
        <Stack />
      </main>

      <Footer />
    </>
  );
}
