import { Fragment, useEffect, useState } from "react";
import { fixHangingWords } from "../utils/typography";
import { Link, useParams } from "react-router-dom";
import { getProject } from "../data/projects";
import { site } from "../data/site";
import Footer from "../components/Footer/Footer";
import Competitors from "../components/Case/Competitors";
import ScreenGallery from "../components/Case/ScreenGallery";
import Row from "../components/Case/Row";
import HypothesisList from "../components/Case/HypothesisList";
import FlowCompare from "../components/Case/FlowCompare";
import FlowDiagram from "../components/Case/FlowDiagram";
import { TablesFor } from "../components/Case/CaseTable";
import { TimelinesFor } from "../components/Case/Timeline";
import { thumb } from "../components/Case/imagePath";
import { asset } from "../utils/asset";
import RichText from "../components/Case/RichText";
import DemoVideo from "../components/Case/DemoVideo";
import Flower from "../components/Flower/Flower";
import { CheckIcon } from "../components/icons/Icons";
import NotFound from "./NotFound";
import s from "../components/Case/Case.module.css";

/* ============================================================
   СТРАНИЦА КЕЙСА
   ============================================================
   Слева — оглавление, которое едет вместе со страницей.
   Справа — сам кейс: задача, исследование, гипотезы,
   экраны приложения и результат.

   Весь текст берётся из файла src/data/projects.js.

   ------------------------------------------------------------
   КАК УСТРОЕНА ВЁРСТКА
   ------------------------------------------------------------
   Любой текст стоит в ряду <Row label="подпись">: слева
   короткая подпись, справа узкая колонка текста. Подробнее —
   в файле src/components/Case/Row.jsx.

   Картинки, схемы, видео и таблицы в ряд не ставятся: они
   идут во всю ширину колонки. Из этого и складывается
   страница — узкий текст рядом с большими картинками.

   Пояснения под картинкой, таблицей или списком — тоже
   не ряд: они начинаются от левого края своего блока, как
   его подпись. Если такое пояснение отодвинуть в колонку
   текста, левый край страницы начинает прыгать.
   ============================================================ */

/* Разделы оглавления. id должен совпадать с id секции ниже.
   Раздел «рынок» появляется, только если у проекта заполнен
   разбор рынка — сводка или карточки конкурентов.
   Иначе ссылка вела бы в пустоту. */
/* Порядок разделов по умолчанию. Кейс может задать свой —
   полем sectionOrder в src/data/projects.js. Например, если
   у кейса главное — разбор конкурентов, «рынок» ставится
   сразу после «задачи», до «аудитории». */
const ПОРЯДОК = ["overview", "task", "audience", "market", "solution", "result"];

const НАЗВАНИЯ = {
  overview: "обзор",
  task: "задача",
  audience: "аудитория",
  market: "рынок",
  solution: "решение",
  result: "результат",
};

function buildSections(project) {
  const hasMarket =
    Boolean(project.competitorsSummary) || Boolean(project.competitors?.length);

  const порядок = project.sectionOrder || ПОРЯДОК;

  return порядок
    /* Раздел «рынок» появляется только у кейсов, где разобраны
       конкуренты. У остальных его в оглавлении нет. */
    .filter((id) => (id === "market" ? hasMarket : true))
    .map((id) => ({ id, label: НАЗВАНИЯ[id] }));
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);

  const [activeSection, setActiveSection] = useState("overview");

  /* Подсветка активного пункта оглавления при прокрутке.
     Работает так же, как в шапке сайта. */
  useEffect(() => {
    if (!project) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    buildSections(project).forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [project]);

  /* Заголовок вкладки браузера и описание для поисковиков */
  useEffect(() => {
    if (!project) return;

    const previousTitle = document.title;
    document.title = `${project.title} — кейс ${site.name}`;

    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");
    description?.setAttribute("content", project.intro);

    // Возвращаем прежние значения при уходе со страницы
    return () => {
      document.title = previousTitle;
      if (previousDescription) {
        description?.setAttribute("content", previousDescription);
      }
    };
  }, [project]);

  // Если адрес неверный или проект — заглушка «скоро»
  if (!project || project.comingSoon) return <NotFound />;

  const sections = buildSections(project);

  /* Разделы собраны по отдельности, а показываются в том
     порядке, который задан у проекта полем sectionOrder
     в src/data/projects.js. Благодаря этому у разных кейсов
     порядок может быть разным: где-то сначала рынок,
     где-то сначала аудитория. */
  const блоки = {
    // ---------- ОБЗОР ----------
    overview: (
      <section id="overview">
        {/* Обложка на нейтральной серой плашке — такой же,
            как в стопке кейсов на главной. Цвет проекта
            остаётся только в мелких деталях: плашке ниши,
            цифрах результата, маркерах. */}
        <div
          className={`${s.cover} ${project.coverWide ? s.coverWide : ""}`}
        >
          {/* Обложка не кликается, поэтому метку data-cursor
              здесь не ставим — надпись «нажми на меня»
              появляется только там, где клик что-то делает */}
          {project.cover.map((src) => (
            <img
              key={src}
              /* Обложка показывается небольшой, поэтому
                 берём лёгкую копию */
              src={thumb(src)}
              alt=""
              className={s.coverShot}
            />
          ))}
        </div>

        <h2 className={s.headline}>{project.headline}</h2>

        <Row label="контекст">
          <p className={s.intro}>
            <RichText>{project.intro}</RichText>
          </p>
        </Row>
      </section>
    ),

    // ---------- ЗАДАЧА ----------
    task: (
      <section className={s.block} id="task">
        <h2 className={s.blockTitle}>Задача</h2>

        <Row label="проблема бизнеса">
          <p className={s.text}>
            <RichText>{project.problem.business}</RichText>
          </p>
        </Row>

        <Row label="моя задача">
          <p className={s.text}>
            <RichText>{project.problem.designer}</RichText>
          </p>
        </Row>

        {/* Данные раздела — например, воронка с отвалом.
            Стоят выше вопросов намеренно: цифра, с которой
            началась работа, важнее списка вопросов к бизнесу. */}
        <TablesFor
          tables={project.tables}
          section="task"
          accent={project.color}
        />

        {/* Вопросы, заданные бизнесу перед началом работы */}
        {project.problem.questionsToBusiness && (
          <Row label="вопросы перед стартом">
            <ul className={s.bullets}>
              {project.problem.questionsToBusiness.map((item, i) => (
                <li key={i}><RichText>{item}</RichText></li>
              ))}
            </ul>
          </Row>
        )}
      </section>
    ),

    // ---------- АУДИТОРИЯ ----------
    audience: (
      <section className={s.block} id="audience">
        <h2 className={s.blockTitle}>Аудитория</h2>

        {/* Подпись берётся из проекта. По умолчанию
            «глубинные интервью», но в кейсе, где интервью
            не было, она будет другой: подпись не должна
            обещать то, чего в работе не было. */}
        <Row label={project.research.methodTitle || "глубинные интервью"}>
          <p className={s.text}>
            <RichText>{project.research.method}</RichText>
          </p>
        </Row>

        {/* Кто пользуется продуктом */}
        {project.research.audience && (
          <Row label="кто эти люди">
            <p className={s.text}>
              <RichText>{project.research.audience}</RichText>
            </p>
          </Row>
        )}

        {/* Кадр с созвона, если он есть у кейса */}
        {project.research.photo && (
          <figure className={s.researchPhoto}>
            <img
              /* Без уменьшенной копии: кадр и так лёгкий,
                 а отдельный thumb для него не создаётся */
              src={asset(project.research.photo.src)}
              alt="Созвон с респондентом: разбор прототипа"
              loading="lazy"
            />
            {project.research.photo.note && (
              <figcaption>{project.research.photo.note}</figcaption>
            )}
          </figure>
        )}

        <Row label="что нашла">
          <ul className={s.bullets}>
            {project.research.findings.map((item, i) => (
              <li key={i}><RichText>{item}</RichText></li>
            ))}
          </ul>
        </Row>

        {/* Вопросы интервью и пожелания пользователей.
            Каждый список появляется, только если заполнен:
            в кейсе, где метод и так понятен, список вопросов
            можно просто не заполнять — ряд исчезнет сам. */}
        {project.research.questions?.length > 0 && (
          <Row
            label={project.research.questionsTitle || "вопросы для интервью"}
          >
            <ul className={s.bullets}>
              {project.research.questions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Row>
        )}

        {project.research.wanted?.length > 0 && (
          <Row label="что хотели видеть">
            <ul className={s.bullets}>
              {project.research.wanted.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Row>
        )}

        {/* Лента времени этого раздела — например, рабочий день
            человека, про которого кейс. Появляется, только если
            описана у проекта. */}
        <TimelinesFor
          timelines={project.timelines}
          section="audience"
          accent={project.color}
        />

        <TablesFor
          tables={project.tables}
          section="audience"
          accent={project.color}
        />
      </section>
    ),

    // ---------- РЫНОК ----------
    market: (
      <Competitors
        competitors={project.competitors}
        summary={project.competitorsSummary}
        accent={project.color}
        table={
          <TablesFor
            tables={project.tables}
            section="market"
            accent={project.color}
          />
        }
      />
    ),

    // ---------- РЕШЕНИЕ ----------
    solution: (
      <section className={s.block} id="solution">
        <h2 className={s.blockTitle}>Решение</h2>

        {/* Гипотезы. Блок появляется, только если они
            описаны у проекта. У самого списка слева уже есть
            колонка — номер и вердикт, — поэтому в ряд он
            не ставится, а подпись стоит над ним. */}
        {project.hypotheses?.length > 0 && (
          <>
            <h3 className={s.subTitle}>
              {fixHangingWords("построение гипотез")}
            </h3>
            <HypothesisList items={project.hypotheses} />

            {/* Честная пометка: чем проверялись гипотезы
                и где вывод, а где измерение */}
            {project.hypothesesNote && (
              <p className={s.resultsNote}>
                <RichText>{project.hypothesesNote}</RichText>
              </p>
            )}
          </>
        )}

        {/* Приоритизация и прочие таблицы этого раздела */}
        <TablesFor
          tables={project.tables}
          section="solution"
          accent={project.color}
        />

        {/* Как механика разворачивается во времени: по дням,
            по шагам. Появляется, только если описана. */}
        <TimelinesFor
          timelines={project.timelines}
          section="solution"
          accent={project.color}
        />

        {/* Путь пользователя. Блок появляется только там,
            где в нём есть что показать: схемы или
            сравнение «было-стало». Простую ленту шагов
            из кейсов убрали — она пересказывала порядок
            экранов, который и так виден ниже. */}
        {(project.flowDiagrams || project.flowCompare) && (
          <h3 className={s.subTitle}>
            {fixHangingWords("путь пользователя")}
          </h3>
        )}

        {project.flowDiagrams ? (
          <>
            <div className={s.diagrams}>
              {project.flowDiagrams.map((diagram) => (
                <FlowDiagram
                  key={diagram.id}
                  diagram={diagram}
                  accent={project.color}
                />
              ))}
            </div>

            {project.flowDiagramsNote && (
              <p className={s.diagramsSummary}>
                <RichText>{project.flowDiagramsNote}</RichText>
              </p>
            )}
          </>
        ) : project.flowCompare ? (
          <FlowCompare
            data={project.flowCompare}
            accent={project.color}
            accentDeep={project.colorDeep}
          />
        ) : null}

        {/* Демо-видео: показываем сценарий вживую,
            до того как разбирать отдельные экраны */}
        <DemoVideo demo={project.demoVideo} />

        {/* Экраны приложения */}
        <h3 className={s.subTitle}>{fixHangingWords("экраны приложения")}</h3>
        {project.screensNote && (
          <p className={s.screenGroupNote}>
            <RichText>{project.screensNote}</RichText>
          </p>
        )}
        <ScreenGallery groups={project.screenGroups} />
      </section>
    ),

    // ---------- РЕЗУЛЬТАТ ----------
    result: (
      <section className={s.block} id="result">
        <h2 className={s.blockTitle}>Результат</h2>

        <div className={s.results}>
          {(project.results || []).map((item, i) => (
            <div className={s.resultCard} key={i}>
              <p className={s.resultValue}>
                {item.value}
              </p>
              <p className={s.resultLabel}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Честная пометка, откуда взяты цифры */}
        {project.resultsNote && (
          <p className={s.resultsNote}>{project.resultsNote}</p>
        )}

        {/* Таблицы результата: юзабилити-тест, метрики */}
        <TablesFor
          tables={project.tables}
          section="result"
          accent={project.color}
        />

        {/* Итог кейса своими словами */}
        {project.conclusion && (
          <Row label="итог">
            <p className={s.text}>
              <RichText>{project.conclusion}</RichText>
            </p>
          </Row>
        )}

        {/* Как автор собирается проверить, что решение сработало.
            Блок необязательный: заполните поле measure у проекта
            в src/data/projects.js — и он появится. Пусто — его нет.

            Смысл блока: назвать число, по которому решение можно
            признать неудачным. Это то, чего почти не бывает
            в портфолио, и то, что сразу отличает продуктового
            дизайнера от интерфейсного. */}
        {project.measure && (
          <Row label="как пойму, что сработало">
            <p className={s.measureText}>
              <RichText>{project.measure}</RichText>
            </p>
          </Row>
        )}

        {/* Что не получилось. Блок появляется, только если он
            заполнен у проекта: признаваться не в чем —
            не признаёмся. */}
        {project.failures?.length > 0 && (
          <Row label="что не получилось">
            <ul className={s.failures}>
              {project.failures.map((item, i) => (
                <li key={i}>
                  <RichText>{item}</RichText>
                </li>
              ))}
            </ul>
          </Row>
        )}

        {/* Идеи для развития — тоже необязательный блок.
            Если идей нет, лучше его не показывать, чем писать
            общие слова. */}
        {project.ideas?.length > 0 && (
          <Row label="идеи для развития">
            <ul className={s.ideasList}>
              {project.ideas.map((idea, i) => (
                <li key={i}>
                  <CheckIcon size={16} color={project.color} />
                  {idea}
                </li>
              ))}
            </ul>
          </Row>
        )}
      </section>
    ),
  };

  return (
    <>
      {/* Шапки на странице кейса нет: наверху левой колонки
          стоит ссылка «ко всем проектам», а остальные разделы
          сайта доступны из футера. Так ничего не перекрывает
          обложку и не отвлекает от чтения. */}
      <main className={s.page}>
        <div className={s.layout}>
          {/* ================= ЛЕВАЯ КОЛОНКА ================= */}
          <aside className={s.sidebar}>
            <Link to="/" className={s.back}>
              {fixHangingWords("← ко всем проектам")}
            </Link>

            <span className={s.niche}>
              {project.niche}
            </span>

            <h1 className={s.sidebarTitle}>{project.title}</h1>
            <p className={s.sidebarTagline}>{project.tagline}</p>

            {/* Каждая строчка появляется, только если заполнена:
                у проекта может не быть, например, известного года. */}
            <dl className={s.meta}>
              {project.role && (
                <div>
                  <dt>роль</dt>
                  <dd>{project.role}</dd>
                </div>
              )}
              {project.year && (
                <div>
                  <dt>год</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
              {project.tools?.length > 0 && (
                <div>
                  <dt>инструменты</dt>
                  <dd>{project.tools.join(", ")}</dd>
                </div>
              )}
            </dl>

            {/* Оглавление */}
            <nav className={s.toc} aria-label="Содержание кейса">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`${s.tocLink} ${
                    activeSection === section.id ? s.tocLinkActive : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(section.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {/* Цвет активной точки задан в стилях — тем же
                      салатовым, что и маркер меню на главной */}
                  <span
                    className={s.tocDot}
                  />
                  {section.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* ================= ПРАВАЯ КОЛОНКА ================= */}
          <div className={s.content}>
            {sections.map((section) => (
              <Fragment key={section.id}>{блоки[section.id]}</Fragment>
            ))}

            {/* ---------- ФИНАЛ ---------- */}
            <div className={s.thanks}>
              <div className={s.thanksFlower}>
                <Flower color="var(--flower-red)" size={64} />
              </div>

              {/* Текст правится в файле src/data/site.js,
                  поле caseOutro */}
              <p className={s.thanksText}>{site.caseOutro}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
