import { site } from "../../data/site";
import RichText from "../Case/RichText";
import s from "./Manifest.module.css";

/* ============================================================
   ГЛАВНАЯ ФРАЗА
   ============================================================
   Первое, что читает человек в правой колонке. Текст лежит
   в src/data/site.js, поле manifest — меняется там, код
   трогать не нужно.

   Выделение ==цветом== работает так же, как в кейсах.
   ============================================================ */

export default function Manifest() {
  return (
    <section className={s.manifest}>
      <h2 className={s.text}>
        <RichText>{site.manifest.text}</RichText>
      </h2>

      {site.manifest.note && (
        <p className={s.note}>
          <RichText>{site.manifest.note}</RichText>
        </p>
      )}

      {/* Тонкая линия отделяет фразу от стопки кейсов */}
      <div className={s.rule} aria-hidden="true" />
    </section>
  );
}
