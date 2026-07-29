# Kino pod repertuarem

Interaktywny moduł informacyjny dla strony Kina „Za Rogiem” w Szklarskiej Porębie.

## Założenia

- stały układ informacji: ceny biletów, godziny seansów, wynajem kina, imprezy okolicznościowe i kontakt,
- prawdziwy klikalny przycisk **BILETY** prowadzący do Ekobilet,
- tło i akcent kolorystyczny zmieniają się automatycznie zależnie od najbliższego / aktualnego filmu,
- po zakończeniu seansu moduł przechodzi do następnego filmu,
- jeśli nie ma filmu w ustawionym horyzoncie czasowym, wraca neutralne tło sali kinowej,
- całość jest responsywna i przeznaczona do osadzenia pod repertuarem na stronie MOKSiAL.

## Pliki

- `index.html` – układ modułu,
- `style.css` – wygląd i responsywność,
- `script.js` – automatyczna zmiana tła,
- `data/films.json` – repertuar i ustawienia motywów,
- `images/default-cinema.svg` – neutralne tło awaryjne / bez filmu.

## Tła filmów

Docelowe obrazy należy umieszczać w katalogu `images/` i wskazywać ich ścieżkę w `data/films.json`. Jeśli obraz filmu nie istnieje, moduł użyje przypisanego do filmu gradientu kolorystycznego.

## GitHub Pages

Po włączeniu GitHub Pages dla gałęzi `main` i katalogu głównego repozytorium moduł będzie dostępny jako zwykła statyczna strona HTML.
