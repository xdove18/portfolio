import { useState } from "react";
import Lightbox from "./Lightbox";
import RichText from "./RichText";
import { thumb } from "./imagePath";
import s from "./Case.module.css";

/* ============================================================
   ГАЛЕРЕЯ ЭКРАНОВ ПРИЛОЖЕНИЯ
   ============================================================
   Показывает скриншоты группами. Клик по скриншоту открывает
   его на весь экран.

   У группы можно указать wide: true — тогда плитки будут
   широкими. Это нужно для оформленных композиций, где на одной
   картинке сразу несколько телефонов: в узкой плитке они
   получались бы совсем крошечными.

   Ещё у группы можно указать note — короткое пояснение
   под заголовком.
   ============================================================ */

export default function ScreenGallery({ groups }) {
  // Какой скриншот открыт во весь экран. null — лайтбокс закрыт.
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      {groups.map((group) => (
        <div className={s.screenGroup} key={group.title}>
          <h3 className={s.screenGroupTitle}>{group.title}</h3>

          {group.note && (
            <p className={s.screenGroupNote}>
              <RichText>{group.note}</RichText>
            </p>
          )}

          <div className={`${s.screenRow} ${group.wide ? s.screenRowWide : ""}`}>
            {group.screens.map((src, i) => (
              <button
                key={src}
                className={`${s.screenThumb} ${group.wide ? s.screenThumbWide : ""}`}
                onClick={() => setLightbox({ screens: group.screens, index: i })}
                aria-label={`Открыть экран ${i + 1} из раздела «${group.title}»`}
                /* data-cursor="image" — над этим элементом
                   курсор превращается в кольцо с надписью
                   «нажми на меня» */
                data-cursor="image"
              >
                {/* В галерее показываем лёгкую копию.
                    Полная версия загрузится только если человек
                    откроет экран во весь экран. */}
                <img src={thumb(src)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {lightbox && (
        <Lightbox
          screens={lightbox.screens}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChange={(index) => setLightbox((prev) => ({ ...prev, index }))}
        />
      )}
    </>
  );
}
