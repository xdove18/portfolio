import { useState } from "react";
import { site } from "../../data/site";
import { asset } from "../../utils/asset";
import Lightbox from "../Case/Lightbox";
import s from "./About.module.css";

/* ============================================================
   БЛАГОДАРСТВЕННОЕ ПИСЬМО
   ============================================================
   Карточка в разделе «Обо мне»: видно само письмо, его можно
   открыть на весь экран и скачать файлом.

   Что где лежит — настраивается в src/data/site.js, блок letter.

   Почему на странице показывается картинка, а не сам PDF:
   встроенный просмотр PDF работает по-разному в разных
   браузерах, а на телефонах часто не работает вовсе. Картинка
   открывается везде одинаково и весит меньше. Сам файл никуда
   не делся — он на кнопке «Скачать».
   ============================================================ */

export default function Letter() {
  const letter = site.letter;

  /* Открыто ли письмо на весь экран.
     Для показа используем то же окно, что и для экранов
     приложения в кейсах — чтобы поведение было одинаковым
     во всём сайте: закрытие по Esc, по крестику и по фону. */
  const [открыто, setОткрыто] = useState(false);

  // Нет письма или убран заголовок — блок не показываем
  if (!letter || !letter.title || !letter.image) return null;

  return (
    <div className={s.block}>
      <h3 className={s.blockTitle}>{letter.title}</h3>

      <div className={s.letter}>
        {/* Само письмо. Вся картинка — кнопка: по клику
            открывается на весь экран. */}
        <button
          type="button"
          className={s.letterShot}
          onClick={() => setОткрыто(true)}
          aria-label={`Открыть «${letter.title}» на весь экран`}
          /* Курсор над картинкой превращается в кольцо
             с надписью «нажми на меня» */
          data-cursor="image"
        >
          <img
            src={asset(letter.thumb || letter.image)}
            alt={letter.title}
            loading="lazy"
          />
        </button>

        <div className={s.letterSide}>
          {letter.note && <p className={s.letterNote}>{letter.note}</p>}

          <div className={s.letterActions}>
            <button
              type="button"
              className={s.letterOpen}
              onClick={() => setОткрыто(true)}
            >
              Посмотреть
            </button>

            {letter.file && (
              <a
                className={s.letterDownload}
                href={asset(letter.file)}
                /* download просит браузер сохранить файл,
                   а не открывать его во вкладке. Значение —
                   имя, под которым файл ляжет в «Загрузки». */
                download={`${letter.title}.pdf`}
              >
                Скачать PDF
              </a>
            )}
          </div>
        </div>
      </div>

      {открыто && (
        <Lightbox
          screens={[letter.image]}
          index={0}
          onClose={() => setОткрыто(false)}
          onChange={() => {}}
        />
      )}
    </div>
  );
}
