import { useState } from "react";
import RichText from "./RichText";
import s from "./Case.module.css";

/* ============================================================
   АНАЛИЗ КОНКУРЕНТОВ
   ============================================================
   По умолчанию блок свёрнут — видна только сводка.
   По кнопке разворачивается карточка первого конкурента,
   дальше листаем кнопкой «следующий». После последнего
   блок сворачивается обратно.

   У конкурента можно указать логотип и скриншот интерфейса:
   logo:  "/images/projects/habits/logo-habitica.webp"
   image: "/images/projects/habits/page-habitica.webp"
   Если их нет — вместо логотипа рисуется кружок с буквой.
   ============================================================ */

export default function Competitors({ competitors, summary, accent }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const list = competitors || [];

  /* Раздел появляется, если есть хотя бы сводка по рынку.
     Карточки конкурентов при этом не обязательны: в некоторых
     кейсах достаточно общего вывода без разбора по каждому. */
  if (!summary && list.length === 0) return null;

  const hasCards = list.length > 0;
  const current = list[index];
  const isLast = index === list.length - 1;

  function next() {
    if (isLast) {
      // После последнего сворачиваем блок и возвращаемся к первому
      setOpen(false);
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  }

  return (
    <section className={s.block} id="market">
      <h2 className={s.blockTitle}>Рынок</h2>

      <div className={s.summary}>
        <p className={s.summaryText}>
          <RichText>{summary}</RichText>
        </p>

        {/* Кнопку показываем только если есть что разворачивать */}
        {hasCards && !open && (
          <button
            className={s.expandBtn}
            style={{ background: accent }}
            onClick={() => setOpen(true)}
          >
            развернуть анализ конкурентов
          </button>
        )}
      </div>

      {hasCards && open && (
        <div className={s.competitor}>
          <div className={s.competitorHead}>
            {current.logo ? (
              <img
                className={s.competitorLogoImg}
                src={current.logo}
                alt=""
                loading="lazy"
              />
            ) : (
              <span
                className={s.competitorLogo}
                style={{ background: current.color || accent }}
              >
                {current.name.charAt(0)}
              </span>
            )}

            <h3 className={s.competitorName}>{current.name}</h3>

            <span className={s.competitorCount}>
              {index + 1} из {list.length}
            </span>
          </div>

          {/* Скриншот интерфейса конкурента */}
          {current.image && (
            <img
              className={s.competitorShot}
              src={current.image}
              alt={`Интерфейс ${current.name}`}
              loading="lazy"
              data-cursor="image"
            />
          )}

          <div className={s.prosCons}>
            <div>
              <h4 className={s.prosTitle}>плюсы</h4>
              <ul className={s.list}>
                {current.pros.map((item, i) => (
                  <li key={i}>
                    {/* Если пункт записан как {title, text} —
                        показываем заголовок жирным, иначе просто текст */}
                    {typeof item === "string" ? (
                      <RichText>{item}</RichText>
                    ) : (
                      <>
                        <strong className={s.listLead}>{item.title}</strong>
                        <RichText>{item.text}</RichText>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={s.consTitle}>минусы</h4>
              <ul className={s.list}>
                {current.cons.map((item, i) => (
                  <li key={i}>
                    {typeof item === "string" ? (
                      <RichText>{item}</RichText>
                    ) : (
                      <>
                        <strong className={s.listLead}>{item.title}</strong>
                        <RichText>{item.text}</RichText>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button className={s.nextBtn} onClick={next}>
            {isLast ? "свернуть" : "следующий конкурент →"}
          </button>
        </div>
      )}
    </section>
  );
}
