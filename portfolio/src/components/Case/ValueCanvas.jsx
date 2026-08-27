import { useState } from "react";
import ZoomableFigure from "./ZoomableFigure";
import RichText from "./RichText";
import s from "./Case.module.css";

/* ============================================================
   ШАБЛОН ЦЕННОСТНОГО ПРЕДЛОЖЕНИЯ (Александр Остервальдер)
   ============================================================
   Две схемы, которые читаются справа налево:

   1. Профиль клиента — что человеку нужно и что ему мешает:
      задачи, боли, выгоды.
   2. Карта ценности — чем продукт на это отвечает:
      сами функции, что снимает боль, что создаёт выгоду.

   Гипотезы кейса выросли именно отсюда: каждая проверяет
   одну связку «боль → решение».

   Как описать в src/data/projects.js:

   valueCanvas: {
     note: "Пояснение под схемами",
     customer: {
       jobs:  ["Задача 1", "Задача 2"],
       pains: ["Боль 1"],
       gains: ["Выгода 1"],
     },
     value: {
       products:      ["Функция 1"],
       painRelievers: ["Что снимает боль"],
       gainCreators:  ["Что создаёт выгоду"],
     },
     links: [
       { from: "Боль", to: "Гипотеза", note: "как связаны" },
     ],
   }
   ============================================================ */

export default function ValueCanvas({ canvas, accent, accentDeep }) {
  /* Схема разворачивается по кнопке — так же, как разбор
     конкурентов. Она большая, и показывать её сразу означало
     бы вывалить на человека стену блоков ещё до гипотез.
     Кому интересно — нажмёт и посмотрит. */
  const [открыто, setОткрыто] = useState(false);

  if (!canvas) return null;

  if (!открыто) {
    return (
      <button
        type="button"
        className={s.canvasToggle}
        style={{ background: accent }}
        onClick={() => setОткрыто(true)}
      >
        ценностное предложение по Остервальдеру
      </button>
    );
  }

  return (
    <div className={s.canvasWrap}>
      <div className={s.canvasPair}>
        {/* ---------- КАРТА ЦЕННОСТИ (квадрат) ---------- */}
        <ZoomableFigure title="Карта ценности — что делает продукт">
          <div className={`${s.canvasBoard} ${s.canvasSquare}`}>
            <Zone
              title="Продукты и функции"
              hint="что мы вообще даём человеку"
              items={canvas.value.products}
              tone="plain"
              span
            />
            <Zone
              title="Снимают боль"
              hint="убирают то, что мешало"
              items={canvas.value.painRelievers}
              tone="relief"
            />
            <Zone
              title="Создают выгоду"
              hint="дают то, чего человек хотел"
              items={canvas.value.gainCreators}
              tone="gain"
              accent={accent}
            />
          </div>
        </ZoomableFigure>

        {/* Стрелка «совпадение» между двумя половинами */}
        <div className={s.canvasFit} aria-hidden="true">
          <span className={s.canvasFitLine} />
          <span
            className={s.canvasFitBadge}
            style={{ background: accentDeep || accent }}
          >
            совпадение
          </span>
          <span className={s.canvasFitLine} />
        </div>

        {/* ---------- ПРОФИЛЬ КЛИЕНТА (круг) ---------- */}
        <ZoomableFigure title="Профиль клиента — что нужно человеку">
          <div className={`${s.canvasBoard} ${s.canvasCircle}`}>
            <Zone
              title="Задачи"
              hint="что человек пытается сделать"
              items={canvas.customer.jobs}
              tone="plain"
              span
            />
            <Zone
              title="Боли"
              hint="что мешает и раздражает"
              items={canvas.customer.pains}
              tone="pain"
            />
            <Zone
              title="Выгоды"
              hint="что считается хорошим исходом"
              items={canvas.customer.gains}
              tone="gain"
              accent={accent}
            />
          </div>
        </ZoomableFigure>
      </div>

      {canvas.note && (
        <p className={s.canvasNote}>
          <RichText>{canvas.note}</RichText>
        </p>
      )}

      {/* ---------- ОТКУДА ВЗЯЛИСЬ ГИПОТЕЗЫ ---------- */}
      {canvas.links && canvas.links.length > 0 && (
        <div className={s.canvasLinks}>
          <h4 className={s.canvasLinksTitle}>Из чего выросли гипотезы</h4>

          <ul className={s.canvasLinkList}>
            {canvas.links.map((link, i) => (
              <li className={s.canvasLink} key={i}>
                <span className={s.canvasLinkFrom}>{link.from}</span>

                <span
                  className={s.canvasLinkArrow}
                  style={{ color: accentDeep || accent }}
                  aria-hidden="true"
                >
                  →
                </span>

                <span className={s.canvasLinkTo}>
                  <strong>{link.to}</strong>
                  {link.note && (
                    <span className={s.canvasLinkNote}>{link.note}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   ОДНА ЗОНА ШАБЛОНА
   ------------------------------------------------------------
   span — зона занимает всю ширину схемы, а не половину
   ------------------------------------------------------------ */
function Zone({ title, hint, items, tone, span, accent }) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={[
        s.canvasZone,
        span ? s.canvasZoneWide : "",
        tone === "pain" ? s.canvasZonePain : "",
        tone === "relief" ? s.canvasZoneRelief : "",
        tone === "gain" ? s.canvasZoneGain : "",
      ].join(" ")}
      style={tone === "gain" && accent ? { borderColor: accent } : undefined}
    >
      <p className={s.canvasZoneTitle}>{title}</p>
      <p className={s.canvasZoneHint}>{hint}</p>

      <ul className={s.canvasZoneList}>
        {items.map((item, i) => (
          <li key={i}>
            <RichText>{item}</RichText>
          </li>
        ))}
      </ul>
    </div>
  );
}
