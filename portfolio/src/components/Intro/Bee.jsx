/* ============================================================
   ПЧЁЛКА
   ============================================================
   Нарисована кодом: полосатое тельце, два прозрачных крыла,
   усики и лапки. Крылья машут — за это отвечает CSS.

   Пчёлка смотрит влево, потому что летит справа налево.
   ============================================================ */

import s from "./Intro.module.css";

export default function Bee({ size = 64 }) {
  return (
    <svg
      viewBox="0 0 100 70"
      width={size}
      height={(size * 70) / 100}
      aria-hidden="true"
    >
      {/* ---- Крылья ---- */}
      {/* Левое крыло: машет вокруг точки крепления к спинке */}
      <ellipse
        className={`${s.wing} ${s.wingBack}`}
        cx="58"
        cy="20"
        rx="17"
        ry="10"
        fill="rgba(255,255,255,.55)"
        stroke="rgba(0,0,0,.18)"
        strokeWidth="1"
        style={{ transformOrigin: "50px 28px" }}
      />
      {/* Правое крыло — чуть меньше, машет в противофазе */}
      <ellipse
        className={`${s.wing} ${s.wingFront}`}
        cx="47"
        cy="17"
        rx="14"
        ry="8.5"
        fill="rgba(255,255,255,.75)"
        stroke="rgba(0,0,0,.18)"
        strokeWidth="1"
        style={{ transformOrigin: "44px 27px" }}
      />

      {/* ---- Тельце ---- */}
      {/* Основной овал */}
      <ellipse cx="50" cy="42" rx="27" ry="18" fill="#f0c53f" />

      {/* Чёрные полоски. Обрезаны по форме тельца маской,
          чтобы не вылезали за края. */}
      <mask id="beeBody">
        <ellipse cx="50" cy="42" rx="27" ry="18" fill="#fff" />
      </mask>
      <g mask="url(#beeBody)" fill="#2c2620">
        <rect x="44" y="24" width="9" height="36" />
        <rect x="60" y="24" width="9" height="36" />
      </g>

      {/* Хвостик-жало справа */}
      <path d="M77 42 L88 36 L88 48 Z" fill="#2c2620" />

      {/* ---- Голова ---- */}
      <circle cx="24" cy="40" r="13" fill="#2c2620" />
      {/* Глаз */}
      <circle cx="19" cy="37" r="3.4" fill="#fff" />
      <circle cx="18" cy="37.6" r="1.7" fill="#2c2620" />

      {/* ---- Усики ---- */}
      <g stroke="#2c2620" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M18 30 Q 12 22 6 21" />
        <path d="M26 28 Q 24 19 19 14" />
      </g>
      <circle cx="5" cy="20" r="2.6" fill="#2c2620" />
      <circle cx="18.5" cy="13" r="2.6" fill="#2c2620" />

      {/* ---- Лапки ---- */}
      <g stroke="#2c2620" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M36 57 L32 65" />
        <path d="M50 60 L50 68" />
        <path d="M63 57 L67 65" />
      </g>
    </svg>
  );
}
