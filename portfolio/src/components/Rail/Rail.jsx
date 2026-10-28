import { useEffect, useState } from "react";
import { site } from "../../data/site";
import { asset } from "../../utils/asset";
import { fixHangingWords } from "../../utils/typography";
import { TelegramIcon } from "../icons/Icons";
import Flower from "../Flower/Flower";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
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

  // Строка «Самара · 24 года»
  const визитка = [site.city, `${site.age} года`]
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

          {/* Направления работы — то, что рекрутер ищет
              глазами в первую очередь */}
          {site.domains?.length > 0 && (
            <ul className={s.domains}>
              {site.domains.map((чем) => (
                <li key={чем}>{чем}</li>
              ))}
            </ul>
          )}
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

        {/* Резюме. Кнопки нет, если в site.js не указан файл */}
        {site.resumeUrl && (
          <a
            className={s.cv}
            href={asset(site.resumeUrl)}
            /* download подсказывает браузеру сохранить файл,
               а не открывать его во вкладке */
            download={`${site.name} — резюме.pdf`}
          >
            CV
          </a>
        )}

        {/* Ссылки показываются, только если заполнены в site.js */}
        <div className={s.links}>
          {site.behance && (
            <a href={site.behance} target="_blank" rel="noreferrer">
              Behance
            </a>
          )}
          {site.pinterest && (
            <a href={site.pinterest} target="_blank" rel="noreferrer">
              Pinterest
            </a>
          )}
          {site.email && <a href={`mailto:${site.email}`}>Почта</a>}

          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
