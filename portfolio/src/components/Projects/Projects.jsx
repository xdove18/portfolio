import { projects } from "../../data/projects";
import ProjectCard from "./ProjectCard";
import s from "./Projects.module.css";

/* ============================================================
   РАЗДЕЛ «ПРОЕКТЫ»
   ============================================================
   Показывает все проекты из файла src/data/projects.js.
   Чтобы добавить проект — допишите его туда, здесь менять
   ничего не нужно.
   ============================================================ */

export default function Projects() {
  return (
    <section className={`section ${s.projects}`} id="projects">
      <div className="container">
        <h2 className={s.title}>Проекты</h2>

        <div className={s.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
