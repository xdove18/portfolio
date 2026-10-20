import RichText from "./RichText";
import { fixHangingWords } from "../../utils/typography";
import s from "./Case.module.css";

/* ============================================================
   ЛЕНТА ВРЕМЕНИ
   ============================================================
   Показывает, как что-то происходит по шагам во времени:
   рабочий день риелтора, неделя с напарником. Не схема пути —
   у схемы есть развилки и стрелки, а здесь просто одно
   за другим.

   Нужна там, где важно не «куда человек нажал», а «когда это
   произошло и где сломалось».

   Как описать в src/data/projects.js:

   timelines: [
     {
       section: "audience",     // в каком разделе показать
       title: "День риелтора",
       note: "Откуда это известно",
       steps: [
         { label: "На объектах", text: "Показы идут один за другим" },
         { label: "Между показами", text: "Записать некогда", tone: "loss" },
       ],
     },
   ]

   tone у шага:
   обычный — ничего не писать
   "loss"   — здесь что-то теряется (красная точка)
   "accent" — здесь главное решение (точка цветом кейса)
   ============================================================ */

export default function Timeline({ data, accent }) {
  if (!data?.steps?.length) return null;

  return (
    <div className={s.timeline}>
      {data.title && (
        <h3 className={s.subTitle}>{fixHangingWords(data.title)}</h3>
      )}

      <ol className={s.timelineList}>
        {data.steps.map((step, i) => (
          <li
            className={[
              s.timelineStep,
              step.tone === "loss" ? s.timelineLoss : "",
              step.tone === "accent" ? s.timelineAccent : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={i}
          >
            {/* Точка на линии. Цвет кейса подставляем только
                главному шагу — остальные нейтральные. */}
            <span
              className={s.timelineDot}
              aria-hidden="true"
              style={
                step.tone === "accent" && accent
                  ? { background: accent, borderColor: accent }
                  : undefined
              }
            />

            <span className={s.timelineWhen}>
              {fixHangingWords(step.label)}
            </span>

            <p className={s.timelineText}>
              <RichText>{step.text}</RichText>
            </p>
          </li>
        ))}
      </ol>

      {data.note && (
        <p className={s.resultsNote}>
          <RichText>{data.note}</RichText>
        </p>
      )}
    </div>
  );
}

/* Все ленты, которые относятся к одному разделу кейса.
   Устроено так же, как TablesFor: у ленты есть поле section,
   и она появляется только в своём разделе. */
export function TimelinesFor({ timelines, section, accent }) {
  if (!timelines) return null;

  const list = timelines.filter((t) => t.section === section);
  if (list.length === 0) return null;

  return (
    <>
      {list.map((item, i) => (
        <Timeline key={i} data={item} accent={accent} />
      ))}
    </>
  );
}
