import RichText from "./RichText";
import s from "./Case.module.css";

/* ============================================================
   ТАБЛИЦА В КЕЙСЕ
   ============================================================
   Используется для воронки, приоритизации, результатов
   юзабилити-теста и метрик.

   Как описать таблицу в файле src/data/projects.js:

   {
     section: "task",              // в каком разделе показать
     title: "Где теряются люди",   // заголовок над таблицей
     columns: ["Шаг", "Отвал"],    // шапка таблицы
     rows: [
       ["Контакты", "22%"],
       ["Адрес", "20%"],
     ],
     note: "Пояснение под таблицей",  // необязательно
     highlight: 4,                     // подсветить строку (с нуля)
   }
   ============================================================ */

export default function CaseTable({ table, accent }) {
  if (!table || !table.rows || table.rows.length === 0) return null;

  return (
    <div className={s.tableBlock}>
      {table.title && <h3 className={s.subTitle}>{table.title}</h3>}

      {/* Обёртка нужна, чтобы широкая таблица прокручивалась
          вбок сама, а не растягивала всю страницу */}
      <div className={s.tableScroll}>
        <table className={s.table}>
          {table.columns && (
            <thead>
              <tr>
                {table.columns.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {table.rows.map((row, r) => (
              <tr
                key={r}
                className={r === table.highlight ? s.tableRowMarked : ""}
                style={
                  r === table.highlight
                    ? { boxShadow: `inset 3px 0 0 ${accent}` }
                    : undefined
                }
              >
                {row.map((cell, c) => (
                  <td key={c}><RichText>{cell}</RichText></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.note && (
        <p className={s.tableNote}>
          <RichText>{table.note}</RichText>
        </p>
      )}
    </div>
  );
}

/* Показывает все таблицы, относящиеся к одному разделу */
export function TablesFor({ tables, section, accent }) {
  if (!tables) return null;

  const list = tables.filter((t) => t.section === section);
  if (list.length === 0) return null;

  return (
    <>
      {list.map((table, i) => (
        <CaseTable key={i} table={table} accent={accent} />
      ))}
    </>
  );
}
