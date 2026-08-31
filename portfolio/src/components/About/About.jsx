import { site } from "../../data/site";
import { asset } from "../../utils/asset";
import Flower from "../Flower/Flower";
import StrengthIcon from "./StrengthIcons";
import Letter from "./Letter";
import s from "./About.module.css";

/* ============================================================
   РАЗДЕЛ «ОБО МНЕ»
   ============================================================
   Слева фото в рамке из мелких цветков, справа — текст,
   образование и опыт работы.
   ============================================================ */

/* Мелкие цветки вокруг фото.
   top/left — положение в процентах от рамки.
   Меняйте числа, чтобы переставить цветок. */
const FRAME_FLOWERS = [
  { color: "var(--flower-red)",    size: 46, top: -4,  left: -6 },
  { color: "var(--flower-yellow)", size: 32, top: 8,   left: 96 },
  { color: "var(--flower-purple)", size: 28, top: 34,  left: -8 },
  { color: "var(--flower-pink)",   size: 40, top: 62,  left: 98 },
  { color: "var(--flower-orange)", size: 26, top: 88,  left: -5 },
  { color: "var(--flower-red)",    size: 30, top: 100, left: 74 },
  { color: "var(--flower-yellow)", size: 22, top: 96,  left: 24 },
  { color: "var(--flower-purple)", size: 24, top: -6,  left: 52 },
];

export default function About() {
  return (
    <section className={`section ${s.about}`} id="about">
      <div className="container">
        <div className={s.grid}>
          {/* ---------- ЛЕВАЯ КОЛОНКА: ФОТО ---------- */}
          <div className={s.photoCol}>
            <div className={s.photoFrame}>
              <img
                className={s.photo}
                src={asset("/images/me.webp")}
                alt={`${site.name} — ${site.role}`}
                loading="lazy"   /* картинка грузится, только когда нужна */
              />

              {/* Рамка из цветков. Каждый вращается со своей скоростью,
                  чтобы рамка не выглядела механической. */}
              {FRAME_FLOWERS.map((flower, i) => (
                <div
                  key={i}
                  className={s.frameFlower}
                  style={{
                    top: `${flower.top}%`,
                    left: `${flower.left}%`,
                    animationDuration: `${10 + i * 2}s`,
                    // Разное направление вращения у соседних цветков
                    animationDirection: i % 2 === 0 ? "normal" : "reverse",
                  }}
                  aria-hidden="true"
                >
                  <Flower color={flower.color} size={flower.size} />
                </div>
              ))}
            </div>
          </div>

          {/* ---------- ПРАВАЯ КОЛОНКА: ТЕКСТ ---------- */}
          <div className={s.textCol}>
            <h2 className={s.title}>{site.about.title}</h2>
            <p className={s.lead}>{site.about.text}</p>

            {/* Сильные стороны */}
            <div className={s.strengths}>
              {site.about.strengths.map((item, i) => (
                <div className={s.strength} key={i}>
                  <span className={s.strengthIcon}>
                    <StrengthIcon name={item.icon} />
                  </span>
                  <div className={s.strengthBody}>
                    <p className={s.strengthTitle}>{item.title}</p>
                    <p className={s.strengthText}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Образование */}
            <div className={s.block}>
              <h3 className={s.blockTitle}>Образование</h3>
              <p className={s.eduPlace}>
                {site.about.education.place}
                <span className={s.eduFull}>
                  {" "}
                  — {site.about.education.full}
                </span>
              </p>
              <p className={s.eduSpec}>{site.about.education.speciality}</p>
            </div>

            {/* Опыт работы */}
            <div className={s.block}>
              <h3 className={s.blockTitle}>Опыт</h3>
              <ul className={s.experience}>
                {site.about.experience.map((job, i) => (
                  <li className={s.job} key={i}>
                    <span className={s.jobYears}>{job.years}</span>
                    <span className={s.jobBody}>
                      <span className={s.jobTitle}>{job.title}</span>
                      {/* Описание показываем, только если оно есть */}
                      {job.text && (
                        <span className={s.jobText}>{job.text}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Благодарственное письмо. Настраивается
                в src/data/site.js, блок letter. */}
            <Letter />
          </div>
        </div>
      </div>
    </section>
  );
}
