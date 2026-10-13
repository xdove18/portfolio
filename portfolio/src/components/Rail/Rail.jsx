import { useEffect, useState } from "react";
import { site } from "../../data/site";
import { asset } from "../../utils/asset";
import { fixHangingWords } from "../../utils/typography";
import { TelegramIcon } from "../icons/Icons";
import Flower from "../Flower/Flower";
import s from "./Rail.module.css";

/* ============================================================
   ЛЕВАЯ КОЛОНКА
   ============================================================
   Стоит на месте, пока справа листаются кейсы: фотография,
   имя, короткая строка о себе, меню, кнопка связи и ссылки.

   Это одновременно и визитка, и навигация — поэтому отдельной
   шапки сверху на главной больше нет.

   На телефоне колонка превращается в обычный блок сверху,
   прилипание выключается.
   ============================================================ */

/* Пункты меню. id должен совпадать с id блока на странице,
   иначе ссылка никуда не прокрутит. */
const ПУНКТЫ = [
  { id: "works", label: "Кейсы" },
  { id: "about", label: "О себе" },
  { id: "contacts", label: "Контакты" },
];

export default function Rail() {
  /* Какой раздел сейчас на экране — он помечается цветком */
  const [активный, setАктивный] = useState("works");

  useEffect(() => {
    function приПрокрутке() {
      /* Считаем активным последний раздел, верх которого уже
         прошёл треть экрана. Треть, а не середина: иначе
         короткий раздел «контакты» никогда не становился бы
         активным. */
      const граница = window.innerHeight / 3;
      let текущий = ПУНКТЫ[0].id;

      for (const пункт of ПУНКТЫ) {
        const блок = document.getElementById(пункт.id);
        if (блок && блок.getBoundingClientRect().top <= граница) {
          текущий = пункт.id;
        }
      }

      setАктивный(текущий);
    }

    приПрокрутке();
    window.addEventListener("scroll", приПрокрутке, { passive: true });
    return () => window.removeEventListener("scroll", приПрокрутке);
  }, []);

  function перейти(event, id) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  /* Строка «Самара · 24 года · middle». Пустые значения
     выпадают сами — если в site.js стереть грейд, останется
     только город и возраст. */
  const визитка = [site.city, `${site.age} года`, site.grade]
    .filter(Boolean)
    .join(" · ");

  return (
    <aside className={s.rail}>
      <div className={s.card}>
        <img
          className={s.photo}
          src={asset("/images/me-portrait.webp")}
          alt={`${site.name} — ${site.role}`}
          width="1122"
          height="1402"
        />

        <div className={s.id}>
          <p className={s.name}>{site.name}</p>
          <p className={s.role}>{site.role}</p>
          <p className={s.meta}>{fixHangingWords(визитка)}</p>
        </div>
      </div>

      <nav className={s.menu}>
        {ПУНКТЫ.map((пункт) => (
          <a
            key={пункт.id}
            href={`#${пункт.id}`}
            onClick={(e) => перейти(e, пункт.id)}
            className={`${s.item} ${
              активный === пункт.id ? s.itemOn : ""
            }`}
          >
            {/* Цветок вместо точки у активного пункта —
                единственное цветное пятно в колонке */}
            <span className={s.mark} aria-hidden="true">
              <Flower color="var(--accent)" size={14} />
            </span>
            {fixHangingWords(пункт.label)}
          </a>
        ))}
      </nav>

      <div className={s.bottom}>
        <a
          className={s.cta}
          href={site.telegramUrl}
          target="_blank"
          rel="noreferrer"
        >
          {fixHangingWords("Написать в Telegram")}
          <TelegramIcon size={16} />
        </a>

        {/* Ссылки показываются, только если заполнены в site.js */}
        <div className={s.links}>
          {site.behance && (
            <a href={site.behance} target="_blank" rel="noreferrer">
              Behance
            </a>
          )}
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
        </div>
      </div>
    </aside>
  );
}
