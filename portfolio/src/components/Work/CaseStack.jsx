import { Link } from "react-router-dom";
import { projects } from "../../data/projects";
import { thumb } from "../Case/imagePath";
import { fixHangingWords } from "../../utils/typography";
import { ArrowIcon } from "../icons/Icons";
import s from "./CaseStack.module.css";

/* ============================================================
   СТОПКА КЕЙСОВ
   ============================================================
   Кейсы лежат друг на друге, как папки в стопке. При прокрутке
   каждая следующая карточка наезжает на предыдущую и
   останавливается чуть ниже — так наверху копятся корешки
   с номером и названием, и видно, сколько кейсов уже прошло.

   Делается это одним свойством — position: sticky у карточки.
   Никакого кода, который следит за прокруткой, здесь нет:
   всё считает браузер сам, поэтому листается плавно.

   Карточки берутся из src/data/projects.js. Добавите кейс
   туда — он появится в стопке сам.
   ============================================================ */

export default function CaseStack() {
  const кейсы = projects.filter((p) => !p.comingSoon);

  return (
    <div className={s.stack} id="works">
      {кейсы.map((кейс, i) => (
        <article
          key={кейс.slug}
          className={s.card}
          /* Номер карточки в стопке. По нему считается, на
             сколько ниже предыдущей она остановится. */
          style={{ "--i": i }}
        >
          <Link to={`/projects/${кейс.slug}`} className={s.link}>
            {/* ---- КОРЕШОК ----
                Единственная часть карточки, которая остаётся
                видна, когда сверху легла следующая */}
            <div className={s.spine}>
              <span className={s.num}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={s.spineTitle}>{кейс.title}</span>
              <span className={s.niche}>{кейс.niche}</span>
            </div>

            {/* ---- ОБЛОЖКА ---- */}
            <div
              className={`${s.cover} ${кейс.coverWide ? s.coverWide : ""}`}
            >
              {(кейс.cover || []).map((src) => (
                <img
                  key={src}
                  src={thumb(src)}
                  alt=""
                  loading="lazy"
                  className={s.shot}
                />
              ))}
            </div>

            {/* ---- ПОДПИСЬ ---- */}
            <div className={s.body}>
              <p className={s.text}>{кейс.cardText}</p>
              <span className={s.go}>
                {fixHangingWords("смотреть кейс")}
                <ArrowIcon size={15} />
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
