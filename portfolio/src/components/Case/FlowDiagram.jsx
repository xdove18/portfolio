import ZoomableFigure from "./ZoomableFigure";
import s from "./Case.module.css";

/* ============================================================
   СХЕМА ПУТИ ПОЛЬЗОВАТЕЛЯ
   ============================================================
   Рисует блок-схему из описания в src/data/projects.js.
   Схема нарисована кодом, а не картинкой: она остаётся чёткой
   на любом экране и подхватывает цвета сайта.

   Как описать схему:

   {
     title: "Было — 5 шагов",
     nodes: [
       { id: "start", type: "terminator", label: "Вход", x: 10, y: 10, w: 210, h: 52 },
       { id: "cart",  type: "step", label: "Корзина", x: 10, y: 92, w: 210, h: 56 },
       { id: "d1",    type: "drop", label: "Отвал −22%", x: 290, y: 270, w: 170, h: 52 },
     ],
     edges: [
       { from: "start", to: "cart" },
       { from: "step1", to: "d1", dashed: true },
       { from: "dec", to: "ok", label: "да" },
     ],
   }

   Типы блоков:
   terminator — начало и конец пути (скруглённая капсула)
   step       — обычный шаг
   accent     — шаг, который появился в новой версии
   info       — пояснительный блок
   outside    — то, что вне зоны дизайна (пунктирная рамка)
   decision   — развилка «да/нет» (ромб)
   drop       — отвал пользователей (красный)

   Перенос строки внутри подписи — символ \n
   ============================================================ */

export default function FlowDiagram({ diagram, accent }) {
  if (!diagram || !diagram.nodes) return null;

  // Размер холста считаем по самому дальнему блоку
  const width = Math.max(...diagram.nodes.map((n) => n.x + n.w)) + 12;
  const height = Math.max(...diagram.nodes.map((n) => n.y + n.h)) + 12;

  // Быстрый поиск блока по имени — нужен при рисовании связей
  const byId = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]));

  return (
    <ZoomableFigure title={diagram.title} note={diagram.note}>
      <div className={s.diagramScroll}>
        <svg
          className={s.diagramSvg}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={diagram.title || "Схема пути пользователя"}
        >
          <defs>
            {/* Наконечник стрелки. Один на всю схему. */}
            <marker
              id={`arrow-${diagram.id}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" fill="var(--text-muted)" />
            </marker>
          </defs>

          {/* Сначала линии, потом блоки — чтобы стрелки уходили
              под блоки, а не лежали поверх них */}
          {diagram.edges.map((edge, i) => (
            <Edge
              key={i}
              edge={edge}
              from={byId[edge.from]}
              to={byId[edge.to]}
              markerId={`arrow-${diagram.id}`}
            />
          ))}

          {diagram.nodes.map((node) => (
            <Node key={node.id} node={node} accent={accent} />
          ))}
        </svg>
      </div>
    </ZoomableFigure>
  );
}

/* ------------------------------------------------------------
   ОДИН БЛОК СХЕМЫ
   ------------------------------------------------------------ */
function Node({ node, accent }) {
  const { type = "step", x, y, w, h, label } = node;
  const cx = x + w / 2;
  const cy = y + h / 2;

  return (
    <g>
      {type === "decision" ? (
        /* Ромб: четыре точки — верх, право, низ, лево */
        <polygon
          className={s.nodeDecision}
          points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`}
        />
      ) : (
        <rect
          className={[
            s.nodeBox,
            type === "terminator" ? s.nodeTerminator : "",
            type === "accent" ? s.nodeAccent : "",
            type === "info" ? s.nodeInfo : "",
            type === "outside" ? s.nodeOutside : "",
            type === "drop" ? s.nodeDrop : "",
          ].join(" ")}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={type === "terminator" ? h / 2 : 10}
          style={type === "accent" ? { stroke: accent } : undefined}
        />
      )}

      <Label
        text={label}
        cx={cx}
        cy={cy}
        className={[
          s.nodeText,
          type === "terminator" ? s.nodeTextLight : "",
          type === "drop" ? s.nodeTextDrop : "",
        ].join(" ")}
      />
    </g>
  );
}

/* Подпись внутри блока. Переносы строк заданы символом \n */
function Label({ text, cx, cy, className }) {
  const lines = String(text).split("\n");
  const lineHeight = 15;
  // Сдвигаем весь текст вверх на половину его высоты,
  // чтобы он оказался по центру блока
  const startY = cy - ((lines.length - 1) * lineHeight) / 2;

  return (
    <text className={className} x={cx} y={startY} textAnchor="middle">
      {lines.map((line, i) => (
        <tspan key={i} x={cx} dy={i === 0 ? 4 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

/* ------------------------------------------------------------
   ЛИНИЯ МЕЖДУ БЛОКАМИ
   ------------------------------------------------------------
   Направление выбирается само:
   • блоки друг под другом      → прямая вниз
   • блоки на одной высоте      → прямая вбок
   • иначе                      → «уголок»: вниз, потом вбок
   ------------------------------------------------------------ */
function Edge({ edge, from, to, markerId }) {
  if (!from || !to) return null;

  const fromCX = from.x + from.w / 2;
  const fromCY = from.y + from.h / 2;
  const toCX = to.x + to.w / 2;
  const toCY = to.y + to.h / 2;

  let path;
  let labelX;
  let labelY;

  // Блоки стоят друг под другом
  if (Math.abs(fromCX - toCX) < 2) {
    path = `M ${fromCX} ${from.y + from.h} L ${toCX} ${to.y}`;
    labelX = fromCX + 16;
    labelY = (from.y + from.h + to.y) / 2 + 4;
  }
  // Блоки на одной высоте — линия вбок
  else if (Math.abs(fromCY - toCY) < 6) {
    const goesRight = toCX > fromCX;
    const startX = goesRight ? from.x + from.w : from.x;
    const endX = goesRight ? to.x : to.x + to.w;
    path = `M ${startX} ${fromCY} L ${endX} ${toCY}`;
    labelX = (startX + endX) / 2;
    labelY = fromCY - 8;
  }
  // Уголок: сначала вниз, потом вбок и снова вниз
  else {
    const midY = (from.y + from.h + to.y) / 2;
    path = `M ${fromCX} ${from.y + from.h} L ${fromCX} ${midY} L ${toCX} ${midY} L ${toCX} ${to.y}`;
    labelX = (fromCX + toCX) / 2;
    labelY = midY - 8;
  }

  return (
    <g>
      <path
        className={`${s.edge} ${edge.dashed ? s.edgeDashed : ""}`}
        d={path}
        markerEnd={`url(#${markerId})`}
      />

      {edge.label && (
        <text className={s.edgeLabel} x={labelX} y={labelY} textAnchor="middle">
          {edge.label}
        </text>
      )}
    </g>
  );
}
