import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { site, navLinks } from "../../data/site";
import { LogoMark, TelegramIcon, BurgerIcon } from "../icons/Icons";
import s from "./Header.module.css";

/* ============================================================
   ШАПКА САЙТА
   ============================================================
   Прилипает к верху экрана, на телефоне сворачивается в
   бургер-меню. Пункты меню прокручивают к секциям главной.
   ============================================================ */

export default function Header() {
  // Открыто ли меню на телефоне
  const [menuOpen, setMenuOpen] = useState(false);
  // Какой пункт меню сейчас активен (подсвечивается)
  const [activeSection, setActiveSection] = useState("");

  const location = useLocation();   // текущий адрес страницы
  const navigate = useNavigate();   // переход на другую страницу
  const isHome = location.pathname === "/";

  /* ---- Подсветка активного пункта меню при прокрутке ----
     IntersectionObserver — встроенный в браузер наблюдатель.
     Он сообщает, какая секция сейчас видна на экране,
     и мы подсвечиваем соответствующий пункт меню.
     Это дешевле, чем считать позицию на каждый пиксель прокрутки. */
  useEffect(() => {
    if (!isHome) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      // Секция считается активной, когда она в средней части экрана
      { rootMargin: "-45% 0px -50% 0px" }
    );

    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    // Когда компонент убирается с экрана — выключаем наблюдатель,
    // иначе он останется в памяти и будет работать впустую
    return () => observer.disconnect();
  }, [isHome]);

  /* ---- Блокировка прокрутки страницы, когда открыто меню ----
     Иначе фон «уезжает» под открытым меню на телефоне */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* ---- Клик по пункту меню ----
     Если мы на главной — просто прокручиваем к секции.
     Если на странице кейса — сначала возвращаемся на главную,
     а прокрутку выполняем после перехода. */
  function handleNavClick(event, id) {
    event.preventDefault();
    setMenuOpen(false);

    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  }

  return (
    <header className={s.header}>
      <div className={s.inner}>
        {/* Логотип и имя — ведут в начало страницы */}
        <Link
          to="/"
          className={s.logo}
          onClick={(e) => isHome && handleNavClick(e, "top")}
        >
          <span className={s.logoMark}>
            <LogoMark size={16} color="#fff" />
          </span>
          <span className={s.logoName}>{site.name}</span>
        </Link>

        {/* Навигация. На телефоне превращается в выпадающее меню */}
        <nav
          className={`${s.nav} ${menuOpen ? s.navOpen : ""}`}
          aria-label="Основная навигация"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`${s.navLink} ${
                activeSection === link.id ? s.navLinkActive : ""
              }`}
              onClick={(e) => handleNavClick(e, link.id)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={s.right}>
          {/* Кнопка «написать мне» */}
          <a
            href={site.telegramUrl}
            className={s.cta}
            target="_blank"
            rel="noreferrer"
          >
            <span>написать мне</span>
            <span className={s.ctaIcon}>
              <TelegramIcon size={16} color="#fff" />
            </span>
          </a>

          {/* Кнопка бургер-меню — видна только на телефоне */}
          <button
            className={s.burger}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
          >
            <BurgerIcon open={menuOpen} />
          </button>
        </div>
      </div>
    </header>
  );
}
