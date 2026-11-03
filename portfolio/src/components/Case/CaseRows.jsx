import Row from "./Row";
import RichText from "./RichText";
import s from "./Case.module.css";

/* ============================================================
   КОРОТКИЕ БЛОКИ КЕЙСА
   ============================================================
   Ряд «подпись слева — одно-два предложения справа», который
   можно поставить в любой раздел. Нужен там, где готового поля
   нет: «Конкуренты», «Главная гипотеза», «Что сделала».

   Как описать в src/data/projects.js:

   rows: [
     {
       section: "audience",        // в каком разделе показать
       label: "Конкуренты",
       text: "Одно-два предложения.",
     },
   ]

   Порядок внутри раздела — тот, в котором они записаны.
   ============================================================ */

export default function CaseRows({ rows, section }) {
  if (!rows) return null;

  const свои = rows.filter((r) => r.section === section);
  if (свои.length === 0) return null;

  return (
    <>
      {свои.map((строка, i) => (
        <Row label={строка.label} key={i}>
          <p className={s.text}>
            <RichText>{строка.text}</RichText>
          </p>
        </Row>
      ))}
    </>
  );
}
