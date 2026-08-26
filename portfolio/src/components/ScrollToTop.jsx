import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* ============================================================
   ПРОКРУТКА В НАЧАЛО ПРИ СМЕНЕ СТРАНИЦЫ
   ============================================================
   Без этого при переходе с главной на кейс страница открывалась
   бы посередине — там, где вы были до перехода.

   Отдельный случай: возврат с кейса на главную к нужной секции.
   Тогда мы прокручиваем не в начало, а к этой секции.
   ============================================================ */

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // state.scrollTo передаётся из шапки, когда нажали пункт меню
    // на странице кейса: «вернись на главную и покажи эту секцию»
    const target = location.state?.scrollTo;

    if (target) {
      // Небольшая задержка нужна, чтобы главная успела отрисоваться
      const timer = setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      return () => clearTimeout(timer);
    }

    window.scrollTo(0, 0);
  }, [location]);

  return null; // компонент ничего не рисует, только выполняет действие
}
