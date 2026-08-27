import { useEffect, useState } from "react";
import { lockScroll, unlockScroll } from "../../utils/scrollLock";
import { CloseIcon } from "../icons/Icons";
import RichText from "./RichText";
import s from "./Case.module.css";

/* ============================================================
   СХЕМА, КОТОРУЮ МОЖНО ОТКРЫТЬ НА ВЕСЬ ЭКРАН
   ============================================================
   Обёртка вокруг любой схемы: по клику она разворачивается
   поверх страницы, как фотография.

   Используется так:

   <ZoomableFigure title="Было — 5 шагов" note="Пояснение">
     ...сама схема...
   </ZoomableFigure>

   Закрывается крестиком, клавишей Esc или кликом по фону.
   ============================================================ */

export default function ZoomableFigure({ title, note, label, children }) {
  const [open, setOpen] = useState(false);

  /* Пока схема развёрнута: закрываем по Esc и запрещаем
     прокрутку страницы под ней */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    lockScroll();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unlockScroll();
    };
  }, [open]);

  return (
    <>
      <figure className={s.zoomFigure}>
        {title && <figcaption className={s.zoomTitle}>{title}</figcaption>}

        {/* Кнопка-обёртка: вся схема кликабельна целиком */}
        <button
          className={s.zoomTrigger}
          onClick={() => setOpen(true)}
          aria-label={`Открыть схему «${title || label || "схема"}» на весь экран`}
          /* Курсор над схемой превращается в кольцо
             с надписью «нажми на меня» */
          data-cursor="image"
        >
          {children}
        </button>

        {note && (
          <p className={s.zoomNote}>
            <RichText>{note}</RichText>
          </p>
        )}
      </figure>

      {/* ---------- РАЗВЁРНУТЫЙ ВИД ---------- */}
      {open && (
        <div className={s.zoomOverlay} role="dialog" aria-label={title}>
          {/* Клик по фону тоже закрывает */}
          <button
            className={s.zoomBackdrop}
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
          />

          <button
            className={s.zoomClose}
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
          >
            <CloseIcon size={22} color="#fff" />
          </button>

          <div className={s.zoomStage}>
            {title && <p className={s.zoomStageTitle}>{title}</p>}
            <div className={s.zoomStageBody}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
