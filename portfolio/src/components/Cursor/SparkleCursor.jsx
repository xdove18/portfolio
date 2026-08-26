import { useEffect, useRef, useState } from "react";
import { SPARKLE_PATH } from "../icons/Icons";
import s from "./SparkleCursor.module.css";

/* ============================================================
   КУРСОР-ИСКРА
   ============================================================
   Заменяет обычную стрелку мыши на искру из логотипа.
   Работает на всех страницах сайта.

   Что он умеет:
   • постоянно медленно вращается;
   • плавно догоняет мышь, а не прыгает рывками;
   • над ссылками и кнопками подрастает и обводится кольцом;
   • над фотографиями превращается в большое кольцо с бегущей
     по кругу надписью «нажми на меня»;
   • «выворачивает» цвет под собой (режим difference), поэтому
     виден и на светлом фоне, и на чёрном футере.

   На телефонах и планшетах не показывается — там нет мыши.
   ============================================================ */

/* Подписи, которые бегут по кругу у большого курсора.
   Ключ — значение атрибута data-cursor у элемента страницы.

   Как повесить подпись на любой элемент:
   <div data-cursor="drag"> — появится «подвинь меня»
   <div data-cursor="image"> — появится «нажми на меня»

   Чтобы добавить свою подпись, допишите строку сюда
   и поставьте элементу такой же data-cursor. */
const LABELS = {
  image: "нажми на меня",
  drag: "подвинь меня",
};

export default function SparkleCursor() {
  const dotRef = useRef(null);

  /* Над чем сейчас курсор:
     ""      — ни над чем
     "link"  — ссылка или кнопка
     "image" — фотография, которую можно открыть
     "drag"  — цветок, который можно подвинуть */
  const [mode, setMode] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    /* Проверяем, есть ли у устройства настоящая мышь.
       hover: hover — правда только для мыши и трекпада,
       на телефоне это условие не выполняется. */
    const hasMouse = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!hasMouse) return;

    const dot = dotRef.current;
    if (!dot) return;

    // Где мышь сейчас и где курсор-искра догоняет её
    let target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let frameId;

    function onMouseMove(event) {
      target = { x: event.clientX, y: event.clientY };
      setVisible(true);

      /* Определяем, над чем находится мышь.
         closest() поднимается вверх по дереву от элемента под
         курсором и ищет ближайшего подходящего родителя —
         поэтому работает и когда мышь над картинкой внутри
         кнопки. */
      const el = event.target;
      const marked = el.closest?.("[data-cursor]");

      if (marked) {
        setMode(marked.dataset.cursor);
      } else if (el.closest?.("a, button, [role='button']")) {
        setMode("link");
      } else {
        setMode("");
      }
    }

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    /* Плавное следование.
       Каждый кадр курсор сдвигается на пятую часть расстояния
       до мыши. Получается мягкое «догоняющее» движение вместо
       резких скачков. Меньше 0.2 — курсор ленивее, больше —
       ближе к обычной стрелке. */
    function tick() {
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;

      dot.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;

      frameId = requestAnimationFrame(tick);
    }

    tick();

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Прячем системную стрелку на всей странице
    document.body.classList.add(s.hideNativeCursor);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.body.classList.remove(s.hideNativeCursor);
    };
  }, []);

  // Текст подписи для текущего режима. Если его нет — курсор
  // остаётся маленьким, без круга с надписью.
  const label = LABELS[mode];

  return (
    <div
      ref={dotRef}
      className={[
        s.cursor,
        visible ? s.visible : "",
        pressed ? s.pressed : "",
        label ? s.overImage : "",
        mode === "link" ? s.overLink : "",
      ].join(" ")}
      aria-hidden="true"
    >
      {/* Кольцо — появляется над ссылками и фотографиями */}
      <span className={s.ring} />

      {/* Искра из логотипа — та же форма, что и в шапке сайта */}
      <svg className={s.sparkle} viewBox="0 0 24 24">
        <path d={SPARKLE_PATH} />
      </svg>

      {/* Надпись по кругу — только над фотографиями.
          Она же служит окантовкой: отдельное кольцо в этом
          состоянии не рисуется, иначе получается каша. */}
      <svg className={s.label} viewBox="0 0 100 100">
        <defs>
          {/* Невидимая окружность, вдоль которой ляжет текст */}
          <path
            id="sparkleCursorCircle"
            d="M50,50 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0"
            fill="none"
          />
        </defs>

        <text className={s.labelText}>
          <textPath href="#sparkleCursorCircle" startOffset="0%">
            {/* Подпись повторяется дважды, чтобы замкнуть круг */}
            {label ? `${label} · ${label} ·` : ""}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
