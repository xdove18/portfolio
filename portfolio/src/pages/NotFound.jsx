import { Link } from "react-router-dom";
import Flower from "../components/Flower/Flower";
import s from "./NotFound.module.css";

/* ============================================================
   СТРАНИЦА «НЕ НАЙДЕНО» (404)
   ============================================================
   Показывается, если человек ввёл несуществующий адрес.
   В центре крутится цветок — тот же приём, что и у карточки
   «скоро»: вращение читается как индикатор загрузки.
   ============================================================ */

/* Мелкие цветы вокруг крупного. Каждый крутится со своей
   скоростью и в свою сторону, чтобы картинка не выглядела
   механической. */
const AROUND = [
  { color: "var(--flower-yellow)", size: 34, x: -140, y: -70, dur: 7 },
  { color: "var(--flower-pink)",   size: 26, x: 130,  y: -90, dur: 9 },
  { color: "var(--flower-purple)", size: 30, x: 160,  y: 60,  dur: 6 },
  { color: "var(--flower-orange)", size: 22, x: -160, y: 70,  dur: 11 },
];

export default function NotFound() {
  return (
    <main className={s.page}>
      <div className={s.art}>
        {/* Крупный цветок — крутится ровным темпом, как загрузка */}
        <div className={s.mainFlower}>
          <Flower color="var(--flower-red)" size={130} />
        </div>

        {/* Мелкие цветы вокруг.
            Обязательно два вложенных блока, а не один: внешний
            отвечает за место (сдвиг), внутренний — за вращение.
            Если повесить и то и другое на один блок, вращение
            затирает сдвиг, и все цветы сваливаются в кучу
            в середине большого. */}
        {AROUND.map((flower, i) => (
          <div
            key={i}
            className={s.smallFlower}
            style={{ transform: `translate(${flower.x}px, ${flower.y}px)` }}
            aria-hidden="true"
          >
            <div
              className={s.smallSpin}
              style={{
                animationDuration: `${flower.dur}s`,
                animationDirection: i % 2 ? "reverse" : "normal",
              }}
            >
              <Flower color={flower.color} size={flower.size} />
            </div>
          </div>
        ))}
      </div>

      <p className={s.code}>404</p>

      <h1 className={s.title}>Такой страницы нет</h1>

      <p className={s.text}>
        Похоже, ссылка устарела или в адресе опечатка.
        Зато цветок всё ещё крутится.
      </p>

      <Link to="/" className={s.button}>
        Вернуться на главную
      </Link>
    </main>
  );
}
