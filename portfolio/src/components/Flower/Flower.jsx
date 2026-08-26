/* ============================================================
   ЦВЕТОК
   ============================================================
   Цветок нарисован кодом (SVG), а не картинкой. Благодаря этому
   он остаётся чётким на любом экране, красится в любой цвет
   и не тормозит сайт.

   Как пользоваться:
   <Flower color="#f5352a" size={120} />

   color — цвет лепестков
   size  — размер в пикселях
   ============================================================ */

// Форма ромашки: 9 лепестков по кругу + дырка в центре.
// Лепесток рисуется один раз, остальные — его копии, повёрнутые
// вокруг центра. Так фигура получается ровной.
const PETAL_COUNT = 9;

export default function Flower({
  color = "var(--flower-red)",
  size = 100,
  className = "",
  style = {},
  ...rest
}) {
  // Считаем угол поворота для каждого лепестка: 360° делим на количество
  const petals = Array.from({ length: PETAL_COUNT }, (_, i) => {
    const angle = (360 / PETAL_COUNT) * i;
    return (
      <ellipse
        key={i}
        cx="50"
        cy="24"
        rx="14"
        ry="24"
        // rotate(угол, центрX, центрY) — поворот вокруг середины цветка
        transform={`rotate(${angle} 50 50)`}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"   /* декоративный элемент — программы чтения его пропускают */
      focusable="false"
      {...rest}
    >
      {/* mask вырезает белый кружок в середине цветка */}
      <mask id={`hole-${size}-${String(color).replace(/\W/g, "")}`}>
        <rect width="100" height="100" fill="white" />
        <circle cx="50" cy="50" r="13" fill="black" />
      </mask>

      <g
        fill={color}
        mask={`url(#hole-${size}-${String(color).replace(/\W/g, "")})`}
      >
        {petals}
        {/* серединка, чтобы лепестки соединялись в цельную фигуру */}
        <circle cx="50" cy="50" r="26" />
      </g>
    </svg>
  );
}
