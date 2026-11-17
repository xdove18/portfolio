// Обратное отображение на родной сетке: только целые пиксели
// исходного спрайта, без сглаживания CSS-поворота.
export function rotateTail(source, width, height, degrees) {
  const result = new Uint8ClampedArray(source.length);
  const angle = degrees * Math.PI / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const pivotX = 69;
  const pivotY = 131;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - pivotX;
      const dy = y - pivotY;
      let sx = Math.round(pivotX + cos * dx + sin * dy);
      let sy = Math.round(pivotY - sin * dx + cos * dy);
      // Основание остаётся прикреплённым к телу, двигается кончик.
      if (x >= 69 && x <= 72 && y >= 104 && y <= 131) {
        sx = x;
        sy = y;
      }
      if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;
      const from = (sy * width + sx) * 4;
      result.set(source.subarray(from, from + 4), (y * width + x) * 4);
    }
  }
  return result;
}
