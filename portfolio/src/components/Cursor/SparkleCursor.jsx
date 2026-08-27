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

/* ------------------------------------------------------------
   НАСКОЛЬКО БЫСТРО КУРСОР ДОГОНЯЕТ МЫШЬ
   ------------------------------------------------------------
   Число в «разах в секунду». Чем больше, тем резче курсор
   бросается за мышью; чем меньше, тем ленивее и мягче тянется.

   13  — мягкое, чуть запаздывающее движение (так сейчас)
   20  — заметно живее
   40  — почти как обычная стрелка

   Важно: скорость считается от ВРЕМЕНИ, а не от числа кадров.
   Раньше курсор за каждый кадр проходил пятую часть пути до
   мыши — и это была ошибка. На обычном мониторе (60 кадров
   в секунду) движение получалось мягким, а на быстром
   (120 или 144 кадра) тот же код срабатывал вдвое чаще, и
   курсор дёргался за мышью вдвое резче. Теперь на любом
   мониторе он движется одинаково.
   ------------------------------------------------------------ */
const СКОРОСТЬ = 13;

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
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };

    let frameId = 0;
    let идётАнимация = false;
    let прошлоеВремя = 0;

    /* Элемент под мышью, который ещё не проверили.
       Проверку «над чем мы» делаем не на каждое движение мыши,
       а один раз за кадр — см. пояснение в tick(). */
    let элементПодМышью = null;

    // Помним, что уже показали, чтобы не дёргать перерисовку зря
    let показанРежим = "";
    let показанаВидимость = false;

    function onMouseMove(event) {
      target.x = event.clientX;
      target.y = event.clientY;
      элементПодМышью = event.target;

      if (!показанаВидимость) {
        показанаВидимость = true;
        setVisible(true);
      }

      запустить();
    }

    /* Определяем, над чем находится мышь.
       closest() поднимается вверх по дереву от элемента под
       курсором и ищет ближайшего подходящего родителя —
       поэтому работает и когда мышь над картинкой внутри
       кнопки. */
    function определитьРежим(el) {
      const marked = el.closest?.("[data-cursor]");
      if (marked) return marked.dataset.cursor;
      if (el.closest?.("a, button, [role='button']")) return "link";
      return "";
    }

    function tick(время) {
      /* Сколько секунд прошло с прошлого кадра. Потолок в 0.1
         нужен на случай, когда вкладка была свёрнута: иначе
         курсор рванул бы через весь экран одним прыжком. */
      const шаг = Math.min((время - прошлоеВремя) / 1000, 0.1);
      прошлоеВремя = время;

      /* Доля пути до мыши, которую проходим за этот кадр.
         Формула даёт одинаковое движение при любой частоте
         обновления экрана. */
      const доля = 1 - Math.exp(-СКОРОСТЬ * шаг);

      current.x += (target.x - current.x) * доля;
      current.y += (target.y - current.y) * доля;

      dot.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;

      /* Проверку «над чем мы» делаем здесь, раз в кадр.
         Раньше она шла на каждое движение мыши, а мышь может
         присылать до тысячи движений в секунду — и на каждое
         код лазил вверх по всему дереву страницы и дёргал
         перерисовку. Раз в кадр этого более чем достаточно. */
      if (элементПодМышью) {
        const режим = определитьРежим(элементПодМышью);
        элементПодМышью = null;

        if (режим !== показанРежим) {
          показанРежим = режим;
          setMode(режим);
        }
      }

      /* Догнали мышь — останавливаем цикл до следующего
         движения. Пока курсор стоит на месте, браузер вообще
         ничего не пересчитывает. Раньше цикл крутился без
         остановки и заставлял перерисовывать курсор даже когда
         мышь лежала неподвижно. */
      const далеко =
        Math.abs(target.x - current.x) > 0.05 ||
        Math.abs(target.y - current.y) > 0.05;

      if (!далеко) {
        идётАнимация = false;
        return;
      }

      frameId = requestAnimationFrame(tick);
    }

    function запустить() {
      if (идётАнимация) return;
      идётАнимация = true;
      прошлоеВремя = performance.now();
      frameId = requestAnimationFrame(tick);
    }

    const onLeave = () => {
      показанаВидимость = false;
      setVisible(false);
    };
    const onEnter = () => {
      показанаВидимость = true;
      setVisible(true);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    // Ставим курсор на место сразу, не дожидаясь движения мыши
    dot.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;

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
