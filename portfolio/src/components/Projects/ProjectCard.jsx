import { Link } from "react-router-dom";
import Flower from "../Flower/Flower";
import CoverArt from "./CoverArt";
import CoverVideo from "./CoverVideo";
import { ArrowIcon } from "../icons/Icons";
import { thumb } from "../Case/imagePath";
import s from "./Projects.module.css";

/* ============================================================
   КАРТОЧКА ПРОЕКТА В ВИДЕ ПАПКИ
   ============================================================
   Сверху — цветная обложка с постоянной анимацией, снизу —
   белый «лист» с названием. При наведении из-за папки
   выглядывают скриншоты приложения.
   ============================================================ */

export default function ProjectCard({ project }) {
  const {
    slug,
    niche,
    title,
    cardText,
    color,
    colorDeep,
    peekScreens = [],
    comingSoon,
    lightCover,   // обложка светлая → текст на ней тёмный
    coverVideo,   // если указано — на обложке крутится видео
  } = project;

  // Внутренности карточки — одинаковые и для ссылки, и для заглушки
  const content = (
    <>
      {/* ---- Скриншоты, выглядывающие из-за папки ---- */}
      {peekScreens.length > 0 && (
        <div className={s.peek} aria-hidden="true">
          {peekScreens.slice(0, 3).map((src, i) => (
            <img
              key={src}
              /* Лёгкая копия: скриншот виден шириной около 250 px,
                 полная версия здесь была бы лишним весом */
              src={thumb(src)}
              alt=""
              loading="lazy"
              className={s.peekShot}
              // Каждый следующий скриншот правее и повёрнут сильнее
              style={{ "--i": i, zIndex: 3 - i }}
            />
          ))}
        </div>
      )}

      {/* ---- Обложка папки ---- */}
      <div
        className={`${s.cover} ${lightCover ? s.coverLight : ""}`}
        style={{
          // Градиент из двух тонов самого приложения —
          // цвета задаются в src/data/projects.js
          background: `linear-gradient(150deg, ${color} 0%, ${
            colorDeep || color
          } 100%)`,
        }}
      >
        {comingSoon ? (
          /* Заглушка «скоро»: цветок крутится, как индикатор загрузки */
          <div className={s.soon}>
            <div className={s.soonFlower}>
              <Flower color="var(--flower-red)" size={72} />
            </div>
            <span className={s.soonText}>Скоро…</span>
          </div>
        ) : coverVideo ? (
          /* Видео грузится только когда карточка появилась
             на экране, и только на быстром интернете.
             На медленном вместо него — рисованный знак.
             Подробности в CoverVideo.jsx */
          <CoverVideo
            src={coverVideo}
            className={s.coverVideo}
            fallback={
              <div className={s.coverArt}>
                <CoverArt slug={slug} />
              </div>
            }
          />
        ) : (
          <div className={s.coverArt}>
            <CoverArt slug={slug} />
          </div>
        )}
      </div>

      {/* ---- Белый «лист» папки с текстом ---- */}
      <div className={s.sheet}>
        {/* Плашка ниши: заливка цветом проекта.
            У светлой карточки текст тёмный, у цветных — белый. */}
        <span
          className={`${s.niche} ${lightCover ? s.nicheLight : ""}`}
          style={{ background: colorDeep || color }}
        >
          {niche}
        </span>

        <h3 className={s.cardTitle}>{title}</h3>
        <p className={s.text}>{cardText}</p>

        <span className={s.link}>
          {comingSoon ? "В работе" : "Перейти"}
          {!comingSoon && <ArrowIcon size={16} />}
        </span>
      </div>
    </>
  );

  // Заглушка не кликается — это обычный блок, а не ссылка
  if (comingSoon) {
    return <article className={`${s.card} ${s.cardSoon}`}>{content}</article>;
  }

  return (
    <Link
      to={`/projects/${slug}`}
      className={s.card}
      aria-label={`Открыть кейс «${title}»`}
    >
      {content}
    </Link>
  );
}
