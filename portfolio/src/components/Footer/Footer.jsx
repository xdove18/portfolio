import { Link, useLocation, useNavigate } from "react-router-dom";
import { site, navLinks } from "../../data/site";
import { LogoMark, TelegramIcon } from "../icons/Icons";
import FallingFlowers from "./FallingFlowers";
import s from "./Footer.module.css";

/* ============================================================
   ФУТЕР / КОНТАКТЫ
   ============================================================
   Чёрный блок с крупным телеграм-ником и падающими цветами.

   Ссылки внизу ведут к секциям главной страницы. Если человек
   сейчас на странице кейса, где таких секций нет, — сначала
   переходим на главную, а прокрутку делаем уже там.
   ============================================================ */

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  function handleNavClick(event, id) {
    event.preventDefault();

    if (isHome) {
      // Мы на главной — просто прокручиваем к секции
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      /* Мы на странице кейса. Переходим на главную и передаём,
         к какой секции прокрутить. Саму прокрутку выполнит
         компонент ScrollToTop после того, как главная отрисуется. */
      navigate("/", { state: { scrollTo: id } });
    }
  }

  return (
    <footer className={s.footer} id="contacts">
      {/* Цветы лежат отдельным слоем под текстом */}
      <FallingFlowers />

      <div className={`container ${s.inner}`}>
        <p className={s.label}>{site.footer.label}</p>

        {/* Крупный ник — это ссылка на телеграм */}
        <a
          className={s.nick}
          href={site.telegramUrl}
          target="_blank"
          rel="noreferrer"
        >
          @{site.telegram}
        </a>

        <a
          className={s.cta}
          href={site.telegramUrl}
          target="_blank"
          rel="noreferrer"
        >
          <TelegramIcon size={18} color="#1a1a1a" />
          <span>{site.footer.ctaText}</span>
        </a>

        {/* Нижняя строка: логотип, меню, копирайт */}
        <div className={s.bottom}>
          {/* Имя ведёт на главную страницу */}
          <Link to="/" className={s.brand}>
            <span className={s.brandMark}>
              <LogoMark size={15} color="#fff" />
            </span>
            <span>
              <span className={s.brandName}>{site.name}</span>
              <span className={s.brandRole}>
                {site.role} · {site.city}
              </span>
            </span>
          </Link>

          <nav className={s.links} aria-label="Навигация в подвале">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className={s.copy}>
            © {new Date().getFullYear()} {site.name}
            <span>{site.footer.copyright}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
