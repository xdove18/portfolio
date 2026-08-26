/* ============================================================
   ФОРМЫ ЦВЕТОВ ДЛЯ ФУТЕРА
   ============================================================
   Пять разных силуэтов, чтобы падающие цветы не выглядели
   одинаковыми штамповками.

   Каждая функция возвращает готовую картинку-код (SVG).
   Цвет берётся из свойства color самого элемента, поэтому
   один и тот же силуэт можно покрасить как угодно.

   Чтобы добавить свою форму — допишите функцию в конец
   и укажите её в списке SHAPES внизу файла.
   ============================================================ */

/* Обёртка: общая рамка для всех форм */
function wrap(inner, maskId) {
  return `<svg viewBox="0 0 100 100" width="100%" height="100%">${inner}</svg>`
    .replace(/MASKID/g, maskId);
}

/* 1. Ромашка — девять узких лепестков, как у крупных цветов сайта */
function daisy(id) {
  const petals = Array.from({ length: 9 }, (_, i) => {
    const angle = (360 / 9) * i;
    return `<ellipse cx="50" cy="24" rx="14" ry="24" transform="rotate(${angle} 50 50)"/>`;
  }).join("");

  return wrap(
    `<mask id="MASKID"><rect width="100" height="100" fill="#fff"/>
       <circle cx="50" cy="50" r="13" fill="#000"/></mask>
     <g fill="currentColor" mask="url(#MASKID)">
       ${petals}<circle cx="50" cy="50" r="26"/>
     </g>`,
    id
  );
}

/* 2. Круглый цветок — пять широких лепестков */
function bloom(id) {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const angle = (360 / 5) * i;
    return `<circle cx="50" cy="26" r="21" transform="rotate(${angle} 50 50)"/>`;
  }).join("");

  return wrap(
    `<mask id="MASKID"><rect width="100" height="100" fill="#fff"/>
       <circle cx="50" cy="50" r="11" fill="#000"/></mask>
     <g fill="currentColor" mask="url(#MASKID)">
       ${petals}<circle cx="50" cy="50" r="22"/>
     </g>`,
    id
  );
}

/* 3. Клевер — четыре лепестка-сердечка */
function clover(id) {
  const petals = Array.from({ length: 4 }, (_, i) => {
    const angle = 90 * i;
    return `<path d="M50 50 C 34 40, 34 18, 50 22 C 66 18, 66 40, 50 50z"
              transform="rotate(${angle} 50 50)"/>`;
  }).join("");

  return wrap(`<g fill="currentColor">${petals}</g>`, id);
}

/* 4. Один лепесток — вытянутая капля */
function petal(id) {
  return wrap(
    `<path fill="currentColor"
       d="M50 6 C 74 26, 82 54, 64 80 C 56 92, 44 92, 36 80 C 18 54, 26 26, 50 6z"/>`,
    id
  );
}

/* 5. Звёздочка — мелкий цветок с шестью острыми лепестками */
function star(id) {
  const petals = Array.from({ length: 6 }, (_, i) => {
    const angle = 60 * i;
    return `<path d="M50 50 L44 20 Q50 8 56 20 Z" transform="rotate(${angle} 50 50)"/>`;
  }).join("");

  return wrap(
    `<g fill="currentColor">${petals}<circle cx="50" cy="50" r="10"/></g>`,
    id
  );
}

/* Список всех форм. Цветы в футере берут их по очереди. */
export const SHAPES = [daisy, bloom, clover, petal, star];
