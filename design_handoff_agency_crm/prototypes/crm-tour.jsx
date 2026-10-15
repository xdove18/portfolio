/* Обзор разделов CRM на desktop + обучение подсказками. */
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
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 0 1 4.6 1.3c0 1.7-2.1 2-2.1 3.4M12 17.2h.01',
  bell: 'M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5zM10.5 19a2 2 0 0 0 3 0',
  note: 'M6 4h12v16l-6-3.5L6 20z',
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
  { name: 'Марина Ковалёва', st: C.stW, stL: 'Жду звонка', sum: '10M', last: '2 дня назад', spark: [0, 1, 0, 1, 2, 0] },
  { name: 'Артём Дубов', st: C.stC, stL: 'Холодный', sum: '8M', last: 'неделю назад', spark: [0, 0, 1, 0, 0, 1] },
  { name: 'Ольга Панина', st: C.stA, stL: 'Активен', sum: '20M', last: 'сегодня', spark: [2, 1, 3, 1, 2, 3] },
  { name: 'Илья Ремизов', st: C.stR, stL: 'Отказал', sum: '11M', last: '5 дней назад', spark: [1, 0, 0, 0, 1, 0] },
  { name: 'Тимур Асхабов', st: C.stW, stL: 'Жду звонка', sum: '14M', last: 'вчера', spark: [1, 2, 1, 0, 2, 1] },
  { name: 'Ксения Гладко', st: C.stA, stL: 'Активен', sum: '24M', last: 'сегодня', spark: [2, 3, 1, 2, 3, 2] }
];

const EVENTS = [
  { kind: 'home', title: 'Показ ул. Толстого д.25 (8.5M)', time: '14:30', by: 'Василий Петров',
    day: 'Сегодня', sub: '14 сентября', open: true, notes: [
      { by: 'Василий Петров', at: '15:10',
        text: 'Квартира понравилась, но смущает первый этаж. Просил посмотреть похожие выше третьего.' },
      { by: 'Марина Грязнова', at: '17:40',
        text: 'Подобрала три варианта в этом же доме, отправлю завтра утром.' }
    ] },
  { kind: 'phone', title: 'Звонок (12 мин)', time: '10:05', by: 'Василий Петров',
    day: 'Сегодня', sub: '14 сентября', notes: [] },
  { kind: 'msg', title: 'Подборка из 4 объектов', time: '19:20', by: 'Марина Грязнова',
    day: 'Вчера', sub: '13 сентября', notes: [
      { by: 'Марина Грязнова', at: '19:22', text: 'Три варианта в том же доме выше третьего этажа.' }
    ] }
];

const SHOWINGS = [
  { time: '09:30', dur: '45 мин', addr: 'пр. Гагарина д.4', price: '11.2 млн', rooms: '2к, 58 м²',
    client: 'Тимур Асхабов', realtor: 'Василий Петров', result: 'Думает', note: 'Понравился вид, смутила цена' },
  { time: '11:00', dur: '1 ч', addr: 'ул. Мичурина д.71', price: '19 млн', rooms: '3к, 96 м²',
    client: 'Ольга Панина', realtor: 'Марина Грязнова', result: 'Запланирован', note: 'итог не записан', pend: true },
  { gap: 'Окно 2 ч 30 мин' },
  { time: '14:30', dur: '45 мин', addr: 'ул. Толстого д.25', price: '8.5 млн', rooms: '2к, 54 м²',
    client: 'Сергей Грин', realtor: 'Василий Петров', result: 'Запланирован', note: 'заметок пока нет' },
  { gap: 'Окно 1 ч 45 мин' },
  { time: '17:00', dur: '45 мин', addr: 'ул. Заречная д.8', price: '9.4 млн', rooms: '1к, 42 м²',
    client: 'Марина Ковалёва', realtor: 'Дмитрий Кутузов', result: 'Запланирован', note: 'заметок пока нет' }
];

const DEALS = [
  { name: 'Ольга Панина', addr: 'ул. Мичурина д.71 · М. Грязнова', sum: '19 млн', stage: 'Оформление',
    stageCol: '#7FA8D4', next: 'Подписать договор купли-продажи', due: 'просрочено на 1 дн', late: true,
    docs: '4 / 5', pct: 80, missing: 'нет справки из УК' },
  { name: 'Ксения Гладко', addr: 'ЖК Парковый, к.3 · М. Грязнова', sum: '23 млн', stage: 'Ипотека',
    stageCol: '#D2B36B', next: 'Ждём решение банка', due: 'через 2 дн', soon: true,
    docs: '5 / 5', pct: 100, missing: 'все собраны' },
  { name: 'Сергей Грин', addr: 'ул. Толстого д.25 · В. Петров', sum: '8.5 млн', stage: 'Подбор',
    stageCol: '#6FC2A0', next: 'Показать 3 варианта выше 3 этажа', due: 'через 4 дн',
    docs: '1 / 4', pct: 25, missing: 'нет паспорта и согласия супруги' },
  { name: 'Тимур Асхабов', addr: 'пр. Гагарина д.4 · В. Петров', sum: '11.2 млн', stage: 'Подбор',
    stageCol: '#6FC2A0', next: 'Согласовать скидку с собственником', due: 'сегодня', soon: true,
    docs: '2 / 4', pct: 50, missing: 'нет выписки ЕГРН' }
];

const FUNNEL = [
  ['Новые лиды', 9, 0], ['Первый контакт', 7, 1], ['Показы назначены', 5, 2],
  ['Выбирают объект', 4, 3], ['Оформление', 2, 0], ['Закрыто', 1, 0]
];

const TOUCH = [['Пн', 6], ['Вт', 11], ['Ср', 8], ['Чт', 4], ['Пт', 12], ['Сб', 9], ['Вс', 3]];
const TMAX = 12;
const LEADERS = [['Понравилось', 2, '#6FC2A0'], ['Думает', 1, '#D2B36B'], ['Отказ', 1, '#D4837A'], ['Без итога', 1, '#D2A65B']];
const REPORTS = [
  ['Активность риелторов', 'сентябрь', 'Кто сколько касался клиентов: звонки, показы, сообщения, встречи.'],
  ['Воронка по клиентам', 'сентябрь', 'Переходы между статусами и где клиенты чаще всего остывают.'],
  ['Показы и итоги', 'неделя', 'Каждый показ с результатом и комментарием риелтора.'],
  ['Клиенты без касания', 'сейчас', 'С кем не связывались больше 7 дней — список на обзвон.']
];
const TEAM = [
  ['Марина Грязнова', 'Старший риелтор', '9', '6', 90],
  ['Василий Петров', 'Риелтор', '8', '5', 80],
  ['Дмитрий Кутузов', 'Риелтор', '5', '2', 50],
  ['Анна Соболь', 'Стажёр', '4', '1', 40]
];

const COACH = [
  { at: 4.2, title: 'Начните с клиента', text: 'Клик по строке — справа откроется карточка и вся история касаний.',
    target: 'row', radius: 18, place: 'below-left' },
  { at: 6.4, title: 'Это клиент коллеги', text: 'Сначала напишите Марине — она расскажет, на чём остановились. Звонок остаётся, но вторым.',
    target: 'call', radius: 999, place: 'below-right' },
  { at: 8.6, title: 'Запишите касание', text: 'Сначала заметка — что сказал клиент. Статус меняйте, только если он правда изменился.',
    target: 'add', radius: 999, place: 'above-left' },
  { at: 10.8, title: 'Кто остыл', text: 'В фильтрах — срок последнего контакта. Так находят клиентов на обзвон.',
    target: 'filter', radius: 12, place: 'below-right' }
];
const COACH_END = 13.1;

const Tip = ({ idx, place }) => {
  const c = COACH[idx];
  const pos = place === 'below-right' ? { top: 'calc(100% + 18px)', right: -4 }
    : place === 'above-left' ? { bottom: 'calc(100% + 18px)', left: -4 }
      : { top: 'calc(100% + 18px)', left: -4 };
  return (
    <div style={Object.assign({ position: 'absolute', width: 274, padding: 14, borderRadius: 14,
      background: C.panel, boxShadow: '0 22px 54px rgba(0,0,0,.6)' }, pos)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
          color: C.cta }}>{idx + 1} / {COACH.length}</span>
        <span style={{ width: 22, height: 22, borderRadius: 999, background: C.bg2, color: C.tx3,
          fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.tx1, lineHeight: 1.35, marginTop: 8 }}>{c.title}</div>
      <div style={{ fontSize: 12, lineHeight: 1.55, color: C.tx2, marginTop: 4 }}>{c.text}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 12 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {COACH.map((x, i) => (
            <span key={x.title} style={{ width: i === idx ? 22 : 7, height: 7, borderRadius: 999,
              background: i === idx ? C.cta : C.bg3 }}></span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ height: 28, padding: '0 12px', borderRadius: 999, background: C.bg2,
            color: C.tx1, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Назад</span>
          <span style={{ height: 28, padding: '0 14px', borderRadius: 999, background: C.cta,
            color: C.pillTx, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Далее</span>
        </div>
      </div>
    </div>
  );
};

const Spot = ({ reg, name }) => (
  <div ref={el => reg(name, el)} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}></div>
);

const Overlay = ({ rect, o, idx }) => {
  if (!rect || o <= 0.01) { return null; }
  const c = COACH[idx];
  const pad = 7;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: rect.x - pad, top: rect.y - pad,
        width: rect.w + pad * 2, height: rect.h + pad * 2, borderRadius: c.radius,
        border: '2px solid ' + C.cta, opacity: o,
        boxShadow: '0 0 0 9999px rgba(6,6,5,' + (0.66 * o).toFixed(2) + ')' }}>
        <Tip idx={idx} place={c.place} />
      </div>
    </div>
  );
};

const NAV = [['Клиенты', '26', 0], ['Показы', '14', 1], ['Сделки', '4', 2], ['Дашборд', '', 3], ['Отчёты', '', 4]];
const PAGE_AT = [0, 13.5, 17.5, 21.5, 26.5];

function pageIndex(T) {
  let idx = 0;
  PAGE_AT.forEach((t, i) => { if (T >= t) { idx = i; } });
  return idx;
}

const Card = ({ children, style }) => (
  <div style={Object.assign({ borderRadius: 18, background: C.panel, padding: 18 }, style)}>{children}</div>
);

const Metric = ({ label, value, unit }) => (
  <div style={{ flex: 1, borderRadius: 16, padding: '14px 16px', background: C.panel }}>
    <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.tx3 }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
      <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 500, color: C.tx1 }}>{value}</span>
      <span style={{ fontSize: 11, color: C.tx3 }}>{unit}</span>
    </div>
  </div>
);

const SectionHead = ({ title, sub, action }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
    <div>
      <div style={{ fontSize: 26, fontWeight: 600, color: C.tx1, letterSpacing: '-.02em' }}>{title}</div>
      <div style={{ fontSize: 13, color: C.tx2, marginTop: 4 }}>{sub}</div>
    </div>
    {action ? (
      <div style={{ height: 36, padding: '0 16px', borderRadius: 999, background: C.cta, color: C.pillTx,
        fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>{action}</div>
    ) : null}
  </div>
);

function ClientPage({ T, rise, spot }) {
  const r = rise || (() => ({}));
  const sp = spot || (() => {});
  const days = [];
  EVENTS.forEach(e => {
    let g = days.find(x => x.day === e.day);
    if (!g) { days.push(g = { day: e.day, sub: e.sub, items: [] }); }
    g.items.push(e);
  });
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={Object.assign({ position: 'absolute', left: 28, top: 20, right: 28, display: 'flex', alignItems: 'center',
        gap: 14, padding: '12px 16px', borderRadius: 14,
        background: 'color-mix(in srgb, ' + C.phone + ' 14%, ' + C.panel + ')' }, r(0.95))}>
        <div style={{ width: 32, height: 32, flex: '0 0 auto', borderRadius: 10,
          background: 'color-mix(in srgb, ' + C.phone + ' 30%, ' + C.panel + ')', color: C.tx1, fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>МГ</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.tx1, lineHeight: 1.4 }}>
            Ведёт Марина Грязнова · последнее касание сегодня в 17:40 · показ на Толстого д.25
          </div>
          <div style={{ fontSize: 12, color: C.tx2, marginTop: 2 }}>
            Клиент в работе у коллеги. Прежде чем звонить, уточните у неё — клиенту не придётся рассказывать всё заново.
          </div>
        </div>
      </div>

      <div style={Object.assign({ position: 'absolute', left: 28, top: 98, right: 28, display: 'flex', alignItems: 'flex-start', gap: 16 }, r(1.1))}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.bg2, color: C.tx1,
          fontSize: 17, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>СГ</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 600, color: C.tx1, letterSpacing: '-.02em' }}>Сергей Грин</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: C.stA, fontWeight: 500 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.stA }}></span>Активен
            </span>
            <span style={{ fontSize: 12, color: C.tx3 }}>поставила Марина, вчера · создан 10 сентября</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px 14px', marginTop: 12 }}>
            {[['Телефон', '+7 (912) 555-0172', true], ['Бюджет', '10–15 млн', true], ['Комнаты', '2–3к', false],
              ['Районы', 'юго-запад, центр', false], ['Срочность', 'до конца месяца', false]].map(([l, v, mono]) => (
              <span key={l} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 12, color: C.tx3 }}>{l}</span>
                <span style={{ fontSize: 13, color: C.tx1, fontFamily: mono ? MONO : 'inherit' }}>{v}</span>
              </span>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
          <Spot reg={sp} name="call" />
          <div style={{ height: 36, padding: '0 16px', borderRadius: 999, background: C.cta, color: C.pillTx,
            fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon kind="msg" size={14} color={C.pillTx} /> Написать Марине
          </div>
          <div style={{ height: 36, padding: '0 16px', borderRadius: 999, background: C.bg2, color: C.tx1,
            fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon kind="phone" size={14} color={C.tx1} /> Позвонить
          </div>
        </div>
      </div>

      <div style={Object.assign({ position: 'absolute', left: 28, top: 222, right: 28, bottom: 86, borderRadius: 18,
        background: C.panel, overflow: 'hidden' }, r(1.5))}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid ' + C.hair, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: C.tx3 }}>
              История взаимодействий
            </div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.cta }}>5 событий</div>
            {[['12', 'дней в работе']].map(([v, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.tx2 }}>{v}</span>
                <span style={{ fontSize: 11, color: C.tx3 }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 26 }}>
              {[1, 0, 2, 1, 0, 3, 1, 2, 0, 1, 4, 2].map((n, i) => (
                <span key={i} style={{ width: 4, borderRadius: 2, height: Math.max(3, n * 6),
                  background: n === 0 ? C.bg3 : C.cta, opacity: n === 0 ? 1 : 0.45 + n * 0.13 }}></span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: C.tx3 }}>14 дней</div>
            <div style={{ display: 'flex', gap: 4, padding: 3, borderRadius: 999, background: C.bg2 }}>
              {['Все', 'Показы', 'Звонки', 'Сообщения'].map((t, i) => (
                <span key={t} style={{ height: 26, padding: '0 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  display: 'flex', alignItems: 'center',
                  background: i === 0 ? C.cta : 'transparent', color: i === 0 ? C.pillTx : C.tx2 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 18, right: 18, top: 74, bottom: 16, display: 'flex',
          flexDirection: 'column', gap: 12 }}>
          {days.map((g, gi) => {
            const items = g.items;
            const day = g.day;
            return (
              <div key={day} style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 96, flex: '0 0 96px', paddingTop: 12, textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.tx1 }}>{day}</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: C.tx3, marginTop: 2 }}>{items[0].sub}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingLeft: 18, borderLeft: '1px solid ' + C.hair }}>
                  {items.map((e, i) => (
                    <div key={e.title} style={{ position: 'relative', marginBottom: 10, padding: '12px 14px',
                      borderRadius: 14, background: C.bg2 }}>
                      <span style={{ position: 'absolute', left: -25, top: 22, width: 7, height: 7,
                        borderRadius: '50%', background: C[e.kind] }}></span>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ width: 24, height: 24, flex: '0 0 auto', marginTop: 1, display: 'flex',
                          alignItems: 'center', justifyContent: 'center' }}>
                          <Icon kind={e.kind} size={16} color={C[e.kind]} w={1.7} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.tx1, lineHeight: 1.4 }}>{e.title}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span style={{ fontFamily: MONO, fontSize: 11, color: C.tx3 }}>{e.time}</span>
                            <span style={{ fontSize: 12, color: C.tx3 }}>{e.by}</span>
                            {e.notes.length ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.tx3 }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M6 4h12v16l-6-3.5L6 20z"></path>
                                </svg>
                                {e.notes.length === 1 ? '1 заметка' : e.notes.length + ' заметки'}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: C.tx3, marginTop: 2 }}>{e.open ? '⌃' : '⌄'}</span>
                      </div>

                      {e.notes.length ? (
                        <div style={{ marginTop: 12, marginLeft: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {e.notes.map(nt => (
                            <div key={nt.at}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 20, height: 20, borderRadius: 6, background: C.bg3, color: C.tx2,
                                  fontFamily: MONO, fontSize: 9, display: 'flex', alignItems: 'center',
                                  justifyContent: 'center' }}>
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
                      ) : (
                        <div style={{ marginTop: 10, marginLeft: 36, fontSize: 12, fontWeight: 600, color: C.cta }}>
                          + Добавить заметку
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={Object.assign({ position: 'absolute', left: 28, right: 28, bottom: 18 }, r(2.0))}>
        {T > 11.4 ? (
          <div style={{ borderRadius: 16, background: C.bg2, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.tx1 }}>Новое касание</span>
                <span style={{ height: 30, width: 150, padding: '0 12px', borderRadius: 999, background: C.panel,
                  fontFamily: MONO, fontSize: 12, color: C.tx1, display: 'flex', alignItems: 'center' }}>14 сент, 14:30</span>
              </div>
              <span style={{ width: 28, height: 28, borderRadius: 999, color: C.tx3, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.tx1 }}>Как прошёл показ</span>
              <span style={{ fontSize: 12, color: C.stR }}>*</span>
              <span style={{ fontSize: 11, color: C.tx3 }}>обязательно — по ней коллеги поймут, что предлагать дальше</span>
            </div>
            <div style={{ height: 64, marginTop: 8, padding: '12px 14px', borderRadius: 12, background: C.panel,
              fontSize: 13, lineHeight: 1.6, color: C.tx1 }}>
              Квартира понравилась, смущает первый этаж
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {['Показ квартиры', 'Звонок', 'WhatsApp сообщение', 'Встреча в офисе', 'Email', 'Другое'].map((t, i) => (
                <span key={t} style={{ height: 34, padding: '0 14px', borderRadius: 999, fontSize: 12,
                  fontWeight: i === 0 ? 600 : 500, display: 'flex', alignItems: 'center',
                  background: i === 0 ? C.cta : C.panel, color: i === 0 ? C.pillTx : C.tx2 }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <span style={{ flex: '1 1 220px', height: 34, padding: '0 14px', borderRadius: 999, background: C.panel,
                fontSize: 13, color: C.tx1, display: 'flex', alignItems: 'center' }}>ул. Толстого д.25</span>
              {['ул. Мичурина д.71', 'ЖК Парковый, к.3'].map(a => (
                <span key={a} style={{ height: 34, padding: '0 13px', borderRadius: 999, background: C.panel,
                  fontSize: 12, color: C.tx2, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{a}</span>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: C.tx3 }}>
              Статус сейчас «Активен» — меняйте, только если что-то изменилось
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {[['Активен', C.stA], ['Жду звонка', C.stW], ['Холодный', C.stC], ['Отказал', C.stR]].map(([l, col]) => (
                  <span key={l} style={{ height: 32, padding: '0 13px', borderRadius: 999, display: 'flex',
                    alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 500, background: C.panel, color: C.tx2 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: col }}></span>{l}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ height: 36, padding: '0 16px', borderRadius: 999, background: C.panel, color: C.tx1,
                  fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Отменить</span>
                <span style={{ height: 36, padding: '0 20px', borderRadius: 999, background: C.cta, color: C.pillTx,
                  fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Сохранить</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', flex: 1, height: 44, borderRadius: 999, background: C.cta, color: C.pillTx,
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              + Добавить событие
              <Spot reg={sp} name="add" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShowingsPage({ r }) {
  const cols = '58px 3px minmax(0,1fr) 150px 120px 118px';
  const IconBtn = ({ kind }) => (
    <span style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: C.tx3 }}>
      <Icon kind={kind} size={15} color={C.tx3} />
    </span>
  );
  return (
    <div style={{ position: 'absolute', left: 28, top: 24, right: 28, bottom: 24, display: 'flex',
      flexDirection: 'column', gap: 14 }}>
      <div style={Object.assign({ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }, r(0.15))}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.tx1, letterSpacing: '-.02em' }}>Показы</div>
          <div style={{ fontSize: 13, color: C.tx2, marginTop: 4 }}>
            14 сентября, вторник · 4 показа · 1 без итога · 2 впереди · 3 ч 15 мин в разъездах
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 4, padding: 3, borderRadius: 999, background: C.bg2 }}>
            {['Сегодня', 'Завтра', 'Неделя'].map((t, i) => (
              <span key={t} style={{ height: 30, padding: '0 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center',
                background: i === 0 ? C.cta : 'transparent', color: i === 0 ? C.pillTx : C.tx2 }}>{t}</span>
            ))}
          </div>
          <div style={{ height: 36, padding: '0 16px', borderRadius: 999, background: C.cta, color: C.pillTx,
            fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Записать показ</div>
        </div>
      </div>

      <div style={Object.assign({ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
        borderRadius: 14, background: C.bg2 }, r(0.36))}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', flex: '0 0 auto', background: C.stW }}></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.tx1 }}>Показы без итога: 1</span>
          <span style={{ fontSize: 12, color: C.tx2, marginLeft: 8 }}>ул. Мичурина д.71 · 11:00</span>
        </div>
        <span style={{ height: 30, padding: '0 13px', borderRadius: 999, background: C.bg3, color: C.tx1,
          fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Итог · Ольга Панина</span>
      </div>

      <div style={Object.assign({ borderRadius: 18, background: C.panel, overflow: 'hidden' }, r(0.56))}>
        {SHOWINGS.map((s, i) => {
          if (s.gap) {
            return (
              <div key={'g' + i} style={Object.assign({ display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 18px 9px 76px' }, r(0.72 + i * 0.08))}>
                <span style={{ flex: 1, height: 1, background: C.hair }}></span>
                <span style={{ fontSize: 11, color: C.tx3, whiteSpace: 'nowrap' }}>{s.gap} · можно вписать показ</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.cta, whiteSpace: 'nowrap' }}>+ Вписать</span>
                <span style={{ flex: 1, height: 1, background: C.hair }}></span>
              </div>
            );
          }
          const col = s.result === 'Думает' ? C.msg : s.result === 'Понравилось' ? C.home
            : s.result === 'Отказ' ? C.stR : C.phone;
          return (
            <div key={s.time} style={Object.assign({ display: 'grid', gridTemplateColumns: cols, gap: 14,
              alignItems: 'center', padding: '11px 18px', borderBottom: '1px solid ' + C.hair }, r(0.72 + i * 0.08))}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 500, color: C.tx1, lineHeight: 1 }}>{s.time}</div>
                <div style={{ fontSize: 10, color: C.tx3, marginTop: 4 }}>{s.dur}</div>
              </div>
              <span style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: col,
                opacity: s.pend ? 0.55 : 1 }}></span>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: C.tx1 }}>{s.addr}</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx2 }}>{s.price}</span>
                  <span style={{ fontSize: 11, color: C.tx3 }}>{s.rooms}</span>
                </div>
                <div style={{ fontSize: 12, color: C.tx3, marginTop: 4 }}>{s.note}</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, color: C.tx1 }}>{s.client}</div>
                <div style={{ fontSize: 11, color: C.tx3, marginTop: 3 }}>{s.realtor}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: col }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: col }}></span>{s.result}
              </div>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <IconBtn kind="phone" />
                <IconBtn kind="note" />
                <span style={{ height: 28, padding: '0 11px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  display: 'flex', alignItems: 'center',
                  background: s.pend ? C.cta : C.bg3, color: s.pend ? C.pillTx : C.tx1 }}>
                  {s.pend ? 'Итог' : 'Статус'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DealsPage({ r }) {
  const cols = 'minmax(0,1.25fr) 116px minmax(0,1.3fr) 150px 126px 118px';
  const IconBtn = ({ kind }) => (
    <span style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center',
      justifyContent: 'center' }}>
      <Icon kind={kind} size={15} color={C.tx3} />
    </span>
  );
  return (
    <div style={{ position: 'absolute', left: 28, top: 24, right: 28, bottom: 24, display: 'flex',
      flexDirection: 'column', gap: 14 }}>
      <div style={Object.assign({ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }, r(0.15))}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.tx1, letterSpacing: '-.02em' }}>Сделки</div>
          <div style={{ fontSize: 13, color: C.tx2, marginTop: 4 }}>Ближайший шаг и документы по каждой сделке</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {[['4', 'в работе'], ['58 млн', 'сумма'], ['1', 'просрочены'], ['3', 'ждут документы']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: MONO, fontSize: 17, fontWeight: 500, color: C.tx1, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: C.tx3, marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={Object.assign({ borderRadius: 18, background: C.panel, overflow: 'hidden' }, r(0.42))}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 14, padding: '11px 18px',
          borderBottom: '1px solid ' + C.hair, fontFamily: MONO, fontSize: 10, letterSpacing: '.14em',
          textTransform: 'uppercase', color: C.tx3 }}>
          <div>Клиент и объект</div><div>Этап</div><div>Ближайший шаг</div><div>Документы</div><div>Срок</div><div></div>
        </div>
        {DEALS.map((d, i) => (
          <div key={d.name} style={Object.assign({ display: 'grid', gridTemplateColumns: cols, gap: 14,
            alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid ' + C.hair }, r(0.6 + i * 0.1))}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: C.tx1 }}>{d.name}</span>
                <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx2 }}>{d.sum}</span>
              </div>
              <div style={{ fontSize: 12, color: C.tx3, marginTop: 4, whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.addr}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 500, color: d.stageCol }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: d.stageCol }}></span>{d.stage}
            </div>
            <div style={{ fontSize: 12, color: d.late ? C.tx1 : C.tx2 }}>{d.next}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: d.pct === 100 ? C.home : C.tx2 }}>{d.docs}</span>
                <span style={{ fontSize: 11, color: C.tx3, whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis' }}>{d.missing}</span>
              </div>
              <div style={{ height: 4, borderRadius: 999, background: C.bg3, marginTop: 7, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: d.pct + '%', borderRadius: 999,
                  background: d.pct === 100 ? C.home : C.cta }}></div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: d.late || d.soon ? 600 : 400,
              color: d.late ? C.stR : d.soon ? C.stW : C.tx2 }}>{d.due}</div>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
              <IconBtn kind="phone" />
              <IconBtn kind="note" />
              <span style={{ height: 28, padding: '0 11px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center',
                background: d.late ? C.cta : C.bg3, color: d.late ? C.pillTx : C.tx1 }}>Этап</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashPage({ T, start, r }) {
  const grow = lin(start + 0.3, start + 1.6)(T);
  const pts = TOUCH.map(([, v], i) => ({
    x: Math.round((i + 0.5) * (660 / TOUCH.length)),
    y: Math.round(175 - (v / TMAX) * 155 * grow)
  }));
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p.x + ',' + p.y).join(' ');
  const area = 'M' + pts[0].x + ',175 ' + pts.map(p => 'L' + p.x + ',' + p.y).join(' ') + ' L' + pts[pts.length - 1].x + ',175 Z';
  const active = 4;
  return (
    <div style={{ position: 'absolute', left: 28, top: 24, right: 28, bottom: 24, display: 'flex',
      flexDirection: 'column', gap: 16 }}>
      <div style={r(0.15)}>
        <SectionHead title="Дашборд" sub="Сентябрь 2026 · ваши клиенты" />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {[['Клиентов', '26', '+4'], ['Показов', '14', '+3'], ['Сделок', '4', '+1'], ['Без касания 7 дней', '5', '−2']].map(([l, v, d], i) => (
          <div key={l} style={Object.assign({ flex: 1, borderRadius: 16, padding: 16, background: C.panel },
            r(0.38 + i * 0.1))}>
            <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.tx3 }}>{l}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 500, color: C.tx1 }}>{v}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: d.indexOf('−') === 0 ? C.home : C.cta }}>{d}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={Object.assign({ borderRadius: 18, padding: 18, background: C.panel }, r(0.78))}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: C.tx3 }}>
            Воронка по клиентам
          </div>
          <div style={{ fontSize: 12, color: C.tx2 }}>оранжевым — где клиенты стоят дольше недели</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
          {FUNNEL.map(([label, n, stuck], i) => {
            const prev = i ? FUNNEL[i - 1][1] : n;
            const drop = prev - n;
            const p = lin(start + 0.5 + i * 0.09, start + 1.1 + i * 0.09)(T);
            return (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '150px minmax(0,1fr) 44px 150px',
                gap: 14, alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: C.tx1 }}>{label}</div>
                <div style={{ height: 34, borderRadius: 8, minWidth: 6,
                  width: Math.max(6, Math.round(n / FUNNEL[0][1] * 100 * p)) + '%',
                  background: stuck > 1 ? C.stW : C.cta, opacity: stuck > 1 ? 1 : 0.82 - i * 0.07 }}></div>
                <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 500, color: C.tx1, textAlign: 'right' }}>{n}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx3, width: 22 }}>{i && drop ? '−' + drop : ''}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                    color: stuck > 1 ? C.stW : C.tx3 }}>
                    {stuck ? (stuck === 1 ? '1 застрял' : stuck + ' застряли') + ' > 7 дней' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, flex: 1 }}>
        <Card style={r(0.85)}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: C.tx3 }}>
                Касания клиентов по дням
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 500, color: C.tx1 }}>
                  {Math.round(53 * grow)}
                </span>
                <span style={{ fontSize: 12, color: C.tx2 }}>касаний за неделю</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 150 }}>
              {[['Показ', C.home, '20'], ['Звонок', C.phone, '19'], ['Сообщение', C.msg, '11'], ['Встреча', C.meet, '3']].map(([l, col, v]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: col }}></span>
                  <span style={{ fontSize: 11, color: C.tx2, flex: 1 }}>{l}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: C.tx3 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 660 190" preserveAspectRatio="none"
            style={{ width: '100%', height: 190, display: 'block', overflow: 'visible', marginTop: 20 }}>
            <defs>
              <linearGradient id="tourFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.cta} stopOpacity="0.28"></stop>
                <stop offset="100%" stopColor={C.cta} stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map(i => (
              <line key={i} x1="0" y1={10 + i * 55} x2="660" y2={10 + i * 55} stroke={C.hair} strokeWidth="1"></line>
            ))}
            <path d={area} fill="url(#tourFill)"></path>
            <path d={line} fill="none" stroke={C.cta} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={i === active ? 6 : 4} fill={C.panel} stroke={C.cta} strokeWidth="2"></circle>
            ))}
          </svg>
          <div style={{ display: 'flex', marginTop: 10 }}>
            {TOUCH.map(([label, v], i) => (
              <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: MONO, fontSize: 13, color: i === active ? C.cta : C.tx2,
                  fontWeight: i === active ? 600 : 400 }}>{v}</div>
                <div style={{ fontSize: 11, marginTop: 2, color: i === active ? C.tx1 : C.tx3 }}>{label}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={r(1.05)}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: C.tx3 }}>
            Мои показы за неделю — итоги
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
            {LEADERS.map(([name, n, col]) => (
              <div key={name}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: C.tx1 }}>{name}</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: C.tx2 }}>{n === 1 ? '1 показ' : n < 5 ? n + ' показа' : n + ' показов'}</span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: C.bg2, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: (n / 2 * 100 * grow) + '%', borderRadius: 999, background: col }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ReportsPage({ r }) {
  return (
    <div style={{ position: 'absolute', left: 28, top: 24, right: 28, bottom: 24, display: 'flex',
      flexDirection: 'column', gap: 16 }}>
      <div style={r(0.15)}>
        <SectionHead title="Отчёты" sub="Выгрузка в XLSX или ссылкой для руководителя" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
        {REPORTS.map(([title, period, desc], i) => (
          <div key={title} style={Object.assign({ borderRadius: 18, padding: 18, background: C.panel,
            display: 'flex', flexDirection: 'column', gap: 10 }, r(0.42 + i * 0.13))}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.tx1 }}>{title}</div>
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.tx3 }}>{period}</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: C.tx2 }}>{desc}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
              <div style={{ height: 32, padding: '0 14px', borderRadius: 999, background: C.cta, color: C.pillTx,
                fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Скачать</div>
              <div style={{ height: 32, padding: '0 14px', borderRadius: 999, background: C.bg3, color: C.tx1,
                fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Ссылка</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamPage({ T, start, r }) {
  const grow = lin(start + 0.3, start + 1.4)(T);
  return (
    <div style={{ position: 'absolute', left: 28, top: 24, right: 28, bottom: 24, display: 'flex',
      flexDirection: 'column', gap: 16 }}>
      <div style={r(0.15)}>
        <SectionHead title="Команда" sub="6 человек · нагрузка распределяется по числу активных клиентов" />
      </div>
      <div style={Object.assign({ borderRadius: 18, background: C.panel, overflow: 'hidden' }, r(0.4))}>
        {TEAM.map(([name, role, clients, shows, pct], i) => (
          <div key={name} style={Object.assign({ display: 'grid', gridTemplateColumns: '1fr 110px 110px 200px',
            gap: 16, alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid ' + C.hair },
            r(0.58 + i * 0.1))}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.bg2, color: C.tx2,
                fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {name.split(' ').map(s => s[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.tx1 }}>{name}</div>
                <div style={{ fontSize: 12, color: C.tx3, marginTop: 2 }}>{role}</div>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 16, color: C.tx1 }}>{clients}</div>
              <div style={{ fontSize: 11, color: C.tx3 }}>клиентов</div>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 16, color: C.tx1 }}>{shows}</div>
              <div style={{ fontSize: 11, color: C.tx3 }}>показов</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: 11, color: C.tx3 }}>
                <span>Нагрузка</span><span>{pct}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: C.bg2, marginTop: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: (pct * grow) + '%', borderRadius: 999,
                  background: pct > 85 ? C.msg : C.cta }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Piece() {
  const { T, authoredTotal } = useComposition();
  const fade = Math.min(enter(0.1, 0.7)(T), 1 - lin(authoredTotal - 0.7, authoredTotal)(T));
  const shell = enter(0.15, 0.8)(T);
  const page = pageIndex(T);
  const pageIn = enter(PAGE_AT[page] + 0.05, 0.45)(T);
  const listOn = page === 0;

  const rise = at => {
    const p = enter(at, 0.55)(T);
    return { opacity: p, transform: 'translateY(' + (1 - p) * 26 + 'px) scale(' + (0.985 + 0.015 * p) + ')' };
  };
  const pageRise = d => rise(PAGE_AT[page] + d);

  let active = -1;
  let activeO = 0;
  COACH.forEach((c, i) => {
    const next = COACH[i + 1] ? COACH[i + 1].at : COACH_END;
    const o = clamp(enter(c.at, 0.4)(T) - lin(next - 0.32, next)(T), 0, 1);
    if (o > 0.01) { active = i; activeO = o; }
  });
  const winRef = React.useRef(null);
  const nodes = React.useRef({});
  const [rects, setRects] = React.useState({});
  const regSpot = (name, el) => { nodes.current[name] = el; };

  React.useLayoutEffect(() => {
    const host = winRef.current;
    if (!host) { return; }
    const hb = host.getBoundingClientRect();
    const sx = hb.width ? 1520 / hb.width : 1;
    const next = {};
    Object.keys(nodes.current).forEach(k => {
      const el = nodes.current[k];
      if (!el || !el.isConnected) { return; }
      const r = el.getBoundingClientRect();
      next[k] = { x: Math.round((r.left - hb.left) * sx), y: Math.round((r.top - hb.top) * sx),
        w: Math.round(r.width * sx), h: Math.round(r.height * sx) };
    });
    const same = Object.keys(next).length === Object.keys(rects).length && Object.keys(next).every(k => {
      const a = next[k]; const b = rects[k];
      return b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
    });
    if (!same) { setRects(next); }
  });

  const activeTarget = active >= 0 ? COACH[active].target : null;

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, opacity: fade,
      fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div ref={winRef} style={{ position: 'absolute', left: 40, top: 40, width: 1520, height: 820, borderRadius: 22,
        background: C.bg, overflow: 'hidden', opacity: shell,
        transform: 'scale(' + (0.985 + 0.015 * shell) + ')',
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
                <span style={{ fontFamily: MONO, fontSize: 15, color: C.tx1 }}>26</span>
                <span style={{ fontSize: 12, color: C.tx3 }}>клиентов</span>
              </div>
              <div style={{ width: 1, height: 14, background: C.hair }}></div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: MONO, fontSize: 15, color: C.cta }}>14</span>
                <span style={{ fontSize: 12, color: C.tx3 }}>показов за неделю</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              <div style={{ position: 'relative', width: 34, height: 34, borderRadius: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'center' }}>
                <Spot reg={regSpot} name="filter" />
                <Icon kind="filter" size={15} color={C.tx3} />
              </div>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon kind="help" size={15} color={C.tx3} />
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

        <div style={Object.assign({ position: 'absolute', left: 0, top: 58, bottom: 0, width: 212,
          borderRight: '1px solid ' + C.hair, padding: '16px 12px' }, rise(0.45))}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase',
            color: C.tx3, padding: '4px 10px 8px 10px' }}>Меню</div>
          {NAV.map(([label, count, idx]) => {
            const on = idx === page;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38, padding: '0 10px',
                borderRadius: 10, background: on ? C.bg2 : 'transparent',
                color: on ? C.tx1 : C.tx2, fontSize: 13, fontWeight: on ? 600 : 400 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: on ? C.cta : C.bd2 }}></span>
                <span style={{ flex: 1 }}>{label}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.tx3 }}>{count}</span>
              </div>
            );
          })}
        </div>

        {listOn ? (
          <div style={{ position: 'absolute', left: 212, top: 58, bottom: 0, width: 296,
            borderRight: '1px solid ' + C.hair }}>
            <div style={{ position: 'absolute', left: 14, top: 16, fontSize: 20, fontWeight: 600, color: C.tx1,
              letterSpacing: '-.01em' }}>Клиенты</div>
            <div style={{ position: 'absolute', left: 14, top: 54, width: 268, height: 38, borderRadius: 999,
              background: C.bg2, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px' }}>
              <Icon kind="search" size={14} color={C.tx3} />
              <span style={{ fontSize: 13, color: C.tx3 }}>Поиск по имени, телефону...</span>
            </div>
            {CLIENTS.map((c, i) => (
              <div key={c.name} style={Object.assign({ position: 'absolute', left: 14, top: 106 + i * 74, width: 268, height: 68,
                borderRadius: 14, background: i === 0 ? C.bg3 : 'transparent',
                display: 'flex', alignItems: 'center', gap: 10, padding: 12 }, rise(0.75 + i * 0.07))}>
                {i === 0 ? <Spot reg={regSpot} name="row" /> : null}
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.bg2, color: C.tx1,
                  fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {c.name.split(' ').map(s => s[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.tx1 }}>{c.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.st }}></span>
                    <span style={{ fontSize: 12, color: c.st, fontWeight: 500 }}>{c.stL}</span>
                    <span style={{ fontSize: 11, color: C.tx3 }}>· {c.last}</span>
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
        ) : null}

        <div style={{ position: 'absolute', left: listOn ? 508 : 212, top: 58, right: 0, bottom: 0,
          opacity: pageIn, transform: 'translateY(' + (1 - pageIn) * 10 + 'px)' }}>
          {page === 0 ? <ClientPage T={T} rise={rise} spot={regSpot} /> : null}
          {page === 1 ? <ShowingsPage r={pageRise} /> : null}
          {page === 2 ? <DealsPage r={pageRise} /> : null}
          {page === 3 ? <DashPage T={T} start={PAGE_AT[3]} r={pageRise} /> : null}
          {page === 4 ? <ReportsPage r={pageRise} /> : null}
        </div>

        <Overlay rect={activeTarget ? rects[activeTarget] : null} o={activeO} idx={active < 0 ? 0 : active} />

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
