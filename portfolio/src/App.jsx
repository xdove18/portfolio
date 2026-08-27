import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import SparkleCursor from "./components/Cursor/SparkleCursor";
import BackToTop from "./components/BackToTop/BackToTop";

/* ============================================================
   КОРЕНЬ ПРИЛОЖЕНИЯ
   ============================================================
   Здесь описано, какая страница показывается по какому адресу.

   "/"                       → главная
   "/projects/smart-size"    → кейс «Умный размер»
   "/projects/habits"        → кейс «HabitFlow»
   любой другой адрес        → страница «не найдено»
   ============================================================ */

/* lazy() = «загрузить эту страницу только когда её откроют».
   Главная грузится сразу, а тяжёлые страницы кейсов — по клику.
   Благодаря этому сайт открывается быстрее. */
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <>
      {/* Курсор-искра работает на всех страницах сайта */}
      <SparkleCursor />

      {/* При переходе на новую страницу прокручиваем её в начало */}
      <ScrollToTop />

      {/* Кнопка «наверх» в правом нижнем углу. Появляется,
          когда пролистана половина страницы. */}
      <BackToTop />

      {/* Suspense показывает заглушку, пока страница подгружается */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* :slug — подставляется адрес конкретного проекта */}
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

/* Заглушка на время загрузки страницы кейса */
function PageLoader() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        color: "var(--text-muted)",
        fontSize: "var(--fs-small)",
      }}
    >
      загружаем кейс…
    </div>
  );
}
