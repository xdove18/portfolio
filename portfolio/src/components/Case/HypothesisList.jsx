import RichText from "./RichText";
import { fixHangingWords } from "../../utils/typography";
import s from "./HypothesisList.module.css";

/* ============================================================
   ГИПОТЕЗЫ СПИСКОМ
   ============================================================
   Раньше это была таблица, и она плохо работала: три колонки
   одинаковой важности, узкая первая, текст ломался — читалось
   как выгрузка из таблицы, а не как ход мысли.

   Теперь это список. У каждой гипотезы слева номер и вердикт,
   справа — сама гипотеза и то, чем она проверялась и что из
   неё вышло. Читается сверху вниз, как рассуждение, и не
   разваливается на телефоне.

   Что нужно у гипотезы в src/data/projects.js:

   text    — сама гипотеза, одной фразой
   status  — "confirmed" (подтвердилась), "partly" (частично
             или косвенно) или "rejected" (опровергнута)
   verdict — подпись вердикта своими словами. Если её нет,
             подставится стандартная
   how     — чем проверялась: интервью, разбор, данные
   conclusion — что из этого вышло в самом интерфейсе

   Обязателен только text. Всё остальное появляется,
   если заполнено.
   ============================================================ */

/* Подписи вердиктов по умолчанию */
const ВЕРДИКТ = {
  confirmed: "подтвердилась",
  partly: "подтвердилась косвенно",
  rejected: "опровергнута",
};

export default function HypothesisList({ items }) {
  if (!items?.length) return null;

  return (
    <ol className={s.list}>
      {items.map((item, i) => {
        const вид = item.status || "confirmed";

        return (
          <li className={s.item} key={i}>
            {/* ---- Левая колонка: номер и вердикт ---- */}
            <div className={s.side}>
              <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>

              <span className={`${s.verdict} ${s[вид]}`}>
                {/* Значок рядом с подписью, а не только цвет —
                    чтобы вердикт читался и при дальтонизме */}
                <span className={s.sign} aria-hidden="true">
                  {вид === "rejected" ? "✗" : вид === "partly" ? "~" : "✓"}
                </span>
                {fixHangingWords(item.verdict || ВЕРДИКТ[вид])}
              </span>
            </div>

            {/* ---- Правая колонка: сама гипотеза и разбор ---- */}
            <div className={s.body}>
              <p className={s.text}>
                <RichText>{item.text}</RichText>
              </p>

              {item.how && (
                <div className={s.part}>
                  <span className={s.partLabel}>
                    {fixHangingWords("чем проверялась")}
                  </span>
                  <p className={s.partText}>
                    <RichText>{item.how}</RichText>
                  </p>
                </div>
              )}

              {item.conclusion && (
                <div className={s.part}>
                  <span className={s.partLabel}>
                    {fixHangingWords("что из этого вышло")}
                  </span>
                  <p className={s.partText}>
                    <RichText>{item.conclusion}</RichText>
                  </p>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
