import { useEffect, useRef, useState } from "react";
import { isSlowNetwork } from "../../utils/network";
import RichText from "./RichText";
import s from "./Case.module.css";

/* ============================================================
   ДЕМО-ВИДЕО: КАК ЧЕЛОВЕК ПОЛЬЗУЕТСЯ ПРИЛОЖЕНИЕМ
   ============================================================
   Как описать в src/data/projects.js.

   Одно видео:

   demoVideo: {
     src: "/images/projects/checkout/demo-flow.mp4",
     poster: "/images/projects/checkout/demo-flow-poster.webp",
     title: "Как проходит новый чекаут",
     note: "Короткое пояснение под видео",   // необязательно
   }

   Несколько видео — тот же блок, только в квадратных скобках
   и через запятую:

   demoVideo: [
     { src: "...", poster: "...", title: "Регистрация" },
     { src: "...", poster: "...", title: "Покупка" },
   ]

   poster — картинка первого кадра. Она лёгкая (десятки
   килобайт) и показывается сразу, пока видео не загружено.
   Без неё какое-то время висел бы пустой прямоугольник.
   ============================================================ */

export default function DemoVideo({ demo }) {
  if (!demo) return null;

  // Принимаем и одно видео, и список — чтобы в projects.js
  // можно было писать как удобнее
  const clips = (Array.isArray(demo) ? demo : [demo]).filter((c) => c && c.src);
  if (clips.length === 0) return null;

  return <DemoRow clips={clips} />;
}

/* ------------------------------------------------------------
   РЯД ВИДЕО, КОТОРЫЕ ИГРАЮТ ПО ОЧЕРЕДИ
   ------------------------------------------------------------
   Главное правило: в любой момент играет ровно одно видео.
   Закончилось — очередь переходит к следующему, после
   последнего начинается сначала.

   На компьютере видео стоят в ряд, все на виду, и очередь
   идёт сама: человек ничего не нажимает.

   На телефоне они стоят друг под другом, и правила два:
   очередь не начинается сама (первое видео человек включает
   сам, когда захочет), а следующее ждёт, пока до него
   долистают, и только тогда начинается — с начала.

   Всё это заодно бережёт телефон и мобильный интернет:

   • Целиком скачивается только то видео, которое играет
     сейчас, и следующее за ним. Остальные лежат картинками.

   • Один работающий видеоплеер вместо трёх. Три сразу
     заметно греют телефон и дёргают прокрутку.

   • Отлистали в сторону — видео встало на паузу.
   ------------------------------------------------------------ */
function DemoRow({ clips }) {
  const items = useRef([]);   // рамки вокруг каждого видео
  const videos = useRef([]);  // сами видеоэлементы

  const [inView, setInView] = useState(() => clips.map(() => false));
  const [active, setActive] = useState(null); // чья сейчас очередь
  const [userPaused, setUserPaused] = useState(false);
  const [fsIndex, setFsIndex] = useState(null); // что развёрнуто на весь экран

  const many = clips.length > 1;
  const single = clips.length === 1;

  /* Запускать ли очередь самостоятельно. На телефоне и на
     медленной связи — нет: пусть человек решает сам.
     Проверяем один раз, при первом показе блока. */
  const [autoStart] = useState(
    () =>
      !isSlowNetwork() &&
      !window.matchMedia("(max-width: 768px), (hover: none)").matches
  );

  /* Следим за каждым видео отдельно: какое сейчас на экране.
     Отдельно, а не за всем блоком целиком — на телефоне блок
     из трёх видео в разы выше экрана, и «виден ли он» было бы
     бессмысленным вопросом. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setInView((prev) => {
          const next = [...prev];
          let changed = false;

          entries.forEach((entry) => {
            const i = items.current.indexOf(entry.target);
            if (i >= 0 && next[i] !== entry.isIntersecting) {
              next[i] = entry.isIntersecting;
              changed = true;
            }
          });

          return changed ? next : prev;
        });
      },
      /* Видео считается «на экране», когда оно попало в среднюю
         часть окна: сверху и снизу отрезаем по 12%. Так оно не
         запускается от того, что из-за края экрана выглянула
         макушка телефона. */
      { rootMargin: "-12% 0px -12% 0px" }
    );

    items.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ---------- РЕЖИМ «НА ВЕСЬ ЭКРАН» ----------
     Следим, развернул ли человек видео кнопкой в полосе
     управления. Это важно знать вот почему: когда видео
     разворачивается, страница под ним для браузера перестаёт
     быть видимой. Наблюдатель выше честно сообщает «видео
     ушло с экрана», и код ниже поставил бы его на паузу —
     человек увидел бы застывший кадр во весь экран.
     Поэтому, пока видео развёрнуто, мы им не командуем. */
  useEffect(() => {
    function onChange() {
      const el = document.fullscreenElement || document.webkitFullscreenElement;
      const i = el ? videos.current.indexOf(el) : -1;

      setFsIndex(i >= 0 ? i : null);

      // Развернули — значит очередь теперь у этого видео
      if (i >= 0) {
        setActive(i);
        setUserPaused(false);
      }
    }

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);

    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // Первое видео показалось на экране — начинаем очередь
  useEffect(() => {
    if (autoStart && active === null && inView[0]) setActive(0);
  }, [autoStart, active, inView]);

  /* Человек уходил на другую вкладку и вернулся.
     Пока вкладка в фоне, браузер не даёт видео играть, и оно
     остаётся стоять даже после возвращения. Этот счётчик
     просто заставляет проверить всё заново. */
  const [wake, setWake] = useState(0);

  useEffect(() => {
    function onVisible() {
      if (!document.hidden) setWake((n) => n + 1);
    }

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  /* Играет только то видео, чья очередь, и только если оно
     сейчас на экране. Остальные — на паузе и отмотаны в начало,
     чтобы в свою очередь начаться сначала, а не с середины. */
  useEffect(() => {
    // Развёрнутым на весь экран управляет сам человек
    if (fsIndex !== null) return;

    videos.current.forEach((video, i) => {
      if (!video || i === active) return;
      video.pause();
      if (video.currentTime > 0) video.currentTime = 0;
    });

    const video = videos.current[active];
    if (!video) return;

    if (inView[active] && !userPaused) {
      /* play() возвращает обещание, и браузер имеет право
         отказать — например, если вкладка ушла в фон.
         Это не ошибка, просто ничего не делаем. */
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, inView, userPaused, wake, fsIndex]);

  // Видео доиграло — передаём очередь следующему, по кругу
  function playNext(i) {
    setUserPaused(false);
    setActive((i + 1) % clips.length);
  }

  return (
    <div className={s.demoBlock}>
      {/* Для одного видео заголовком служит его собственное
          название, для нескольких — общая подпись над рядом */}
      {many ? (
        <h3 className={s.subTitle}>как это работает</h3>
      ) : (
        clips[0].title && <h3 className={s.subTitle}>{clips[0].title}</h3>
      )}

      {many && (
        <p className={s.demoHint}>
          {autoStart
            ? "Видео идут по очереди: закончится одно — начнётся следующее."
            : "Нажмите на первое видео — дальше они пойдут по очереди."}
        </p>
      )}

      <div className={many ? s.demoGrid : undefined}>
        {clips.map((clip, i) => (
          <div
            className={s.demoItem}
            key={clip.src}
            ref={(el) => {
              items.current[i] = el;
            }}
          >
            <div className={s.demoFrame}>
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                className={s.demoVideo}
                src={clip.src}
                poster={clip.poster}
                /* Целиком скачиваем только то, что играет сейчас,
                   и следующее по очереди. У остальных берём
                   "metadata" — это несколько килобайт служебных
                   данных, чтобы работали кнопки в полосе
                   управления и была видна длительность. Само
                   видео не качается.

                   Проверка active !== null обязательна: пока
                   очередь не началась, качать нечего. */
                preload={
                  active !== null && (i === active || i === active + 1)
                    ? "auto"
                    : "metadata"
                }
                /* Одно видео зациклено само на себе; когда их
                   несколько, круг делает очередь */
                loop={single}
                /* muted и playsInline обязательны: без них
                   браузеры запрещают видео запускаться само.
                   playsInline вдобавок оставляет на айфоне
                   кнопку «на весь экран» в полосе управления. */
                muted
                playsInline
                controls
                aria-label={clip.title || "Демонстрация приложения"}
                onPlay={() => {
                  setUserPaused(false);
                  setActive(i);
                }}
                onPause={(event) => {
                  const video = event.currentTarget;

                  /* Досмотрели до конца — браузер тоже присылает
                     «пауза». Это не человек нажал, а ролик
                     кончился: сейчас сработает onEnded и очередь
                     пойдёт дальше. Без этой проверки очередь
                     вставала бы после первого же видео. */
                  if (video.ended) return;
                  if (video.duration - video.currentTime < 0.1) return;

                  // Пауза от нас самих (ушло с экрана, уступило
                  // очередь) — не в счёт, считаем только ручную
                  if (i === active && inView[i]) setUserPaused(true);
                }}
                onEnded={(event) => {
                  /* Во весь экран очередь не передаём: человек
                     развернул конкретное видео и вряд ли ждёт,
                     что вместо него включится соседнее. Просто
                     повторяем это же. */
                  if (fsIndex === i) {
                    event.currentTarget.play().catch(() => {});
                    return;
                  }

                  playNext(i);
                }}
              />
            </div>

            {many && clip.title && (
              <p className={s.demoCaption}>{clip.title}</p>
            )}

            {clip.note && (
              <p className={s.demoNote}>
                <RichText>{clip.note}</RichText>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
