const DEFAULT_HORIZON_DAYS = 7;

const themePresets = {
  default: {
    accent: '#f0b323',
    accentSoft: 'rgba(240,179,35,.20)',
    background: "url('images/default-cinema.svg')"
  },
  jungle: {
    accent: '#f2c94c',
    accentSoft: 'rgba(62,168,92,.20)',
    background: "linear-gradient(120deg, rgba(1,26,20,.30), rgba(18,77,46,.26)), radial-gradient(circle at 72% 18%, rgba(34,197,94,.38), transparent 34%), linear-gradient(145deg, #021712, #0e3b2b 48%, #082018)"
  },
  blue: {
    accent: '#58c8ff',
    accentSoft: 'rgba(50,137,255,.20)',
    background: "radial-gradient(circle at 70% 22%, rgba(52,152,219,.42), transparent 30%), linear-gradient(145deg, #041421, #0b3151 48%, #07131b)"
  },
  red: {
    accent: '#ef5a43',
    accentSoft: 'rgba(239,90,67,.17)',
    background: "radial-gradient(circle at 72% 20%, rgba(239,90,67,.28), transparent 30%), linear-gradient(145deg, #120909, #33100c 48%, #090707)"
  },
  amber: {
    accent: '#f5bf38',
    accentSoft: 'rgba(245,191,56,.17)',
    background: "radial-gradient(circle at 72% 18%, rgba(245,191,56,.34), transparent 32%), linear-gradient(145deg, #171006, #4a3210 48%, #0b0905)"
  }
};

function parseLocalDateTime(date, time) {
  return new Date(`${date}T${time}:00`);
}

function formatPolishDate(date) {
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function setCssTheme(theme, backgroundPath) {
  const card = document.getElementById('cinemaCard');
  const preset = themePresets[theme] || themePresets.default;
  document.documentElement.style.setProperty('--accent', preset.accent);
  document.documentElement.style.setProperty('--accent-soft', preset.accentSoft);

  if (backgroundPath) {
    card.style.setProperty('--bg-image', `linear-gradient(90deg, rgba(0,8,12,.20), rgba(0,8,12,.08)), url('${backgroundPath}')`);
  } else {
    card.style.setProperty('--bg-image', preset.background);
  }
  card.dataset.theme = theme;
}

function chooseNextFilm(films, now, horizonDays) {
  const horizon = new Date(now.getTime() + horizonDays * 24 * 60 * 60 * 1000);

  return films
    .map(film => ({ ...film, startsAt: parseLocalDateTime(film.date, film.time) }))
    .filter(film => film.startsAt >= now && film.startsAt <= horizon)
    .sort((a, b) => a.startsAt - b.startsAt)[0] || null;
}

async function init() {
  const status = document.getElementById('themeStatus');
  const nowPlaying = document.getElementById('nowPlaying');

  try {
    const response = await fetch('data/films.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const horizonDays = Number(data.settings?.horizonDays ?? DEFAULT_HORIZON_DAYS);
    const now = new Date();
    const film = chooseNextFilm(data.films || [], now, horizonDays);

    if (!film) {
      setCssTheme('default', data.settings?.defaultBackground || null);
      nowPlaying.hidden = true;
      status.textContent = `Brak filmu w ciągu ${horizonDays} dni — tło neutralne`;
      return;
    }

    setCssTheme(film.theme || 'default', film.background || null);
    document.getElementById('nowPlayingTitle').textContent = film.title;
    document.getElementById('nowPlayingDate').textContent = formatPolishDate(film.startsAt);
    nowPlaying.hidden = false;
    status.textContent = `Motyw: ${film.title}`;
  } catch (error) {
    console.error('Nie udało się wczytać repertuaru:', error);
    setCssTheme('default');
    nowPlaying.hidden = true;
    status.textContent = 'Tło neutralne — nie udało się wczytać danych repertuaru';
  }
}

init();
