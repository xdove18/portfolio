import { stack } from "../../data/stack";
import StackIcon from "./StackIcons";
import s from "./Stack.module.css";

/* ============================================================
   РАЗДЕЛ «СТЕК»
   ============================================================
   Плитки с программами. При наведении плитка заливается
   акцентным цветом и показывает описание.
   ============================================================ */

export default function Stack() {
  return (
    <section className={`section ${s.stack}`} id="stack">
      <div className="container">
        <h2 className={s.title}>Стек технологий</h2>

        <div className={s.grid}>
          {stack.map((item) => (
            <article className={s.tile} key={item.name}>
              <span className={s.icon}>
                <StackIcon name={item.icon} />
              </span>

              <h3 className={s.name}>{item.name}</h3>
              <p className={s.desc}>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
