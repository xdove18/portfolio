import { useEffect, useState } from "react";
import { fixHangingWords } from "../utils/typography";
import { Link, useParams } from "react-router-dom";
import { getProject } from "../data/projects";
import { site } from "../data/site";
import Footer from "../components/Footer/Footer";
import Competitors from "../components/Case/Competitors";
import ScreenGallery from "../components/Case/ScreenGallery";
import Hypotheses from "../components/Case/Hypotheses";
import FlowCompare from "../components/Case/FlowCompare";
import FlowDiagram from "../components/Case/FlowDiagram";
import { TablesFor } from "../components/Case/CaseTable";
import { thumb } from "../components/Case/imagePath";
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
   ============================================================ */

/* Разделы оглавления. id должен совпадать с id секции ниже.
   Раздел «рынок» появляется, только если у проекта заполнен
   разбор рынка — сводка или карточки конкурентов.
   Иначе ссылка вела бы в пустоту. */
function buildSections(project) {
  const hasMarket =
    Boolean(project.competitorsSummary) || Boolean(project.competitors?.length);

  return [
    { id: "overview", label: "обзор" },
    { id: "task", label: "задача" },
    { id: "audience", label: "аудитория" },
    ...(hasMarket ? [{ id: "market", label: "рынок" }] : []),
    { id: "solution", label: "решение" },
    { id: "result", label: "результат" },
  ];
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

            <dl className={s.meta}>
              <div>
                <dt>роль</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>год</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>инструменты</dt>
                <dd>{project.tools.join(", ")}</dd>
              </div>
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
            {/* ---------- ОБЗОР ---------- */}
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
              <p className={s.intro}><RichText>{project.intro}</RichText></p>
            </section>

            {/* ---------- ЗАДАЧА ---------- */}
            <section className={s.block} id="task">
              <h2 className={s.blockTitle}>Задача</h2>

              <div className={s.twoCol}>
                <div className={s.card}>
                  <h3 className={s.cardTitle}>{fixHangingWords("Проблема бизнеса")}</h3>
                  <p className={s.cardText}><RichText>{project.problem.business}</RichText></p>
                </div>

                <div className={s.card}>
                  <h3 className={s.cardTitle}>{fixHangingWords("Задача продуктового дизайнера")}</h3>
                  <p className={s.cardText}><RichText>{project.problem.designer}</RichText></p>
                </div>
              </div>

              {/* Вопросы, заданные бизнесу перед началом работы */}
              {project.problem.questionsToBusiness && (
                <>
                  <h3 className={s.subTitle}>{fixHangingWords("вопросы, заданные перед стартом")}</h3>
                  <ul className={s.bullets}>
                    {project.problem.questionsToBusiness.map((item, i) => (
                      <li key={i}><RichText>{item}</RichText></li>
                    ))}
                  </ul>
                </>
              )}

              {/* Таблицы этого раздела — например, воронка */}
              <TablesFor
                tables={project.tables}
                section="task"
                accent={project.color}
              />
            </section>

            {/* ---------- АУДИТОРИЯ И ИССЛЕДОВАНИЕ ---------- */}
            <section className={s.block} id="audience">
              <h2 className={s.blockTitle}>Аудитория</h2>

              {/* Заголовок берётся из проекта. По умолчанию
                  «глубинные интервью», но в кейсе, где интервью
                  не было, он будет другим: подпись не должна
                  обещать то, чего в работе не было. */}
              <h3 className={s.subTitle}>
                {fixHangingWords(project.research.methodTitle || "глубинные интервью")}
              </h3>
              <p className={s.text}><RichText>{project.research.method}</RichText></p>

              {/* Кто пользуется продуктом */}
              {project.research.audience && (
                <>
                  <h3 className={s.subTitle}>{fixHangingWords("кто эти люди")}</h3>
                  <p className={s.text}><RichText>{project.research.audience}</RichText></p>
                </>
              )}

              <h3 className={s.subTitle}>итог</h3>
              <ul className={s.bullets}>
                {project.research.findings.map((item, i) => (
                  <li key={i}><RichText>{item}</RichText></li>
                ))}
              </ul>

              <div className={s.panelSoft}>
                <h3 className={s.subTitle}>
                  {fixHangingWords(
                    project.research.questionsTitle || "вопросы для интервью"
                  )}
                </h3>
                <ul className={s.bullets}>
                  {project.research.questions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>

                {project.research.wanted && (
                  <>
                    <h3 className={s.subTitle}>
                      {fixHangingWords("что хотели видеть пользователи")}
                    </h3>
                    <ul className={s.bullets}>
                      {project.research.wanted.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <TablesFor
                tables={project.tables}
                section="audience"
                accent={project.color}
              />
            </section>

            {/* ---------- КОНКУРЕНТЫ ---------- */}
            <Competitors
              competitors={project.competitors}
              summary={project.competitorsSummary}
              accent={project.color}
            />

            {/* ---------- РЕШЕНИЕ ---------- */}
            <section className={s.block} id="solution">
              <h2 className={s.blockTitle}>Решение</h2>

              {/* Гипотезы. Блок появляется, только если они
                  описаны у проекта: в кейсе, где их проверяли
                  таблицей, второй раз пересказывать незачем.
                  Если гипотез много, появятся стрелки для
                  перелистывания — см. Hypotheses.jsx */}
              {project.hypotheses?.length > 0 && (
                <>
                  <h3 className={s.subTitle}>
                    {fixHangingWords("построение гипотез")}
                  </h3>
                  <Hypotheses
                    items={project.hypotheses}
                    color={project.color}
                  />
                </>
              )}

              {/* Приоритизация и прочие таблицы этого раздела */}
              <TablesFor
                tables={project.tables}
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
                <p className={s.text}><RichText>{project.screensNote}</RichText></p>
              )}
              <ScreenGallery groups={project.screenGroups} />
            </section>

            {/* ---------- РЕЗУЛЬТАТ ---------- */}
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
                <>
                  <h3 className={s.subTitle}>итог</h3>
                  <p className={s.text}><RichText>{project.conclusion}</RichText></p>
                </>
              )}

              <div className={s.ideas}>
                <h3 className={s.subTitle}>{fixHangingWords("идеи для развития")}</h3>
                <ul className={s.ideasList}>
                  {project.ideas.map((idea, i) => (
                    <li key={i}>
                      <CheckIcon size={16} color={project.color} />
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

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
