import { useState } from "react";
import Lightbox from "./Lightbox";
import ScreenSlider from "./ScreenSlider";
import RichText from "./RichText";
import { thumb } from "./imagePath";
import s from "./Case.module.css";

/* ============================================================
   ГАЛЕРЕЯ ЭКРАНОВ ПРИЛОЖЕНИЯ
   ============================================================
   Показывает скриншоты группами. Клик по скриншоту открывает
   его на весь экран.

   collage: true — две плитки в ряд, третья крупная снизу
   по центру. Так оформлена витрина HabitFlow.

   У группы можно указать wide: true — тогда плитки будут
   широкими. Это нужно для оформленных композиций, где на одной
   картинке сразу несколько телефонов: в узкой плитке они
   получались бы совсем крошечными.

   Ещё у группы можно указать note — короткое пояснение
   под заголовком.

   tall: true — для снимков страниц сайта во всю длину. Такие
   картинки бывают в десять экранов высотой, и в плитке они
   превращаются в бесконечную ленту. С этим флагом плитка
   показывает только верх страницы и подсказывает, что
   остальное откроется по клику, а на весь экран страница
   открывается с прокруткой, а не ужимается до нечитаемого.
   ============================================================ */

/* Все группы экранов, относящиеся к одному разделу кейса.
   Устроено так же, как TablesFor и TimelinesFor: у группы есть
   поле section, и она появляется только в своём разделе.

   Группы без section показываются в «решении» — так ведут себя
   кейсы, где экраны идут одним блоком в конце.

   Зачем это нужно: чтобы картинка стояла сразу после текста,
   который её объясняет. Говорим о проблеме — показываем экран,
   которым она решена. */
export function ScreensFor({ groups, section }) {
  if (!groups) return null;

  const свои = groups.filter((g) => (g.section || "solution") === section);
  if (свои.length === 0) return null;

  return <ScreenGallery groups={свои} />;
}

/* Подпись картинки для поисковиков и для тех, кто смотрит
   сайт через экранный диктор. Берём первое предложение
   пояснения к группе (или её заголовок, если он есть) и
   убираем пометки разметки — ** жирный ** и == маркер ==.

   Пустой alt у скриншота работы — потеря: по нему не находят
   в поиске по картинкам, а диктор читает вслух имя файла. */
function подписьКартинки(group) {
  /* Если у группы нет ни заголовка, ни пояснения (так бывает
     там, где картинку объясняет текст выше), подпись можно
     задать отдельно — полем alt у группы в projects.js.
     На странице её не видно, она только для поиска и диктора. */
  const источник = group.alt || group.title || group.note || "";
  const чистый = источник.replace(/\*\*/g, "").replace(/==/g, "").trim();
  const первое = чистый.split(/(?<=[.!?])\s/)[0] || чистый;
  return первое.length > 120 ? первое.slice(0, 120).trim() + "…" : первое;
}

export default function ScreenGallery({ groups }) {
  // Какой скриншот открыт во весь экран. null — лайтбокс закрыт.
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      {groups.map((group) => (
        <div className={s.screenGroup} key={group.screens[0]}>
          {/* Заголовок необязателен: там, где картинка идёт
              сразу за текстом, который её объясняет, подпись
              вроде «Как это выглядит» только мешает. */}
          {group.title && <h3 className={s.blockName}>{group.title}</h3>}

          {group.note && (
            <p className={s.screenGroupNote}>
              <RichText>{group.note}</RichText>
            </p>
          )}

          {/* slider: true — экраны листаются по одному, а не
              стоят подряд. Так второстепенная группа не
              растягивает страницу. */}
          {group.slider ? (
            <ScreenSlider
              group={group}
              alt={подписьКартинки(group)}
              onOpen={(i) =>
                setLightbox({
                  screens: group.screens,
                  index: i,
                  tall: group.tall,
                })
              }
            />
          ) : (
          <div
            className={[
              s.screenRow,
              group.wide ? s.screenRowWide : "",
              group.collage ? s.screenRowCollage : "",
              /* Коллаж наоборот: широкая картинка сверху,
                 остальные под ней в два столбца */
              group.collageTop ? s.screenRowCollageTop : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {group.screens.map((src, i) => (
              <button
                key={src}
                className={[
                  s.screenThumb,
                  group.tall ? s.screenThumbTall : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() =>
                  setLightbox({
                    screens: group.screens,
                    index: i,
                    tall: group.tall,
                  })
                }
                aria-label={`Открыть экран ${i + 1} из раздела «${group.title}»`}
                /* data-cursor="image" — над этим элементом
                   курсор превращается в кольцо с надписью
                   «нажми на меня» */
                data-cursor="image"
              >
                {/* В галерее показываем лёгкую копию.
                    Полная версия загрузится только если человек
                    откроет экран во весь экран. */}
                <img src={thumb(src)} alt={подписьКартинки(group)} loading="lazy" />
              </button>
            ))}
          </div>
          )}
        </div>
      ))}

      {lightbox && (
        <Lightbox
          screens={lightbox.screens}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          tall={lightbox.tall}
          onChange={(index) => setLightbox((prev) => ({ ...prev, index }))}
        />
      )}
    </>
  );
}
