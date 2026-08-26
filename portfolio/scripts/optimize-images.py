# -*- coding: utf-8 -*-
"""
ПЕРЕЖАТИЕ КАРТИНОК ДЛЯ САЙТА

Запуск из папки portfolio:

    npm run images

Что делает:
1. Находит в public/images все файлы PNG и JPG.
2. Переводит их в формат WebP — выглядит так же, весит
   в 6-9 раз меньше. Прозрачность сохраняется.
3. Рядом создаёт папку thumb/ с уменьшенными копиями —
   их показывает галерея, а полные открываются по клику.
4. Исходные PNG и JPG удаляет, чтобы не занимали место.

Оригиналы в папках «кейс 1», «кейс 2», «кейс 3» на рабочем
столе НЕ трогаются — они остаются целыми.

Требуется библиотека Pillow. Если её нет, установите один раз:
    python -m pip install Pillow
"""

import os
import sys

try:
    from PIL import Image
except ImportError:
    print("Не найдена библиотека Pillow.")
    print("Установите её командой:  python -m pip install Pillow")
    sys.exit(1)

Image.MAX_IMAGE_PIXELS = None

# ---------- НАСТРОЙКИ ----------
QUALITY_FULL = 92    # качество полных версий (текст остаётся чётким)
QUALITY_THUMB = 84   # качество уменьшенных копий
THUMB_WIDTH = 560    # ширина уменьшенной копии, в пикселях
MAX_WIDTH = 1400     # больше этого полные версии не нужны
PHOTO_MAX_HEIGHT = 1000  # для фотографий (не скриншотов)

HERE = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(os.path.dirname(HERE), "public", "images")


def convert(path, make_thumb=True, max_width=MAX_WIDTH, max_height=None,
            quality=QUALITY_FULL):
    """Переводит один файл в WebP и при необходимости делает превью."""
    im = Image.open(path)
    has_alpha = im.mode in ("RGBA", "LA")
    im = im.convert("RGBA" if has_alpha else "RGB")

    if max_height and im.height > max_height:
        im = im.resize(
            (round(im.width * max_height / im.height), max_height),
            Image.LANCZOS,
        )
    if max_width and im.width > max_width:
        im = im.resize(
            (max_width, round(im.height * max_width / im.width)),
            Image.LANCZOS,
        )

    before = os.path.getsize(path)
    target = os.path.splitext(path)[0] + ".webp"
    im.save(target, "WEBP", quality=quality, method=6)
    after = os.path.getsize(target)

    if make_thumb and im.width > THUMB_WIDTH:
        folder = os.path.join(os.path.dirname(path), "thumb")
        os.makedirs(folder, exist_ok=True)
        small = im.resize(
            (THUMB_WIDTH, round(im.height * THUMB_WIDTH / im.width)),
            Image.LANCZOS,
        )
        small.save(
            os.path.join(folder, os.path.basename(target)),
            "WEBP",
            quality=QUALITY_THUMB,
            method=6,
        )

    if path.lower() != target.lower():
        os.remove(path)

    return before, after


def main():
    if not os.path.isdir(IMAGES):
        print("Не найдена папка public/images")
        return

    total_before = total_after = count = 0

    for root, dirs, files in os.walk(IMAGES):
        # в саму папку thumb не заходим — там уже готовые копии
        if os.path.basename(root) == "thumb":
            continue

        for name in sorted(files):
            if not name.lower().endswith((".png", ".jpg", ".jpeg")):
                continue

            path = os.path.join(root, name)

            # логотипам конкурентов превью не нужно — они и так мелкие
            is_small = name.startswith("logo-") or root == IMAGES

            before, after = convert(
                path,
                make_thumb=not is_small,
                max_height=PHOTO_MAX_HEIGHT if name.startswith("me") else None,
            )

            total_before += before
            total_after += after
            count += 1
            print(f"  {name}  {before // 1024} КБ -> {after // 1024} КБ")

    if count == 0:
        print("Новых картинок не нашлось — всё уже пережато.")
    else:
        mb = lambda b: round(b / 1024 / 1024, 1)
        print(f"\nГотово: {count} файлов, {mb(total_before)} МБ -> {mb(total_after)} МБ")


if __name__ == "__main__":
    main()
