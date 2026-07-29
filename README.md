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
- `images/` – zdjęcia sali kinowej i tła filmów.

## Neutralne tło sali kinowej

W momencie, gdy nie ma filmu w ustawionym horyzoncie czasowym, moduł przełącza się na rotację trzech zdjęć sali. W katalogu `images/` muszą znajdować się dokładnie te pliki:

- `kino zdjecie 1.png`
- `kino zdjecie 2.png`
- `kino zdjecie 3.png`

Zdjęcia zmieniają się automatycznie co 30 sekund z delikatnym przejściem. Nazwy i częstotliwość można zmienić w `data/films.json`.

## Tła filmów

Docelowe obrazy filmów należy umieszczać w katalogu `images/` i wskazywać ich ścieżkę w `data/films.json`. Jeśli obraz filmu nie istnieje, moduł pozostaje przy zdjęciach sali kinowej i nadal pokazuje informację o najbliższym seansie.

## Podgląd

Można wymusić neutralne tło przez dopisanie do adresu:

`?preview=cinema`

Dla filmów można używać ich `slug`, np. `?preview=ainbo`.

## GitHub Pages

Po włączeniu GitHub Pages dla gałęzi `main` i katalogu głównego repozytorium moduł będzie dostępny jako zwykła statyczna strona HTML.
