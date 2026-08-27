import { useEffect } from "react";
import { lockScroll, unlockScroll } from "../../utils/scrollLock";
import { asset } from "../../utils/asset";
import { CloseIcon } from "../icons/Icons";
import s from "./Case.module.css";

/* ============================================================
   ЛАЙТБОКС — ПРОСМОТР ЭКРАНА ВО ВЕСЬ ЭКРАН
   ============================================================
   Открывается по клику на скриншот. Листается стрелками
   на клавиатуре, закрывается по Esc или крестику.
   ============================================================ */

export default function Lightbox({ screens, index, onClose, onChange }) {
  /* Управление с клавиатуры */
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange((index + 1) % screens.length);
      // % screens.length — если дошли до конца, начинаем сначала
      if (event.key === "ArrowLeft")
        onChange((index - 1 + screens.length) % screens.length);
    }

    window.addEventListener("keydown", onKeyDown);
    // Пока лайтбокс открыт, страница под ним не прокручивается
    lockScroll();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unlockScroll();
    };
  }, [index, screens.length, onClose, onChange]);

  return (
    <div className={s.lightbox} role="dialog" aria-label="Просмотр экрана">
      {/* Клик по фону тоже закрывает окно */}
      <button
        className={s.lightboxBackdrop}
        onClick={onClose}
        aria-label="Закрыть просмотр"
      />

      <button className={s.lightboxClose} onClick={onClose} aria-label="Закрыть">
        <CloseIcon size={22} color="#fff" />
      </button>

      <img className={s.lightboxImage} src={asset(screens[index])} alt="" />

      {/* Стрелки показываем, только если экранов больше одного */}
      {screens.length > 1 && (
        <>
          <button
            className={`${s.lightboxArrow} ${s.lightboxPrev}`}
            onClick={() => onChange((index - 1 + screens.length) % screens.length)}
            aria-label="Предыдущий экран"
          >
            ←
          </button>

          <button
            className={`${s.lightboxArrow} ${s.lightboxNext}`}
            onClick={() => onChange((index + 1) % screens.length)}
            aria-label="Следующий экран"
          >
            →
          </button>

          <p className={s.lightboxCounter}>
            {index + 1} / {screens.length}
          </p>
        </>
      )}
    </div>
  );
}
