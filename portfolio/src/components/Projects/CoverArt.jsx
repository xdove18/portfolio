import s from "./Projects.module.css";

/* ============================================================
   РИСУНОК НА ОБЛОЖКЕ ПРОЕКТА
   ============================================================
   У каждого проекта свой знак, связанный с его сутью:

   «Умный размер»  — измерительные кольца, которые расходятся
                     от центра, как замер параметров;
   «HabitFlow»     — росток, который тянется вверх, и кольцо
                     прогресса вокруг него;
   «Агентство Pro» — тёмная заставка CRM: свечение, столбики
                     касаний и уведомления, которые сменяют
                     друг друга. Перенесена из макета Claude
                     Design один в один, только на CSS.

   Анимация идёт постоянно, а не только при наведении.
   ============================================================ */

export default function CoverArt({ slug }) {
  if (slug === "smart-size") return <SmartSizeArt />;
  if (slug === "habits") return <HabitsArt />;
  if (slug === "agency-crm") return <AgencyArt />;
  return null;
}

/* ---------- УМНЫЙ РАЗМЕР ---------- */
function SmartSizeArt() {
  return (
    <svg viewBox="0 0 140 140" width="140" height="140" aria-hidden="true">
      {/* Три кольца расходятся от центра по очереди —
          получается эффект «замера» */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          className={s.ring}
          cx="70"
          cy="70"
          r="26"
          fill="none"
          stroke="rgba(255,255,255,.85)"
          strokeWidth="2"
          style={{ animationDelay: `${i * 1.1}s` }}
        />
      ))}

      {/* Неподвижный силуэт: рамка с делениями, как на сантиметре */}
      <g stroke="#fff" strokeLinecap="round" fill="none">
        <circle cx="70" cy="70" r="26" strokeWidth="2.5" opacity="0.95" />
        {/* Деления по кругу */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const inner = i % 3 === 0 ? 16 : 20;
          return (
            <line
              key={i}
              x1={70 + Math.cos(angle) * inner}
              y1={70 + Math.sin(angle) * inner}
              x2={70 + Math.cos(angle) * 23}
              y2={70 + Math.sin(angle) * 23}
              strokeWidth={i % 3 === 0 ? 2.4 : 1.4}
              opacity={i % 3 === 0 ? 0.95 : 0.55}
            />
          );
        })}
      </g>

      {/* Стрелка-указатель медленно обходит круг */}
      <g className={s.needle} style={{ transformOrigin: "70px 70px" }}>
        <line
          x1="70"
          y1="70"
          x2="70"
          y2="50"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      <circle cx="70" cy="70" r="4.5" fill="#fff" />
    </svg>
  );
}

/* ---------- HABITFLOW ---------- */
function HabitsArt() {
  return (
    <svg viewBox="0 0 140 140" width="140" height="140" aria-hidden="true">
      {/* Кольцо прогресса: пунктир «пробегает» по кругу,
          как заполняющийся трекер привычки */}
      <circle
        className={s.progress}
        cx="70"
        cy="70"
        r="46"
        fill="none"
        stroke="rgba(255,255,255,.9)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="60 229"
      />

      {/* Тонкое кольцо-подложка */}
      <circle
        cx="70"
        cy="70"
        r="46"
        fill="none"
        stroke="rgba(255,255,255,.28)"
        strokeWidth="3"
      />

      {/* Росток: стебель и два листа, которые мягко покачиваются */}
      <g className={s.sprout} style={{ transformOrigin: "70px 96px" }}>
        <path
          d="M70 96V62"
          stroke="#fff"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* Левый лист */}
        <path
          d="M70 78c-14 0-20-8-20-16 10 0 20 5 20 16z"
          fill="rgba(255,255,255,.92)"
        />
        {/* Правый лист, чуть выше */}
        <path
          d="M70 68c12 0 18-7 18-14-9 0-18 4-18 14z"
          fill="rgba(255,255,255,.72)"
        />
      </g>

      {/* Земля под ростком */}
      <path
        d="M50 98h40"
        stroke="rgba(255,255,255,.55)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- АГЕНТСТВО PRO (CRM) ---------- */
/* В отличие от двух знаков выше, это не рисунок по центру,
   а полноценная заставка: она заливает всю обложку папки
   тёмным фоном, как экран приложения. Все элементы
   позиционируются от краёв, поэтому заставка подстраивается
   под любую ширину карточки. */
function AgencyArt() {
  return (
    <div className={s.agency} aria-hidden="true">
      {/* Два «дышащих» пятна света: зелёное слева сверху,
          голубое справа снизу */}
      <span className={`${s.agencyGlow} ${s.agencyGlowGreen}`} />
      <span className={`${s.agencyGlow} ${s.agencyGlowBlue}`} />

      {/* Белый круг с домиком — знак недвижимости */}
      <span className={s.agencyLogo}>
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0F100E"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10.5L12 3.5l9 7V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
        </svg>
      </span>

      <span className={s.agencyTitle}>Агентство Pro</span>

      {/* Столбики касаний с клиентом: растут по очереди.
          Серый столбик — день без касаний. */}
      <span className={s.agencyBars}>
        {[8, 14, 6, 16, 11, 18].map((h, i) => (
          <i
            key={i}
            className={i === 2 ? s.agencyBarEmpty : s.agencyBar}
            style={{
              height: h,
              animationDelay: `${i * 0.15}s`,
              opacity: [0.55, 0.7, 1, 0.85, 0.6, 1][i],
            }}
          />
        ))}
      </span>

      {/* Две карточки уведомлений сменяют друг друга каждые 7 секунд */}
      <span className={s.agencyCards}>
        <span className={`${s.agencyCard} ${s.agencyCardA}`}>
          <b className={s.agencyAvatar}>СГ</b>
          <span className={s.agencyCardText}>
            <span className={s.agencyCardTitle}>Показ ул. Толстого д.25</span>
            <span className={s.agencyCardMeta}>Василий Петров · записал касание</span>
          </span>
          <span className={s.agencyCardTime}>сейчас</span>
        </span>

        <span className={`${s.agencyCard} ${s.agencyCardB}`}>
          <b className={s.agencyAvatar} style={{ background: "#E4F2EB" }}>МГ</b>
          <span className={s.agencyCardText}>
            <span className={s.agencyCardTitle}>Подборка из 4 объектов</span>
            <span className={s.agencyCardMeta}>Марина видит историю коллеги</span>
          </span>
          <span className={s.agencyDots}>
            <i /><i /><i />
          </span>
        </span>
      </span>
    </div>
  );
}
