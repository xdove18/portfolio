import Rail from "../components/Rail/Rail";
import Manifest from "../components/Work/Manifest";
import CaseStack from "../components/Work/CaseStack";
import Bio from "../components/Work/Bio";
import Footer from "../components/Footer/Footer";
import s from "./HomePage.module.css";

/* ============================================================
   ГЛАВНАЯ СТРАНИЦА
   ============================================================
   Страница состоит из двух колонок.

   Слева — визитка: фотография, имя, меню, связь. Она стоит
   на месте, пока справа листается всё остальное.

   Справа — главная фраза, стопка кейсов и блок «о себе».
   Порядок задаётся здесь: чтобы поменять местами, переставьте
   строки внутри <main>.

   Футер идёт отдельно, во всю ширину страницы.

   Заставки с пчёлкой на этой версии сайта нет.
   ============================================================ */

export default function HomePage() {
  return (
    <>
      <div className={s.shell}>
        <Rail />

        <main className={s.stream}>
          <Manifest />
          <CaseStack />
          <Bio />
        </main>
      </div>

      <Footer />
    </>
  );
}
