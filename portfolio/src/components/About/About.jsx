import { site } from "../../data/site";
import { asset } from "../../utils/asset";
import StrengthIcon from "./StrengthIcons";
import RichText from "../Case/RichText";
import Letter from "./Letter";
import s from "./About.module.css";

/* ============================================================
   РАЗДЕЛ «ОБО МНЕ»
   ============================================================
   Слева фото в рамке из мелких цветков, справа — текст,
   образование и опыт работы.
   ============================================================ */


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

            </div>
          </div>

          {/* ---------- ПРАВАЯ КОЛОНКА: ТЕКСТ ---------- */}
          <div className={s.textCol}>
            <h2 className={s.title}>{site.about.title}</h2>
            <p className={s.lead}>{site.about.text}</p>

            {/* Опыт работы — выше образования: для работодателя
                это главное, что он ищет на странице */}
            <div className={s.block}>
              <h3 className={s.blockTitle}>Опыт</h3>
              <ul className={s.experience}>
                {site.about.experience.map((job, i) => (
                  <li className={s.job} key={i}>
                    <span className={s.jobYears}>{job.years}</span>
                    <span className={s.jobBody}>
                      {/* Если у места работы указан сайт,
                          название становится ссылкой на него */}
                      {job.url ? (
                        <a
                          className={`${s.jobTitle} ${s.jobLink}`}
                          href={job.url}
                          target="_blank"
                          /* noreferrer — чтобы чужой сайт не получил
                             доступ к вкладке, из которой его открыли */
                          rel="noreferrer"
                        >
                          {job.title}
                        </a>
                      ) : (
                        <span className={s.jobTitle}>{job.title}</span>
                      )}

                      {/* Описание показываем, только если оно есть */}
                      {job.text && (
                        <span className={s.jobText}>
                          <RichText>{job.text}</RichText>
                        </span>
                      )}

                      {/* Список дел. Выделения **жирным** и ==цветом==
                          работают так же, как в текстах кейсов. */}
                      {job.points?.length > 0 && (
                        <ul className={s.jobPoints}>
                          {job.points.map((point, k) => (
                            <li key={k}>
                              <RichText>{point}</RichText>
                            </li>
                          ))}
                        </ul>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

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

            {/* Благодарственное письмо. Настраивается
                в src/data/site.js, блок letter. */}
            <Letter />
          </div>
        </div>
      </div>
    </section>
  );
}
