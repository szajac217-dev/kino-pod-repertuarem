const DEFAULT_HORIZON_DAYS = 7;
const DEFAULT_DURATION_MINUTES = 150;

const themePresets = {
  default: {
    accent: '#f0b323',
    accentSoft: 'rgba(240,179,35,.20)',
    background: "url('images/default-cinema.svg')"
  },
  jungle: {
    accent: '#f2c94c',
    accentSoft: 'rgba(62,168,92,.22)',
    background: "radial-gradient(circle at 78% 18%, rgba(34,197,94,.42), transparent 32%), linear-gradient(145deg, #021712, #0e3b2b 48%, #082018)"
  },
  blue: {
    accent: '#58c8ff',
    accentSoft: 'rgba(50,137,255,.22)',
    background: "radial-gradient(circle at 76% 20%, rgba(52,152,219,.42), transparent 30%), linear-gradient(145deg, #041421, #0b3151 48%, #07131b)"
  },
  red: {
    accent: '#ef5a43',
    accentSoft: 'rgba(239,90,67,.20)',
    background: "radial-gradient(circle at 76% 18%, rgba(239,90,67,.32), transparent 30%), linear-gradient(145deg, #120909, #33100c 48%, #090707)"
  },
  amber: {
    accent: '#f5bf38',
    accentSoft: 'rgba(245,191,56,.20)',
    background: "radial-gradient(circle at 76% 18%, rgba(245,191,56,.36), transparent 32%), linear-gradient(145deg, #171006, #4a3210 48%, #0b0905)"
  },
  prehistoric: {
    accent: '#d6db32',
    accentSoft: 'rgba(128,160,52,.22)',
    background: "radial-gradient(circle at 76% 18%, rgba(116,143,47,.40), transparent 34%), linear-gradient(145deg, #081007, #2f4215 48%, #0b1007)"
  }
};

function parseLocalDateTime(date, time) {
  return new Date(`${date}T${time}:00`);
}

function prepareFilm(film) {
  const startsAt = parseLocalDateTime(film.date, film.time);
  const durationMinutes = Number(film.durationMinutes || DEFAULT_DURATION_MINUTES);
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60000);
  return { ...film, startsAt, endsAt, durationMinutes };
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
  card.style.setProperty('--bg-image', backgroundPath ? `url('${backgroundPath}')` : preset.background);
  card.dataset.theme = theme;
}

function chooseFilm(films, now, horizonDays) {
  const prepared = films.map(prepareFilm).sort((a, b) => a.startsAt - b.startsAt);

  const active = prepared.find(film => film.startsAt <= now && film.endsAt > now);
  if (active) return { film: active, state: 'active' };

  const horizon = new Date(now.getTime() + horizonDays * 86400000);
  const next = prepared.find(film => film.startsAt > now && film.startsAt <= horizon);
  if (next) return { film: next, state: 'upcoming' };

  return { film: null, state: 'none' };
}

function preloadBackground(path) {
  if (!path) return Promise.resolve(false);

  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = path;
  });
}

function getPreviewRequest() {
  const params = new URLSearchParams(window.location.search);
  const preview = params.get('preview');
  return preview ? preview.trim() : null;
}

function getPreviewFilm(films, preview) {
  if (!preview) return null;

  return films
    .map(prepareFilm)
    .find(film => film.slug === preview || film.theme === preview || film.title.toLowerCase().includes(preview.toLowerCase())) || null;
}

async function showNeutral(data, horizonDays, previewMode = false) {
  const status = document.getElementById('themeStatus');
  const nowPlaying = document.getElementById('nowPlaying');
  const defaultBg = data.settings?.defaultBackground || null;
  const exists = await preloadBackground(defaultBg);

  setCssTheme('default', exists ? defaultBg : null);
  nowPlaying.hidden = true;
  status.textContent = previewMode
    ? 'Podgląd: neutralne tło sali kinowej'
    : `Brak filmu w ciągu ${horizonDays} dni — tło sali kinowej`;
}

async function showFilm(film, state) {
  const status = document.getElementById('themeStatus');
  const nowPlaying = document.getElementById('nowPlaying');
  const imageExists = await preloadBackground(film.background);

  setCssTheme(film.theme || 'default', imageExists ? film.background : null);
  document.getElementById('nowPlayingTitle').textContent = film.title;
  document.getElementById('nowPlayingDate').textContent = formatPolishDate(film.startsAt);
  nowPlaying.querySelector('span').textContent = state === 'active' ? 'Teraz / aktualny seans' : 'Najbliższy seans';
  nowPlaying.hidden = false;

  status.textContent = imageExists
    ? `Tło: ${film.title}`
    : `Motyw kolorystyczny: ${film.title} — oczekuje na grafikę w repozytorium`;
}

async function init() {
  try {
    const response = await fetch('data/films.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const horizonDays = Number(data.settings?.horizonDays ?? DEFAULT_HORIZON_DAYS);
    const films = data.films || [];
    const preview = getPreviewRequest();

    if (preview && ['default', 'neutral', 'cinema', 'sala'].includes(preview.toLowerCase())) {
      await showNeutral(data, horizonDays, true);
      return;
    }

    const previewFilm = getPreviewFilm(films, preview);
    if (previewFilm) {
      await showFilm(previewFilm, 'upcoming');
      return;
    }

    const selection = chooseFilm(films, new Date(), horizonDays);
    if (!selection.film) {
      await showNeutral(data, horizonDays);
      return;
    }

    await showFilm(selection.film, selection.state);
  } catch (error) {
    console.error('Nie udało się wczytać repertuaru:', error);
    const nowPlaying = document.getElementById('nowPlaying');
    setCssTheme('default');
    nowPlaying.hidden = true;
    document.getElementById('themeStatus').textContent = 'Tło neutralne — sala kinowa';
  }
}

init();
