/* Мобильные экраны CRM: список, меню, карточка, событие, разделы. */
const { CompositionStage, useComposition, animate, clamp, Easing } = window;

const C = {
  bg: '#0B0B0A', panel: '#131312', bg2: '#1C1B19', bg3: '#26241F',
  tx1: '#F5F3F0', tx2: '#BCB8B2', tx3: '#8B8680',
  hair: 'rgba(255,255,255,.08)', bd2: '#4A4540', cta: '#27C08B', pillTx: '#08211A',
  home: '#6FC2A0', phone: '#7FA8D4', msg: '#D2B36B', meet: '#B99AD4',
  stA: '#6FC28A', stW: '#D2A65B', stC: '#A5A09A', stR: '#D4837A'
};
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const enter = (start, dur) => animate({ from: 0, to: 1, start: start, end: start + (dur || 0.5), ease: Easing.easeOutCubic });
const lin = (start, end) => animate({ from: 0, to: 1, start: start, end: end, ease: Easing.linear });

const PATHS = {
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z',
  home: 'M3 10.5L12 3.5l9 7V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  msg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  meet: 'M3.5 5h17v15h-17zM8 3v4M16 3v4M3.5 10h17',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4.2-4.2',
  filter: 'M4 7h16M4 17h16',
  burger: 'M4 7h16M4 12h16M4 17h16',
  back: 'M19 12H5M11 18l-6-6 6-6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  link: 'M10 13a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7L11.5 5.8M14 11a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1.5-1.5'
};
const Icon = ({ kind, size, color, w }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={w || 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={PATHS[kind]}></path>
  </svg>
);

const CLIENTS = [
  { name: 'Сергей Грин', st: C.stA, stL: 'Активен', sum: '15M', last: 'вчера', spark: [1, 2, 0, 3, 1, 2] },
  { name: 'Ольга Панина', st: C.stA, stL: 'Активен', sum: '20M', last: 'сегодня', spark: [2, 1, 3, 1, 2, 3] },
  { name: 'Марина Ковалёва', st: C.stW, stL: 'Жду звонка', sum: '10M', last: '2 дня назад', spark: [0, 1, 0, 1, 2, 0] },
  { name: 'Тимур Асхабов', st: C.stW, stL: 'Жду звонка', sum: '14M', last: 'вчера', spark: [1, 2, 1, 0, 2, 1] },
  { name: 'Артём Дубов', st: C.stC, stL: 'Холодный', sum: '8M', last: 'неделю назад', spark: [0, 0, 1, 0, 0, 1] },
  { name: 'Илья Ремизов', st: C.stR, stL: 'Отказал', sum: '11M', last: '5 дней назад', spark: [1, 0, 0, 0, 1, 0] },
  { name: 'Ксения Гладко', st: C.stA, stL: 'Активен', sum: '24M', last: 'сегодня', spark: [2, 3, 1, 2, 3, 2] }
];
const HIST = [
  { kind: 'home', title: 'Показ ул. Толстого д.25', when: '14 сент · 14:30', by: 'Василий Петров',
    notes: [{ by: 'Василий Петров', at: '15:10', text: 'Квартира понравилась, но смущает первый этаж.' },
      { by: 'Марина Грязнова', at: '17:40', text: 'Подобрала три варианта в этом же доме.' }] },
  { kind: 'phone', title: 'Звонок (25 мин)', when: '13 сент · 11:15', by: 'Марина Грязнова', notes: [] },
  { kind: 'msg', title: 'Подборка из 4 объектов', when: '11 сент · 19:20', by: 'Марина Грязнова',
    notes: [{ by: 'Марина Грязнова', at: '19:22', text: 'Три варианта выше третьего этажа.' }] }
];
const NAV = [['Клиенты', '26'], ['Показы', '14'], ['Сделки', '4'], ['Дашборд', ''], ['Отчёты', ''], ['Команда', '6']];
const SHOWINGS = [
  ['ул. Толстого д.25', '8.5 млн', 'Сергей Грин · сегодня 14:30', 'Запланирован', C.phone],
  ['ул. Мичурина д.71', '19 млн', 'Ольга Панина · сегодня 11:00', 'Думает', C.msg],
  ['ЖК Парковый, к.3', '23 млн', 'Ксения Гладко · 13 сент', 'Понравилось', C.home],
  ['ул. Лениных полей д.10', '12 млн', 'Сергей Грин · 12 сент', 'Отказ', C.stR]
];
const DEALS = [
  ['Подбор', '34 млн', C.msg, [['Сергей Грин', 'ул. Толстого д.25', '8.5 млн', 'В. Петров'],
    ['Тимур Асхабов', 'пр. Гагарина д.4', '11.2 млн', 'В. Петров']]],
  ['Оформление', '19 млн', C.phone, [['Ольга Панина', 'ул. Мичурина д.71', '19 млн', 'М. Грязнова']]],
  ['Закрыты', '23 млн', C.home, [['Ксения Гладко', 'ЖК Парковый, к.3', '23 млн', 'М. Грязнова']]]
];
const TOUCH = [['Пн', 6], ['Вт', 11], ['Ср', 8], ['Чт', 4], ['Пт', 12], ['Сб', 9], ['Вс', 3]];
const LEADERS = [['Марина Грязнова', 6], ['Василий Петров', 5], ['Дмитрий Кутузов', 2], ['Анна Соболь', 1]];
const REPORTS = [['Активность риелторов', 'сентябрь'], ['Воронка по клиентам', 'сентябрь'],
  ['Показы и итоги', 'неделя'], ['Клиенты без касания', 'сейчас']];
const TEAM = [['Марина Грязнова', '9', '6', 90], ['Василий Петров', '8', '5', 80],
  ['Дмитрий Кутузов', '5', '2', 50], ['Анна Соболь', '4', '1', 40]];

const SCREENS = [
  { at: 0, nav: 'Клиенты', title: 'Клиенты' },
  { at: 3.4, nav: 'Клиенты', title: 'Клиенты', sheet: 'menu' },
  { at: 6.3, nav: 'Клиенты', title: 'Клиенты' },
  { at: 7.2, nav: 'Клиенты', title: 'Клиенты', sheet: 'filters' },
  { at: 10.0, nav: 'Карточка', title: 'Сергей Грин' },
  { at: 13.8, nav: 'Событие', title: 'Добавить событие' },
  { at: 17.2, nav: 'Клиенты', title: 'Клиенты' },
  { at: 18.2, nav: 'Клиенты', title: 'Клиенты', sheet: 'menu' },
  { at: 19.8, nav: 'Показы', title: 'Показы' },
  { at: 21.6, nav: 'Показы', title: 'Показы', sheet: 'menu' },
  { at: 23.0, nav: 'Сделки', title: 'Сделки' },
  { at: 24.8, nav: 'Сделки', title: 'Сделки', sheet: 'menu' },
  { at: 26.2, nav: 'Дашборд', title: 'Дашборд' },
  { at: 28.4, nav: 'Дашборд', title: 'Дашборд', sheet: 'menu' },
  { at: 29.8, nav: 'Отчёты', title: 'Отчёты' },
  { at: 31.4, nav: 'Отчёты', title: 'Отчёты', sheet: 'menu' },
  { at: 32.8, nav: 'Команда', title: 'Команда' }
];

// строки шторки «Меню»: 6 пунктов по 48px, шторка прижата к низу телефона
const SHEET_ROW = i => 584 + i * 48;
const BURGER = [639, 104];
const FILTER_ICON = [961, 104];

const HOME = [800, 620];

const TAPS = [
  [3.15, BURGER[0], BURGER[1]],           // бургер → меню
  [6.05, 800, SHEET_ROW(0)],              // пункт «Клиенты» в шторке
  [6.95, FILTER_ICON[0], FILTER_ICON[1]], // иконка фильтров
  [9.75, 720, 824],                      // «Применить» в шторке фильтров
  [10.4, 803, 303],                      // строка клиента Сергей Грин
  [13.55, 800, 828],                     // «+ Добавить событие»
  [16.95, BURGER[0], BURGER[1]],          // «Назад» из формы
  [17.95, BURGER[0], BURGER[1]],          // бургер → меню
  [19.55, 800, SHEET_ROW(1)],             // «Показы»
  [21.35, BURGER[0], BURGER[1]],
  [22.75, 800, SHEET_ROW(2)],             // «Сделки»
  [24.55, BURGER[0], BURGER[1]],
  [25.95, 800, SHEET_ROW(3)],             // «Дашборд»
  [28.15, BURGER[0], BURGER[1]],
  [29.55, 800, SHEET_ROW(4)],             // «Отчёты»
  [31.15, BURGER[0], BURGER[1]],
  [32.55, 800, SHEET_ROW(5)]              // «Команда»
];

function fingerAt(T) {
  let idx = -1;
  TAPS.forEach((tap, i) => { if (T >= (i > 0 ? TAPS[i - 1][0] : -99)) { idx = i; } });
  if (idx < 0) { return { x: HOME[0], y: HOME[1], press: 0 }; }
  const tap = TAPS[idx];
  const prev = idx > 0 ? TAPS[idx - 1] : null;
  const from = prev ? [prev[1], prev[2]] : HOME;
  const prevT = prev ? prev[0] : tap[0] - 1.6;
  const t0 = Math.max(prevT, tap[0] - 1.5);
  const t1 = tap[0];
  const p = Easing.easeInOutCubic(clamp((T - t0) / (t1 - t0 || 1), 0, 1));
  const press = TAPS.reduce((a, tp) => Math.max(a,
    T < tp[0] ? 0 : 1 - Easing.easeOutCubic(clamp((T - tp[0]) / 0.85, 0, 1))), 0);
  return { x: from[0] + (tap[1] - from[0]) * p, y: from[1] + (tap[2] - from[1]) * p, press: press };
}

function screenAt(T) {
  let i = 0;
  SCREENS.forEach((s, idx) => { if (T >= s.at) { i = idx; } });
  return i;
}

const initials = n => n.split(' ').map(s => s[0]).join('');

const Head = ({ title, left, right }) => (
  <div style={{ position: 'relative', height: 56, padding: '0 12px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between' }}>
    <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {left ? <Icon kind={left} size={22} color={C.tx1} /> : null}
    </div>
    <div style={{ fontSize: title.length > 14 ? 16 : 18, fontWeight: 600, color: C.tx1, letterSpacing: '-.01em' }}>{title}</div>
    <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {right ? <Icon kind={right} size={22} color={C.tx1} /> : null}
    </div>
  </div>
);

const Divider = () => <div style={{ height: 1, background: C.hair }}></div>;

const ClientList = () => (
  <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    <div style={{ padding: '4px 12px 12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, padding: '0 2px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, height: 34, padding: '0 12px',
          borderRadius: 999, background: C.bg2 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.stA }}></span>
          <span style={{ fontSize: 12, color: C.tx1 }}>26 клиентов</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 34, padding: '0 12px', borderRadius: 999, background: C.bg2 }}>
          <span style={{ fontSize: 12, color: C.tx2 }}>Показов</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.tx1 }}>14</span>
        </div>
      </div>
      <div style={{ height: 44, borderRadius: 999, background: C.bg2, display: 'flex', alignItems: 'center',
        gap: 10, padding: '0 16px' }}>
        <Icon kind="search" size={15} color={C.tx3} />
        <span style={{ fontSize: 14, color: C.tx3 }}>Поиск...</span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['Все', 'Активные', 'Жду звонка', 'Холодные'].map((t, i) => (
          <span key={t} style={{ height: 32, padding: '0 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
            background: i === 0 ? C.cta : C.bg2, color: i === 0 ? C.pillTx : C.tx2 }}>{t}</span>
        ))}
      </div>
    </div>
    <div style={{ flex: 1, padding: '0 12px' }}>
      {CLIENTS.map((c, i) => (
        <div key={c.name} style={{ minHeight: 68, padding: 12, marginBottom: 8, borderRadius: 16,
          background: i === 0 ? C.bg3 : C.panel, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.bg2, color: C.tx1,
            fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {initials(c.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.tx1 }}>{c.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.st }}></span>
              <span style={{ fontSize: 12, color: c.st, fontWeight: 500 }}>{c.stL}</span>
              <span style={{ fontSize: 11, color: C.tx3 }}>{c.last}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx1 }}>{c.sum}</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {c.spark.map((n, j) => (
                <span key={j} style={{ width: 3, height: 4 + n * 3, borderRadius: 2, display: 'inline-block',
                  background: n === 0 ? C.bg3 : C.cta, opacity: n === 0 ? 1 : 0.45 + n * 0.16 }}></span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Sheet = ({ kind, o, cur, pick }) => (
  <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,5,' + (0.6 * o).toFixed(2) + ')',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
    <div style={{ borderRadius: '24px 24px 40px 40px', background: C.panel, padding: '14px 14px 24px 14px',
      transform: 'translateY(' + (1 - o) * 60 + 'px)' }}>
      <div style={{ width: 36, height: 4, borderRadius: 999, background: C.bg3, margin: '2px auto 14px auto' }}></div>
      <div style={{ fontSize: 17, fontWeight: 600, color: C.tx1, padding: '0 4px 12px 4px' }}>
        {kind === 'menu' ? 'Меню' : 'Фильтры'}
      </div>
      {kind === 'menu' ? NAV.map(([label, count], i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 48,
          padding: '0 10px', margin: '0 -6px', borderRadius: 12,
          background: i === pick ? C.bg2 : 'transparent',
          color: i === cur || i === pick ? C.tx1 : C.tx2, fontSize: 15,
          fontWeight: i === cur || i === pick ? 600 : 400 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%',
            background: i === cur || i === pick ? C.cta : C.bg3 }}></span>
          <span style={{ flex: 1 }}>{label}</span>
          <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx3 }}>{count}</span>
        </div>
      )) : (
        <div>
          {[['Статус', ['Активные', 'Жду звонка', 'Холодные', 'Отказали'], [3, 2, 2, 1], [true, false, false, false]],
            ['Срок контакта', ['За последний день', 'За неделю', 'За месяц'], ['', '', ''], [false, true, false]]].map(
            ([title, items, counts, on]) => (
              <div key={title} style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase',
                  color: C.tx3, padding: '0 4px 6px 4px' }}>{title}</div>
                {items.map((it, i) => (
                  <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, padding: '0 4px' }}>
                    <span style={{ width: 18, height: 18, borderRadius: 6, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 11, fontWeight: 700,
                      background: on[i] ? C.cta : 'transparent', color: C.pillTx,
                      border: on[i] ? 'none' : '1px solid ' + C.bd2 }}>{on[i] ? '✓' : ''}</span>
                    <span style={{ fontSize: 14, color: C.tx1, flex: 1 }}>{it}</span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx3 }}>{counts[i]}</span>
                  </div>
                ))}
              </div>
            ))}
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <div style={{ flex: 1, minHeight: 48, borderRadius: 999, background: C.cta, color: C.pillTx,
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Применить</div>
            <div style={{ flex: 1, minHeight: 48, borderRadius: 999, background: C.bg2, color: C.tx1,
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Сбросить</div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const ClientCard = () => (
  <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '8px 12px 16px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ borderRadius: 20, padding: '20px 16px', background: C.panel, display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.bg2, color: C.tx1,
          fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>СГ</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: C.tx1, letterSpacing: '-.01em' }}>Сергей Грин</div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: C.stA, fontWeight: 500 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.stA }}></span>Активен
        </span>
        <div style={{ fontSize: 12, color: C.tx3 }}>Создан 10 сентября · Марина Грязнова</div>
        <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 6 }}>
          <div style={{ flex: 1, minHeight: 44, borderRadius: 999, background: C.cta, color: C.pillTx,
            fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Позвонить</div>
          <div style={{ flex: 1, minHeight: 44, borderRadius: 999, background: C.bg2, color: C.tx1,
            fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>WhatsApp</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[['Показов', '2'], ['Звонков', '2'], ['В работе', '12'], ['Бюджет', '15M']].map(([l, v]) => (
          <div key={l} style={{ borderRadius: 14, padding: 12, background: C.panel }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: C.tx3 }}>{l}</div>
            <div style={{ fontFamily: MONO, fontSize: 18, color: C.tx1, marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: 16, padding: 14, background: C.panel }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: C.tx3 }}>
          История · последние 5
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {HIST.map((e, ei) => (
            <div key={e.title} style={{ padding: 12, borderRadius: 14, background: C.bg2 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 24, height: 24, flex: '0 0 auto', display: 'flex', alignItems: 'center',
                  justifyContent: 'center' }}>
                  <Icon kind={e.kind} size={16} color={C[e.kind]} w={1.7} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.tx1, lineHeight: 1.4 }}>{e.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: C.tx3 }}>{e.when}</span>
                    {e.notes.length ? (
                      <span style={{ fontSize: 11, color: C.tx3 }}>
                        · {e.notes.length === 1 ? '1 заметка' : e.notes.length + ' заметки'}
                      </span>
                    ) : null}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: C.tx3 }}>{ei === 0 ? '⌃' : '⌄'}</span>
              </div>
              {ei === 0 && e.notes.length ? (
                <div style={{ marginTop: 12, marginLeft: 34, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {e.notes.map(nt => (
                    <div key={nt.at}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 20, height: 20, borderRadius: 6, background: C.bg3, color: C.tx2,
                          fontFamily: MONO, fontSize: 9, display: 'flex', alignItems: 'center',
                          justifyContent: 'center' }}>
                          {nt.by.split(' ').map(x => x[0]).join('')}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.tx1 }}>{nt.by}</span>
                        <span style={{ fontFamily: MONO, fontSize: 10, color: C.tx3 }}>{nt.at}</span>
                      </div>
                      <div style={{ fontSize: 12, lineHeight: 1.55, color: C.tx1, marginTop: 5 }}>{nt.text}</div>
                      <div style={{ display: 'flex', gap: 14, marginTop: 5 }}>
                        <span style={{ fontSize: 11, color: C.tx3 }}>Изменить</span>
                        <span style={{ fontSize: 11, color: C.tx3 }}>Удалить</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.cta }}>+ Добавить заметку</div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ flexShrink: 0, padding: '12px 12px 24px 12px', borderTop: '1px solid ' + C.hair }}>
      <div style={{ minHeight: 48, borderRadius: 999, background: C.cta, color: C.pillTx, fontSize: 13,
        fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        + Добавить событие
      </div>
    </div>
  </div>
);

const EventForm = ({ T, start }) => {
  const p = clamp((T - start - 0.6) / 1.6, 0, 1);
  const addr = 'ул. Толстого д.25'.slice(0, Math.round(p * 17));
  const note = p >= 1 ? 'Квартира понравилась, смущает первый этаж'.slice(0,
    Math.round(clamp((T - start - 2.3) / 1.2, 0, 1) * 41)) : '';
  const label = t => <div style={{ fontSize: 12, color: C.tx3 }}>{t}</div>;
  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
      overflow: 'hidden' }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '12px 12px 16px 12px',
        display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, minHeight: 56,
          padding: '0 14px', borderRadius: 16, background: C.bg2 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.bg3, color: C.tx1,
            fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>СГ</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.tx1 }}>Сергей Грин</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.tx3, marginTop: 3 }}>14 сент, 14:30</div>
          </div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {label('Тип события *')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Показ квартиры', 'Звонок', 'WhatsApp', 'Встреча', 'Другое'].map((t, i) => (
              <span key={t} style={{ minHeight: 40, padding: '0 14px', borderRadius: 999, fontSize: 12,
                fontWeight: i === 0 ? 600 : 500, display: 'flex', alignItems: 'center',
                background: i === 0 ? C.cta : C.bg2, color: i === 0 ? C.pillTx : C.tx2 }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {label('Адрес квартиры *')}
          <div style={{ minHeight: 48, padding: '0 16px', borderRadius: 14, background: C.bg2,
            color: addr ? C.tx1 : C.tx3, fontSize: 14, display: 'flex', alignItems: 'center' }}>
            {addr || 'Начните вводить адрес...'}
            {p > 0 && p < 1 ? <span style={{ width: 2, height: 18, marginLeft: 2, background: C.cta }}></span> : null}
          </div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {label('Статус клиента *')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[['Активен', C.stA], ['Жду звонка', C.stW], ['Холодный', C.stC], ['Отказал', C.stR]].map(([l, col], i) => (
              <span key={l} style={{ minHeight: 40, padding: '0 14px', borderRadius: 999, fontSize: 12,
                fontWeight: i === 0 ? 600 : 500, display: 'flex', alignItems: 'center', gap: 7,
                background: i === 0 ? 'color-mix(in srgb, ' + col + ' 22%, ' + C.panel + ')' : C.bg2,
                color: i === 0 ? col : C.tx2 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: col }}></span>{l}
              </span>
            ))}
          </div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {label('Заметка (опционально)')}
          <div style={{ height: 104, flexShrink: 0, padding: '12px 16px', borderRadius: 14, background: C.bg2,
            color: note ? C.tx1 : C.tx3, fontSize: 14, lineHeight: 1.6 }}>
            {note || 'Добавьте информацию о клиенте...'}
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 12px 24px 12px', borderTop: '1px solid ' + C.hair,
        display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ minHeight: 48, borderRadius: 999, background: C.cta, color: C.pillTx, fontSize: 13,
          fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Сохранить</div>
        <div style={{ minHeight: 48, borderRadius: 999, background: C.bg2, color: C.tx1, fontSize: 13,
          fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Отменить</div>
      </div>
    </div>
  );
};

const ShowingsM = () => (
  <div style={{ flex: 1, padding: '4px 12px 24px 12px' }}>
    {SHOWINGS.map(([addr, price, meta, result, col]) => (
      <div key={addr} style={{ padding: '14px 4px', borderBottom: '1px solid ' + C.hair }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: C.tx1 }}>{addr}</span>
          <span style={{ fontFamily: MONO, fontSize: 13, color: C.tx1 }}>{price}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 6 }}>
          <span style={{ fontSize: 12, color: C.tx2 }}>{meta}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: col, fontSize: 13, fontWeight: 500 }}>
            <span style={{ width: 3, height: 14, borderRadius: 1, background: col }}></span>{result}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const DealsM = () => (
  <div style={{ flex: 1, padding: '4px 12px 24px 12px', display: 'flex', flexDirection: 'column', gap: 20 }}>
    {DEALS.map(([title, sum, col, cards]) => (
      <div key={title}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 4px 10px 4px', borderBottom: '1px solid ' + C.hair }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: col }}></span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.tx1 }}>{title}</span>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx3 }}>{sum}</span>
        </div>
        {cards.map(([name, addr, s, realtor]) => (
          <div key={name} style={{ padding: '13px 4px', borderBottom: '1px solid ' + C.hair }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.tx1 }}>{name}</span>
              <span style={{ fontFamily: MONO, fontSize: 13, color: C.tx1 }}>{s}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginTop: 4 }}>
              <span style={{ fontSize: 12, color: C.tx2 }}>{addr}</span>
              <span style={{ fontSize: 11, color: C.tx3 }}>{realtor}</span>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

const DashM = ({ T, start }) => {
  const grow = lin(start + 0.3, start + 1.5)(T);
  const pts = TOUCH.map(([, v], i) => ({
    x: Math.round((i + 0.5) * (660 / TOUCH.length)),
    y: Math.round(175 - (v / 12) * 155 * grow)
  }));
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p.x + ',' + p.y).join(' ');
  const area = 'M' + pts[0].x + ',175 ' + pts.map(p => 'L' + p.x + ',' + p.y).join(' ') + ' L' + pts[pts.length - 1].x + ',175 Z';
  return (
    <div style={{ flex: 1, padding: '4px 12px 24px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[['Клиентов', '26', '+4'], ['Показов', '14', '+3'], ['Сделок', '4', '+1'], ['Без касания', '5', '−2']].map(([l, v, d]) => (
          <div key={l} style={{ borderRadius: 14, padding: 14, background: C.panel }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: C.tx3 }}>{l}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 500, color: C.tx1 }}>{v}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: d.indexOf('−') === 0 ? C.home : C.cta }}>{d}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: 18, padding: 16, background: C.panel }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: C.tx3 }}>
          Касания клиентов по дням
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 500, color: C.tx1 }}>{Math.round(53 * grow)}</span>
          <span style={{ fontSize: 12, color: C.tx2 }}>касаний за неделю</span>
        </div>
        <svg viewBox="0 0 660 190" preserveAspectRatio="none"
          style={{ width: '100%', height: 128, display: 'block', overflow: 'visible', marginTop: 16 }}>
          <defs>
            <linearGradient id="mFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.cta} stopOpacity="0.28"></stop>
              <stop offset="100%" stopColor={C.cta} stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map(i => (
            <line key={i} x1="0" y1={10 + i * 55} x2="660" y2={10 + i * 55} stroke={C.hair} strokeWidth="1"></line>
          ))}
          <path d={area} fill="url(#mFill)"></path>
          <path d={line} fill="none" stroke={C.cta} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"></path>
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i === 4 ? 8 : 5} fill={C.panel} stroke={C.cta} strokeWidth="3"></circle>
          ))}
        </svg>
        <div style={{ display: 'flex', marginTop: 10 }}>
          {TOUCH.map(([label, v], i) => (
            <div key={label} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: MONO, fontSize: 13, color: i === 4 ? C.cta : C.tx2,
                fontWeight: i === 4 ? 600 : 400 }}>{v}</div>
              <div style={{ fontSize: 11, marginTop: 2, color: i === 4 ? C.tx1 : C.tx3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase',
          color: C.tx3, padding: '0 4px 12px 4px' }}>Показы по риелторам</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 4px' }}>
          {LEADERS.map(([name, n]) => (
            <div key={name}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: C.tx1 }}>{name}</span>
                <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx2 }}>{n} показов</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: C.bg2, marginTop: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: (n / 6 * 100 * grow) + '%', borderRadius: 999, background: C.cta }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReportsM = () => (
  <div style={{ flex: 1, padding: '4px 12px 24px 12px' }}>
    {REPORTS.map(([title, period]) => (
      <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 4px',
        borderBottom: '1px solid ' + C.hair }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.tx1, lineHeight: 1.4 }}>{title}</div>
          <div style={{ fontSize: 11, color: C.tx3, marginTop: 3 }}>{period}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: C.bg2, display: 'flex',
          alignItems: 'center', justifyContent: 'center' }}>
          <Icon kind="link" size={17} color={C.tx2} />
        </div>
        <div style={{ minHeight: 44, padding: '0 16px', borderRadius: 999, background: C.cta, color: C.pillTx,
          fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Скачать</div>
      </div>
    ))}
  </div>
);

const TeamM = ({ T, start }) => {
  const grow = lin(start + 0.3, start + 1.4)(T);
  return (
    <div style={{ flex: 1, padding: '4px 12px 24px 12px' }}>
      {TEAM.map(([name, clients, shows, pct]) => (
        <div key={name} style={{ padding: '14px 4px', borderBottom: '1px solid ' + C.hair, display: 'flex',
          alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.bg2, color: C.tx2,
            fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {initials(name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.tx1 }}>{name}</div>
            <div style={{ fontSize: 12, color: C.tx3, marginTop: 2 }}>{clients} клиентов · {shows} показов</div>
            <div style={{ height: 5, borderRadius: 999, background: C.bg2, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: (pct * grow) + '%', borderRadius: 999,
                background: pct > 85 ? C.msg : C.cta }}></div>
            </div>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx3 }}>{pct}%</span>
        </div>
      ))}
    </div>
  );
};

function Piece() {
  const { T, authoredTotal } = useComposition();
  const fade = Math.min(enter(0.1, 0.7)(T), 1 - lin(authoredTotal - 0.7, authoredTotal)(T));
  const shell = enter(0.15, 0.9)(T);
  const i = screenAt(T);
  const s = SCREENS[i];
  const prev = SCREENS[i - 1];

  const DUR = 0.62;
  const t = clamp((T - s.at) / DUR, 0, 1);
  const p = Easing.easeInOutCubic(t);

  const bodyKey = sc => sc.nav;
  const bodyFor = (sc, start) => {
    const key = bodyKey(sc);
    if (key === 'Клиенты') { return <ClientList />; }
    if (key === 'Карточка') { return <ClientCard />; }
    if (key === 'Событие') { return <EventForm T={T} start={start} />; }
    if (key === 'Показы') { return <ShowingsM />; }
    if (key === 'Сделки') { return <DealsM />; }
    if (key === 'Дашборд') { return <DashM T={T} start={start} />; }
    if (key === 'Отчёты') { return <ReportsM />; }
    return <TeamM T={T} start={start} />;
  };
  const headFor = sc => (sc.nav === 'Карточка' ? { left: 'back', right: 'more' }
    : sc.nav === 'Событие' ? { left: 'back', right: null }
      : bodyKey(sc) === 'Клиенты' ? { left: 'burger', right: 'filter' } : { left: 'burger', right: null });

  const swapping = prev && bodyKey(prev) !== bodyKey(s) && t < 1;
  const DEPTH = { 'Клиенты': 0, 'Показы': 0, 'Сделки': 0, 'Дашборд': 0, 'Отчёты': 0, 'Команда': 0,
    'Карточка': 1, 'Событие': 2 };
  const dd = swapping ? DEPTH[bodyKey(s)] - DEPTH[bodyKey(prev)] : 0;

  const layer = (sc, start, dir) => {
    const slide = dd !== 0;
    if (!slide && dir < 0) { return null; }
    const sign = dd > 0 ? 1 : -1;
    const tx = slide ? (dir > 0 ? sign * 390 * (1 - p) : dir < 0 ? -sign * 110 * p : 0) : 0;
    const ty = slide ? 0 : (dir > 0 ? (1 - p) * 20 : 0);
    const op = dir === 0 ? 1 : slide ? (dir > 0 ? 1 : 1 - 0.45 * p) : Math.min(1, p * 1.6);
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', background: C.bg, opacity: op,
        transform: 'translate(' + tx + 'px,' + ty + 'px) scale('
          + (slide ? 1 : dir > 0 ? 0.99 + 0.01 * p : dir < 0 ? 1 - 0.006 * p : 1) + ')',
        boxShadow: slide && dir > 0 ? '-18px 0 44px rgba(0,0,0,.5)' : 'none' }}>
        {bodyFor(sc, start)}
      </div>
    );
  };

  const fg = fingerAt(T);

  const titleShift = swapping ? (1 - p) * 10 : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, opacity: fade,
      fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ position: 'absolute', left: 605, top: 28, width: 390, height: 844, borderRadius: 40,
        overflow: 'hidden', border: '1px solid ' + C.hair, background: C.bg, opacity: shell,
        transform: 'scale(' + (0.985 + 0.015 * shell) + ')',
        boxShadow: '0 24px 80px rgba(0,0,0,.45)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', left: -90, top: -140, width: 420, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(39,192,139,.20), transparent 68%)' }}></div>

        <div style={{ position: 'relative', height: 48, padding: '0 24px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', fontFamily: MONO, fontSize: 12, fontWeight: 500, color: C.tx1,
          flexShrink: 0 }}>
          <span>9:41</span>
          <span style={{ width: 24, height: 11, borderRadius: 3, border: '1px solid ' + C.tx3, padding: 1 }}>
            <span style={{ display: 'block', width: '70%', height: '100%', background: C.tx1, borderRadius: 2 }}></span>
          </span>
        </div>

        <div style={{ position: 'relative', height: 56, flexShrink: 0 }}>
          {swapping ? (
            <div style={{ position: 'absolute', inset: 0, opacity: 1 - p,
              transform: 'translateY(' + -p * 8 + 'px)' }}>
              <Head title={prev.title} left={headFor(prev).left} right={headFor(prev).right} />
            </div>
          ) : null}
          <div style={{ position: 'absolute', inset: 0, opacity: swapping ? p : 1,
            transform: 'translateY(' + titleShift + 'px)' }}>
            <Head title={s.title} left={headFor(s).left} right={headFor(s).right} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1,
            background: C.hair, opacity: bodyKey(s) === 'Событие' ? (swapping ? p : 1) : 0 }}></div>
        </div>

        <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {swapping ? layer(prev, prev.at, -1) : null}
          {layer(s, s.at, swapping ? 1 : 0)}
        </div>

        <div style={{ position: 'absolute', inset: 0, background: '#000',
          opacity: 0.07 * fg.press, pointerEvents: 'none' }}></div>

        {SCREENS.map((sc, idx) => {
          if (!sc.sheet) { return null; }
          const next = SCREENS[idx + 1];
          const o = clamp(enter(sc.at + 0.08, 0.5)(T) - (next ? lin(next.at - 0.34, next.at)(T) : 0), 0, 1);
          const curIdx = NAV.findIndex(x => x[0] === sc.nav);
          const nextIdx = next ? NAV.findIndex(x => x[0] === next.nav) : -1;
          const picked = next && T > next.at - 0.36 ? nextIdx : -1;
          return o > 0.01 ? <Sheet key={sc.at} kind={sc.sheet} o={o} cur={curIdx} pick={picked} /> : null;
        })}
      </div>

      <div style={{ position: 'absolute', left: fg.x - 26, top: fg.y - 26, width: 52, height: 52,
        opacity: shell }}>
        {fg.press > 0.02 ? (
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid ' + C.cta,
            opacity: fg.press * 0.85, transform: 'scale(' + (0.45 + (1 - fg.press) * 0.85) + ')' }}></div>
        ) : null}
        <div style={{ position: 'absolute', left: 11, top: 11, width: 30, height: 30, borderRadius: '50%',
          background: 'rgba(245,243,240,.16)', border: '1.5px solid rgba(245,243,240,.55)',
          transform: 'scale(' + (1 - 0.14 * fg.press) + ')' }}></div>
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
