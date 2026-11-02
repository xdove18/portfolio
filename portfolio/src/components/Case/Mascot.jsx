import { useEffect, useRef, useState } from "react";
import { asset } from "../../utils/asset";
import s from "./Mascot.module.css";

/* ============================================================
   КОТ В ЛЕВОЙ КОЛОНКЕ
   ============================================================
   Сидит в углу под оглавлением, водит хвостом, дёргает ушами
   и моргает. Если по нему нажать — встаёт, поворачивается
   и неспешно уходит в другой угол, там садится снова.

   Как он устроен. Сидящий кот собран из слоёв: тело, два уха,
   кончик хвоста и веки. Уши и хвост браузер поворачивает сам,
   веки просто появляются на полсекунды — получается моргание.
   Все слои лежат в одной точке и одного размера, поэтому их
   не нужно подгонять друг к другу.

   Походка — лента из восьми кадров (walk.webp). В каждом кадре
   лапы повёрнуты по-своему, поэтому кот именно шагает, а не
   едет. Лента листается шагами, как диафильм.

   Если в системе включено «уменьшить движение», кот просто
   сидит и никуда не ходит.

   Картинки лежат в public/images/cat.
   ============================================================ */

/* Сколько длится переход в другой угол и как часто моргать */
const ХОДЬБА = 4600;          // миллисекунд на дорогу
const ПОВОРОТ = 320;          // пауза на разворот до и после
const МОРГАНИЕ = [3200, 7000]; // промежуток между морганиями

export default function Mascot() {
  /* Угол: "left" или "right" */
  const [угол, setУгол] = useState("left");
  /* Что кот делает: "sit" | "turn" | "walk" */
  const [чем_занят, setЧемЗанят] = useState("sit");
  const [моргает, setМоргает] = useState(false);

  const таймеры = useRef([]);

  /* Чистим все отложенные шаги при уходе со страницы */
  useEffect(() => () => таймеры.current.forEach(clearTimeout), []);

  /* Моргание: случайный промежуток, иногда два раза подряд */
  useEffect(() => {
    if (чем_занят !== "sit") return undefined;

    let таймер;
    function моргнуть() {
      setМоргает(true);
      таймер = setTimeout(() => {
        setМоргает(false);
        const ещё = Math.random() < 0.3;
        таймер = setTimeout(
          моргнуть,
          ещё
            ? 220
            : МОРГАНИЕ[0] + Math.random() * (МОРГАНИЕ[1] - МОРГАНИЕ[0])
        );
      }, 150);
    }

    таймер = setTimeout(моргнуть, 1500 + Math.random() * 2000);
    return () => clearTimeout(таймер);
  }, [чем_занят]);

  function перейти() {
    if (чем_занят !== "sit") return;

    const куда = угол === "left" ? "right" : "left";
    const шаг = (мс, что) => таймеры.current.push(setTimeout(что, мс));

    setЧемЗанят("turn");
    шаг(ПОВОРОТ, () => {
      setЧемЗанят("walk");
      setУгол(куда);
    });
    шаг(ПОВОРОТ + ХОДЬБА, () => setЧемЗанят("turn"));
    шаг(ПОВОРОТ + ХОДЬБА + ПОВОРОТ, () => setЧемЗанят("sit"));
  }

  /* Кот смотрит туда, куда идёт. Картинка нарисована мордой
     влево, поэтому вправо её нужно отзеркалить. */
  const смотрит_вправо = чем_занят === "walk" && угол === "right";

  return (
    <button
      type="button"
      className={[
        s.кот,
        s[угол],
        чем_занят === "walk" ? s.идёт : "",
        смотрит_вправо ? s.вправо : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--дорога": `${ХОДЬБА}ms`,
        "--лента": `url(${asset("/images/cat/walk.webp")})`,
      }}
      onClick={перейти}
      aria-label="Кот. Нажмите — перейдёт в другой угол"
      title="Нажмите на кота"
    >
      {чем_занят === "walk" ? (
        <span className={s.походка} aria-hidden="true" />
      ) : чем_занят === "turn" ? (
        <img
          className={s.анфас}
          src={asset("/images/cat/front.webp")}
          alt=""
        />
      ) : (
        <span className={s.сидит} aria-hidden="true">
          <img className={s.ухо_л} src={asset("/images/cat/sit-ear-left.webp")} alt="" />
          <img className={s.ухо_п} src={asset("/images/cat/sit-ear-right.webp")} alt="" />
          <img className={s.хвост} src={asset("/images/cat/sit-tail.webp")} alt="" />
          <img className={s.тело} src={asset("/images/cat/sit-body.webp")} alt="" />
          <img
            className={s.веки}
            src={asset("/images/cat/sit-blink.webp")}
            alt=""
            style={{ opacity: моргает ? 1 : 0 }}
          />
        </span>
      )}
    </button>
  );
}
