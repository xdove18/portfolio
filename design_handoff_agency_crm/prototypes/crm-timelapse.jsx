/* Таймлапс: риелтор заводит клиента Сергея Грина и ведёт его историю. */
const { CompositionStage, useComposition, animate, clamp, Easing } = window;

const C = {
  bg: '#0B0B0A', panel: '#131312', bg2: '#1C1B19', bg3: '#26241F',
  tx1: '#F5F3F0', tx2: '#BCB8B2', tx3: '#8B8680',
  hair: 'rgba(255,255,255,.08)', bd2: '#4A4540', cta: '#27C08B', pillTx: '#08211A',
  home: '#6FC2A0', phone: '#7FA8D4', msg: '#D2B36B',
  stA: '#6FC28A', stW: '#D2A65B', stC: '#A5A09A'
};
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const MODAL = { x: 500, y: 200, w: 600, h: 500 };

const MOTION = {
  enter: (start, dur) => animate({ from: 0, to: 1, start: start, end: start + (dur || 0.5), ease: Easing.easeOutCubic }),
  draw: (start, end) => animate({ from: 0, to: 1, start: start, end: end, ease: Easing.linear }),
  pop: (start, dur) => animate({ from: 0, to: 1, start: start, end: start + (dur || 0.35), ease: Easing.easeOutBack })
};

const typed = (text, start, end, T) => {
  const p = clamp((T - start) / (end - start), 0, 1);
  return { text: text.slice(0, Math.round(p * text.length)), active: p > 0 && p < 1, done: p >= 1 };
};

const CURSOR_KEYS = [
  [0, 1000, 600], [1.4, 1000, 600], [2.8, 400, 226], [3.2, 400, 226], [4.4, 790, 388],
  [4.6, 790, 388], [5.6, 790, 476], [5.8, 790, 476], [6.6, 790, 558], [7.0, 790, 558],
  [7.8, 699, 699], [8.6, 699, 699], [9.0, 400, 290], [9.6, 400, 290], [10.2, 947, 815],
  [10.8, 947, 815], [11.0, 600, 375], [11.6, 600, 375], [11.9, 790, 548], [13.5, 790, 548],
  [13.8, 699, 699], [15.0, 699, 699], [15.6, 947, 815], [15.8, 947, 815], [15.95, 722, 375],
  [16.1, 722, 375], [16.3, 790, 460], [17.3, 790, 460], [17.5, 790, 548], [18.8, 790, 548],
  [19.0, 699, 699], [20.5, 699, 699], [21.6, 1240, 520], [24, 1240, 520], [25.6, 1000, 600]
];
const CLICKS = [2.9, 7.9, 9.0, 10.2, 11.0, 13.8, 15.6, 15.95, 19.0];

function cursorAt(T) {
  const k = CURSOR_KEYS;
  if (T <= k[0][0]) { return { x: k[0][1], y: k[0][2] }; }
  for (let i = 0; i < k.length - 1; i++) {
    if (T >= k[i][0] && T <= k[i + 1][0]) {
      const p = Easing.easeInOutCubic((T - k[i][0]) / (k[i + 1][0] - k[i][0] || 1));
      return { x: k[i][1] + (k[i + 1][1] - k[i][1]) * p, y: k[i][2] + (k[i + 1][2] - k[i][2]) * p };
    }
  }
  const last = k[k.length - 1];
  return { x: last[1], y: last[2] };
}

const PATHS = {
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z',
  home: 'M3 10.5L12 3.5l9 7V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  msg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4.2-4.2',
  filter: 'M4 7h16M4 17h16',
  bell: 'M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5zM10.5 19a2 2 0 0 0 3 0'
};
const Icon = ({ kind, size, color, w }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={w || 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={PATHS[kind]}></path>
  </svg>
);

const EVENTS = [
  { kind: 'phone', title: 'Звонок (25 мин)', day: '10 сентября', dow: 'Пятница', time: '09:00',
    by: 'Василий Петров', at: 14.2,
    notes: [{ by: 'Василий Петров', at: '09:26', text: 'Интересуется 2-комнатной, юго-запад.' }] },
  { kind: 'home', title: 'Показ ул. Толстого д.25', day: '14 сентября', dow: 'Вторник', time: '14:30',
    by: 'Василий Петров', at: 19.4,
    notes: [{ by: 'Василий Петров', at: '15:10', text: 'Квартира понравилась, но смущает первый этаж.' }] },
  { kind: 'msg', title: 'Подборка из 4 объектов', day: '14 сентября', dow: 'Вторник', time: '17:40',
    by: 'Марина Грязнова', at: 21.7,
    notes: [{ by: 'Марина Грязнова', at: '17:42', text: 'Три варианта в том же доме выше третьего этажа.' }] }
];

const OTHERS = [
  { name: 'Ольга Панина', st: C.stA, stLabel: 'Активен', sum: '20M', last: 'сегодня' },
  { name: 'Марина Ковалёва', st: C.stW, stLabel: 'Жду звонка', sum: '10M', last: '2 дня назад' },
  { name: 'Артём Дубов', st: C.stC, stLabel: 'Холодный', sum: '8M', last: 'неделю назад' }
];



const Row = ({ y, o, name, initials, st, stLabel, sum, last, active, spark }) => (
  <div style={{ position: 'absolute', left: 14, top: y, width: 268, height: 68, opacity: o,
    borderRadius: 14, background: active ? C.bg3 : 'transparent',
    display: 'flex', alignItems: 'center', gap: 10, padding: 12 }}>
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.bg2, color: C.tx1,
      fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.tx1 }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: st }}></span>
        <span style={{ fontSize: 12, color: st, fontWeight: 500 }}>{stLabel}</span>
        <span style={{ fontSize: 11, color: C.tx3 }}>· {last}</span>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
      <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx1 }}>{sum}</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {(spark || [1, 2, 0, 3, 1, 2]).map((n, i) => (
          <span key={i} style={{ width: 3, height: 4 + n * 3, borderRadius: 2, display: 'inline-block',
            background: n === 0 ? C.bg3 : C.cta, opacity: n === 0 ? 1 : 0.45 + n * 0.16 }}></span>
        ))}
      </div>
    </div>
  </div>
);

const Field = ({ x, y, w, label, value, caret, mono }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w }}>
    <div style={{ fontSize: 12, color: C.tx3 }}>{label}</div>
    <div style={{ marginTop: 6, height: 40, borderRadius: 12, background: C.bg2, padding: '0 14px',
      display: 'flex', alignItems: 'center', fontSize: 13, fontFamily: mono ? MONO : 'inherit',
      color: value ? C.tx1 : C.tx3 }}>
      {value || 'Начните вводить...'}
      {caret ? <span style={{ width: 2, height: 17, marginLeft: 2, background: C.cta }}></span> : null}
    </div>
  </div>
);

const Chip = ({ x, y, label, on, dot }) => (
  <div style={{ position: 'absolute', left: x, top: y, height: 34, padding: '0 14px', borderRadius: 999,
    display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: on ? 600 : 500,
    background: on ? (dot ? 'color-mix(in srgb, ' + dot + ' 22%, ' + C.panel + ')' : C.cta) : C.bg2,
    color: on ? (dot || C.pillTx) : C.tx2 }}>
    {dot ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot }}></span> : null}
    {label}
  </div>
);

const Modal = ({ o, title, sub, children, cta }) => (
  <div style={{ position: 'absolute', left: MODAL.x, top: MODAL.y, width: MODAL.w, height: MODAL.h, opacity: o,
    transform: 'translateY(' + (1 - o) * 18 + 'px)', borderRadius: 20, background: C.panel,
    boxShadow: '0 40px 100px rgba(0,0,0,.6)', overflow: 'hidden' }}>
    <div style={{ padding: '20px 22px 0 22px' }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: C.tx1, letterSpacing: '-.01em' }}>{title}</div>
      <div style={{ fontSize: 12, color: C.tx3, marginTop: 3 }}>{sub}</div>
    </div>
    {children}
    <div style={{ position: 'absolute', left: 22, right: 22, bottom: 20, display: 'flex', gap: 10 }}>
      <div style={{ flex: 1, height: 44, borderRadius: 999, background: C.cta, color: C.pillTx,
        fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cta}</div>
      <div style={{ flex: 1, height: 44, borderRadius: 999, background: C.bg2, color: C.tx1,
        fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Отменить</div>
    </div>
  </div>
);

function Piece() {
  const { T, authoredTotal } = useComposition();

  const fade = Math.min(MOTION.enter(0.1, 0.7)(T), 1 - MOTION.draw(authoredTotal - 0.7, authoredTotal)(T));
  const shell = MOTION.enter(0.15, 0.8)(T);

  const newP = MOTION.enter(8.2, 0.7)(T);
  const selP = MOTION.enter(9.0, 0.4)(T);

  const formO = clamp(MOTION.enter(3.0, 0.45)(T) - MOTION.draw(8.0, 8.35)(T), 0, 1);
  const ev1O = clamp(MOTION.enter(10.4, 0.4)(T) - MOTION.draw(13.85, 14.15)(T), 0, 1);
  const ev2O = clamp(MOTION.enter(15.7, 0.4)(T) - MOTION.draw(19.05, 19.3)(T), 0, 1);

  const fName = typed('Сергей Грин', 3.5, 4.5, T);
  const fPhone = typed('+7 (912) 555-0172', 4.8, 5.8, T);
  const fBudget = typed('10–15 млн', 6.0, 6.7, T);
  const n1 = typed('Интересуется 2-комнатной, юго-запад', 11.9, 13.3, T);
  const addr = typed('ул. Толстого д.25', 16.3, 17.2, T);
  const n2 = typed('Квартира понравилась, смущает первый этаж', 17.6, 18.7, T);

  const cur = cursorAt(T);
  const clickPulse = CLICKS.reduce((acc, t) => Math.max(acc, T < t ? 0 : 1 - clamp((T - t) / 0.45, 0, 1)), 0);
  const zoom = 1 + 0.015 * MOTION.enter(25.4, 1.2)(T);
  const active = T > 13.9;

  const shown = EVENTS.filter(e => T > e.at);
  const groups = [];
  shown.forEach(e => {
    let g = groups.find(x => x.day === e.day);
    if (!g) { groups.push(g = { day: e.day, dow: e.dow, items: [] }); }
    g.items.push(e);
  });

  const clients = 26 + Math.round(newP);
  const shows = 14 + Math.round(MOTION.draw(19.4, 19.7)(T));
  const NAV = [['Клиенты', String(clients)], ['Показы', String(shows)], ['Сделки', '4'], ['Дашборд', ''], ['Отчёты', ''], ['Команда', '6']];
  const barPattern = [1, 0, 2, 1, 3, 2];
  const dim = (label) => label === 'Клиенты';

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, opacity: fade,
      fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ position: 'absolute', left: 40, top: 40, width: 1520, height: 820, borderRadius: 22,
        background: C.bg, overflow: 'hidden', opacity: shell,
        transform: 'scale(' + (0.985 + 0.015 * shell) * zoom + ')',
        boxShadow: '0 30px 90px rgba(0,0,0,.5)', border: '1px solid ' + C.hair }}>

        <div style={{ position: 'absolute', left: -160, top: -220, width: 720, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(39,192,139,.20), transparent 68%)' }}></div>

        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 58, borderBottom: '1px solid ' + C.hair,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.04em', color: C.tx1 }}>
              АГЕНТСТВО<span style={{ color: C.cta }}>.</span>
            </div>
            <div style={{ width: 1, height: 16, background: C.hair }}></div>
            <div style={{ fontSize: 12, color: C.tx3 }}>Клиентская база</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: MONO, fontSize: 15, color: C.tx1 }}>{clients}</span>
                <span style={{ fontSize: 12, color: C.tx3 }}>клиентов</span>
              </div>
              <div style={{ width: 1, height: 14, background: C.hair }}></div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: MONO, fontSize: 15, color: C.cta }}>{shows}</span>
                <span style={{ fontSize: 12, color: C.tx3 }}>показов за неделю</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon kind="filter" size={15} color={C.tx3} />
              </div>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon kind="bell" size={15} color={C.tx3} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingLeft: 16, borderLeft: '1px solid ' + C.hair }}>
              <div style={{ textAlign: 'right', lineHeight: 1.25 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.tx1 }}>Василий Петров</div>
                <div style={{ fontSize: 11, color: C.tx3 }}>Риелтор</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: C.bg3, color: C.tx1, fontSize: 11,
                fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ВП</div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 0, top: 58, bottom: 0, width: 212,
          borderRight: '1px solid ' + C.hair, padding: '16px 12px' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase',
            color: C.tx3, padding: '4px 10px 8px 10px' }}>Меню</div>
          {NAV.map(([label, count]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38, padding: '0 10px',
              borderRadius: 10, background: dim(label) ? C.bg2 : 'transparent',
              color: dim(label) ? C.tx1 : C.tx2, fontSize: 13, fontWeight: dim(label) ? 600 : 400 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: dim(label) ? C.cta : C.bd2 }}></span>
              <span style={{ flex: 1 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.tx3 }}>{count}</span>
            </div>
          ))}
          <div style={{ position: 'absolute', left: 12, right: 12, bottom: 16, borderRadius: 16, padding: 14,
            background: C.bg2 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.tx1, lineHeight: 1.4 }}>Ни одного повторного звонка</div>
            <div style={{ fontSize: 12, color: C.tx2, marginTop: 6, lineHeight: 1.5 }}>
              Коллеги видят каждое ваше касание клиента в общей ленте.
            </div>
            <div style={{ marginTop: 12, height: 32, borderRadius: 999, border: '1px solid ' + C.hair,
              color: C.tx1, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center',
              justifyContent: 'center' }}>Как это работает</div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 212, top: 58, bottom: 0, width: 296, borderRight: '1px solid ' + C.hair }}>
          <div style={{ position: 'absolute', left: 14, top: 16, fontSize: 20, fontWeight: 600, color: C.tx1,
            letterSpacing: '-.01em' }}>Клиенты</div>
          <div style={{ position: 'absolute', left: 14, top: 58, width: 268, height: 38, borderRadius: 999,
            background: C.bg2, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px' }}>
            <Icon kind="search" size={14} color={C.tx3} />
            <span style={{ fontSize: 13, color: C.tx3 }}>Поиск по имени, телефону...</span>
          </div>
          <div style={{ position: 'absolute', left: 14, top: 108, width: 268, height: 36, borderRadius: 999,
            background: C.cta, color: C.pillTx, fontSize: 12, fontWeight: 600, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 7,
            transform: 'scale(' + (1 - 0.04 * clamp(1 - Math.abs(T - 2.95) / 0.25, 0, 1)) + ')' }}>
            + Новый клиент
          </div>
          <Row y={158} o={newP} name="Сергей Грин" initials="СГ" st={active ? C.stA : C.tx3}
            stLabel={active ? 'Активен' : 'Новый'} sum={fBudget.done ? '15M' : '—'}
            last={T > 19.5 ? 'сегодня' : 'только что'} active={selP > 0.5}
            spark={[0, 0, 1, 0, T > 14.3 ? 2 : 0, T > 19.5 ? 3 : 0]} />
          {OTHERS.map((o, i) => (
            <Row key={o.name} y={158 + (i + newP) * 74} o={1} name={o.name}
              initials={o.name.split(' ').map(s => s[0]).join('')} st={o.st} stLabel={o.stLabel}
              sum={o.sum} last={o.last} active={false}
              spark={[1, 2, 0, 1, 2, 1]} />
          ))}
        </div>

        <div style={{ position: 'absolute', left: 508, top: 58, right: 0, bottom: 0, opacity: selP }}>
          <div style={{ position: 'absolute', left: 28, top: 24, right: 28, display: 'flex',
            alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.bg2, color: C.tx1,
              fontSize: 17, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>СГ</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 600, color: C.tx1, letterSpacing: '-.02em' }}>Сергей Грин</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13,
                  color: active ? C.stA : C.tx3, fontWeight: 500 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: active ? C.stA : C.tx3 }}></span>
                  {active ? 'Активен' : 'Новый'}
                </span>
                <span style={{ fontSize: 12, color: C.tx3 }}>Создан 10 сентября · ведёт Василий Петров</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ height: 36, padding: '0 16px', borderRadius: 999, background: C.cta, color: C.pillTx,
                fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon kind="phone" size={14} color={C.pillTx} /> Позвонить
              </div>
              <div style={{ height: 36, padding: '0 16px', borderRadius: 999, background: C.bg2, color: C.tx1,
                fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>WhatsApp</div>
            </div>
          </div>

          <div style={{ position: 'absolute', left: 28, top: 116, right: 28, display: 'flex', gap: 12 }}>
            {[['Показов', String(shown.filter(e => e.kind === 'home').length), 'всего'],
              ['Звонков', String(shown.filter(e => e.kind === 'phone').length), 'всего'],
              ['В работе', '4', 'дня'],
              ['Бюджет', fBudget.done ? '15M' : '—', 'до']].map(([label, val, unit]) => (
              <div key={label} style={{ flex: 1, borderRadius: 16, padding: '14px 16px', background: C.panel }}>
                <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.tx3 }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
                  <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 500, color: C.tx1 }}>{val}</span>
                  <span style={{ fontSize: 11, color: C.tx3 }}>{unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', left: 28, top: 224, right: 28, bottom: 88, borderRadius: 18,
            background: C.panel, overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid ' + C.hair, display: 'flex',
              alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: C.tx3 }}>
                  История взаимодействий
                </div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: C.cta }}>{shown.length} событий</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 26 }}>
                  {barPattern.map((n, i) => (
                    <span key={i} style={{ width: 4, borderRadius: 2,
                      height: Math.max(3, n * 7 * MOTION.draw(20.2 + i * 0.1, 20.6 + i * 0.1)(T)),
                      background: n === 0 ? C.bg3 : C.cta, opacity: n === 0 ? 1 : 0.5 + n * 0.15 }}></span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 4, padding: 3, borderRadius: 999, background: C.bg2 }}>
                  {['Все', 'Показы', 'Звонки'].map((t, i) => (
                    <span key={t} style={{ height: 26, padding: '0 12px', borderRadius: 999, fontSize: 11,
                      fontWeight: 600, display: 'flex', alignItems: 'center',
                      background: i === 0 ? C.cta : 'transparent', color: i === 0 ? C.pillTx : C.tx2 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 18, right: 18, top: 74, bottom: 16, display: 'flex',
              flexDirection: 'column', gap: 14 }}>
              {shown.length === 0 ? (
                <div style={{ paddingTop: 44, textAlign: 'center', fontSize: 13, color: C.tx3, fontStyle: 'italic' }}>
                  Пока ни одного касания — запишите первое
                </div>
              ) : null}
              {groups.map((g, gi) => {
                return (
                  <div key={g.day} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 96, flex: '0 0 96px', paddingTop: 12, textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.tx1 }}>
                        {g.day === '14 сентября' ? 'Сегодня' : g.day}
                      </div>
                      <div style={{ fontFamily: MONO, fontSize: 11, color: C.tx3, marginTop: 2 }}>
                        {g.day === '14 сентября' ? g.day : g.dow}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingLeft: 18, borderLeft: '1px solid ' + C.hair }}>
                      {g.items.map((e, i) => {
                        const p = MOTION.enter(e.at, 0.5)(T);
                        const col = C[e.kind];
                        return (
                          <div key={e.title} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start',
                            gap: 12, padding: '12px 14px', marginBottom: 10, borderRadius: 14, background: C.bg2,
                            opacity: p, transform: 'translateY(' + (1 - p) * 12 + 'px)' }}>
                            <span style={{ position: 'absolute', left: -22, top: 20, width: 7, height: 7,
                              borderRadius: '50%', background: col }}></span>
                            <div style={{ width: 26, height: 26, flex: '0 0 auto', marginTop: 1, display: 'flex',
                              alignItems: 'center', justifyContent: 'center' }}>
                              <Icon kind={e.kind} size={16} color={col} w={1.7} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 14, fontWeight: 500, color: C.tx1, lineHeight: 1.45 }}>{e.title}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                <span style={{ fontFamily: MONO, fontSize: 11, color: C.tx3 }}>{e.time}</span>
                                <span style={{ fontSize: 12, color: C.tx3 }}>{e.by}</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.tx3 }}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 4h12v16l-6-3.5L6 20z"></path>
                                  </svg>
                                  1 заметка
                                </span>
                              </div>
                              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8,
                                opacity: MOTION.enter(e.at + 0.3, 0.5)(T) }}>
                                {e.notes.map(nt => (
                                  <div key={nt.at}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <span style={{ width: 20, height: 20, borderRadius: 6, background: C.bg3,
                                        color: C.tx2, fontFamily: MONO, fontSize: 9, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center' }}>
                                        {nt.by.split(' ').map(x => x[0]).join('')}
                                      </span>
                                      <span style={{ fontSize: 13, fontWeight: 600, color: C.tx1 }}>{nt.by}</span>
                                      <span style={{ fontFamily: MONO, fontSize: 11, color: C.tx3 }}>{nt.at}</span>
                                    </div>
                                    <div style={{ fontSize: 13, lineHeight: 1.6, color: C.tx1, marginTop: 6 }}>{nt.text}</div>
                                    <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
                                      <span style={{ fontSize: 12, color: C.tx3 }}>Изменить</span>
                                      <span style={{ fontSize: 12, color: C.tx3 }}>Удалить</span>
                                    </div>
                                  </div>
                                ))}
                                <div style={{ fontSize: 12, fontWeight: 600, color: C.cta }}>+ Добавить заметку</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ position: 'absolute', left: 28, right: 28, bottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 44, borderRadius: 999, background: C.cta, color: C.pillTx,
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transform: 'scale(' + (1 - 0.015 * clamp(1 - Math.abs(T - 10.25) / 0.3, 0, 1)
                - 0.015 * clamp(1 - Math.abs(T - 15.65) / 0.3, 0, 1)) + ')' }}>
              + Добавить событие
            </div>
            <div style={{ fontSize: 11, color: C.tx3, maxWidth: 200, lineHeight: 1.4 }}>
              30 секунд на запись — и коллеги в курсе
            </div>
          </div>
        </div>

        {formO > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,5,.62)', opacity: formO }}></div>
        ) : null}
        {formO > 0.01 ? (
          <Modal o={formO} title="Новый клиент" sub="Лид с сайта · 10 сентября" cta="Создать клиента">
            <Field x={22} y={104} w={556} label="Имя" value={fName.text} caret={fName.active} />
            <Field x={22} y={192} w={556} label="Телефон" value={fPhone.text} caret={fPhone.active} mono />
            <Field x={22} y={274} w={556} label="Бюджет" value={fBudget.text} caret={fBudget.active} />
          </Modal>
        ) : null}

        {ev1O > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,5,.62)', opacity: ev1O }}></div>
        ) : null}
        {ev1O > 0.01 ? (
          <Modal o={ev1O} title="Добавить событие" sub="Клиент Сергей Грин" cta="Сохранить">
            <div style={{ position: 'absolute', left: 22, top: 96, fontSize: 12, color: C.tx3 }}>Тип события</div>
            <Chip x={22} y={118} label="Звонок" on={T > 11.0} />
            <Chip x={118} y={118} label="Показ квартиры" on={false} />
            <Chip x={258} y={118} label="Сообщение" on={false} />
            <Field x={22} y={176} w={264} label="Длительность звонка" value={T > 11.35 ? '25 мин' : ''} caret={false} mono />
            <Field x={22} y={264} w={556} label="Заметка" value={n1.text} caret={n1.active} />
            <div style={{ position: 'absolute', left: 22, top: 356, fontSize: 12, color: C.tx3 }}>Статус клиента</div>
            <Chip x={22} y={378} label="Активен" on={T > 13.5} dot={C.stA} />
            <Chip x={132} y={378} label="Жду звонка" on={false} dot={C.stW} />
          </Modal>
        ) : null}

        {ev2O > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,5,.62)', opacity: ev2O }}></div>
        ) : null}
        {ev2O > 0.01 ? (
          <Modal o={ev2O} title="Добавить событие" sub="Клиент Сергей Грин · 14 сентября" cta="Сохранить">
            <div style={{ position: 'absolute', left: 22, top: 96, fontSize: 12, color: C.tx3 }}>Тип события</div>
            <Chip x={22} y={118} label="Звонок" on={false} />
            <Chip x={118} y={118} label="Показ квартиры" on={T > 15.95} />
            <Chip x={258} y={118} label="Сообщение" on={false} />
            <Field x={22} y={176} w={556} label="Адрес квартиры" value={addr.text} caret={addr.active} />
            <Field x={22} y={264} w={556} label="Заметка" value={n2.text} caret={n2.active} />
            <div style={{ position: 'absolute', left: 22, top: 356, fontSize: 12, color: C.tx3 }}>Статус клиента</div>
            <Chip x={22} y={378} label="Активен" on={true} dot={C.stA} />
            <Chip x={132} y={378} label="Жду звонка" on={false} dot={C.stW} />
          </Modal>
        ) : null}
      </div>

      <div style={{ position: 'absolute', left: cur.x - 3, top: cur.y - 2, width: 22, height: 22, opacity: shell }}>
        {clickPulse > 0.02 ? (
          <div style={{ position: 'absolute', left: -14, top: -14, width: 50, height: 50, borderRadius: '50%',
            border: '2px solid ' + C.cta, opacity: clickPulse * 0.8,
            transform: 'scale(' + (0.4 + (1 - clickPulse) * 0.9) + ')' }}></div>
        ) : null}
        <svg width="22" height="22" viewBox="0 0 24 24" fill={C.tx1} stroke={C.bg} strokeWidth="1.2">
          <path d="M5 3l14 8-6 1.4L10.5 19z"></path>
        </svg>
      </div>
    </div>
  );
}

function Movie() {
  return (
    <CompositionStage width={1600} height={900} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={C.bg}>
      <Piece />
    </CompositionStage>
  );
}

window.Piece = Piece;
window.Movie = Movie;
module.exports = { Piece, Movie };
