import { site } from "../../data/site";
import { stack } from "../../data/stack";
import { fixHangingWords } from "../../utils/typography";
import RichText from "../Case/RichText";
import s from "./Bio.module.css";

/* ============================================================
   БЛОК «О СЕБЕ»
   ============================================================
   Строгая версия: опыт списком, образование и инструменты
   одной строкой. Весь текст берётся из src/data/site.js —
   того же места, что и раньше.
   ============================================================ */

export default function Bio() {
  const { about } = site;

  return (
    <section className={s.bio} id="about">
      <h2 className={s.title}>{fixHangingWords("О себе")}</h2>

      <p className={s.lead}>{about.text}</p>

      {/* ---------- ОПЫТ ---------- */}
      <div className={s.rows}>
        {about.experience.map((место) => (
          <div className={s.row} key={место.years + место.title}>
            <div className={s.years}>{место.years}</div>

            <div className={s.job}>
              <h3 className={s.jobTitle}>
                {место.url ? (
                  <a href={место.url} target="_blank" rel="noreferrer">
                    {место.title}
                  </a>
                ) : (
                  место.title
                )}
              </h3>

              {место.text && (
                <p className={s.jobText}>
                  <RichText>{место.text}</RichText>
                </p>
              )}

              {место.points?.length > 0 && (
                <ul className={s.points}>
                  {место.points.map((пункт, i) => (
                    <li key={i}>
                      <RichText>{пункт}</RichText>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        {/* ---------- ОБРАЗОВАНИЕ ---------- */}
        <div className={s.row}>
          <div className={s.years}>{fixHangingWords("образование")}</div>
          <div className={s.job}>
            <h3 className={s.jobTitle}>{about.education.full}</h3>
            <p className={s.jobText}>{about.education.speciality}</p>
          </div>
        </div>

        {/* ---------- ИНСТРУМЕНТЫ ----------
            Одной строкой вместо отдельного раздела: список
            программ сам по себе ничего не говорит о работе. */}
        <div className={s.row}>
          <div className={s.years}>{fixHangingWords("инструменты")}</div>
          <div className={s.job}>
            <p className={s.tools}>
              {stack.map((п) => п.name).join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
