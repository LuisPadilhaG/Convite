// ============================================================
// PERSONALIZE AQUI: fotos, músicas e textos do seu convite.
// Deixe os arquivos na mesma pasta de index.html.
// ============================================================

// Troque os nomes abaixo pelos nomes EXATOS dos seus arquivos.
// Exemplo: { src: "foto1.jpg", alt: "Nosso passeio" }
const photos = [
  { src: "Foto1.jpeg", alt: "Nossa lembrança 1" },
  { src: "Foto2.jpeg", alt: "Nossa lembrança 2" },
  { src: "Foto3.jpeg", alt: "Nossa lembrança 3" },
  { src: "Foto4.jpeg", alt: "Nossa lembrança 4" },
  { src: "Foto5.jpeg", alt: "Nossa lembrança 5" }
];

// Use arquivos MP3 (ou formatos suportados pelo navegador).
// Exemplo: { title: "A Thousand Years", artist: "Christina Perri", src: "musica1.mp3" }
const songs = [
  { title: "Nossa música 1", artist: "Artista", src: "Musica1.mp3" },
  { title: "Nossa música 2", artist: "Artista", src: "Musica2.mp3" },
  { title: "Nossa música 3", artist: "Artista", src: "Musica3.mp3" }
];

// Textos fáceis de personalizar
const quoteText = "Com você, tudo faz mais sentido.";
const noButtonMessages = ["Tem certeza? 🥺", "Pensa mais um pouquinho!", "Essa opção não vale 😅", "Tenta clicar no Sim! ♡"];

const photoSlides = document.getElementById("photo-slides");
const photoIndicators = document.getElementById("photo-indicators");

function renderPhotos() {
  photoSlides.innerHTML = "";
  photoIndicators.innerHTML = "";
  photos.forEach((photo, index) => {
    const slide = document.createElement("div");
    slide.className = `carousel-item${index === 0 ? " active" : ""}`;
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt || `Foto ${index + 1}`;
    img.onerror = () => {
      slide.innerHTML = `<div class="photo-placeholder"><strong>♡ Sua foto ${index + 1} vai aparecer aqui ♡</strong><span>Adicione o arquivo <b>${photo.src}</b> à pasta do site.</span></div>`;
    };
    slide.appendChild(img);
    photoSlides.appendChild(slide);

    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.setAttribute("data-bs-target", "#photoCarousel");
    indicator.setAttribute("data-bs-slide-to", String(index));
    indicator.setAttribute("aria-label", `Ir para foto ${index + 1}`);
    if (index === 0) {
      indicator.className = "active";
      indicator.setAttribute("aria-current", "true");
    }
    photoIndicators.appendChild(indicator);
  });
}
renderPhotos();

// Player de música
const audio = document.getElementById("audio-player");
const titleEl = document.getElementById("track-title");
const artistEl = document.getElementById("track-artist");
const playButton = document.getElementById("play-pause");
const progress = document.getElementById("music-progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist");
let currentSong = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}
function renderPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const button = document.createElement("button");
    button.className = `track-chip${index === currentSong ? " active" : ""}`;
    button.type = "button";
    button.textContent = `${index + 1}. ${song.title}`;
    button.addEventListener("click", () => loadSong(index, true));
    playlistEl.appendChild(button);
  });
}
function loadSong(index, autoplay = false) {
  if (!songs.length) return;
  currentSong = (index + songs.length) % songs.length;
  const song = songs[currentSong];
  audio.src = song.src;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist || "Nossa playlist";
  progress.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  renderPlaylist();
  if (autoplay) {
    audio.play().then(() => playButton.textContent = "Ⅱ").catch(() => {
      playButton.textContent = "▶";
      alert("Não foi possível reproduzir. Confira se o arquivo existe e tente novamente.");
    });
  } else {
    playButton.textContent = "▶";
  }
}
playButton.addEventListener("click", () => {
  if (!songs.length) return;
  if (!audio.src) loadSong(currentSong);
  if (audio.paused) {
    audio.play().then(() => playButton.textContent = "Ⅱ").catch(() => {
      alert("Confira se o arquivo de música está na mesma pasta e se o nome está correto.");
    });
  } else {
    audio.pause();
    playButton.textContent = "▶";
  }
});
document.getElementById("prev-track").addEventListener("click", () => loadSong(currentSong - 1, true));
document.getElementById("next-track").addEventListener("click", () => loadSong(currentSong + 1, true));
audio.addEventListener("timeupdate", () => {
  if (audio.duration) progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("loadedmetadata", () => durationEl.textContent = formatTime(audio.duration));
audio.addEventListener("ended", () => loadSong(currentSong + 1, true));
audio.addEventListener("play", () => playButton.textContent = "Ⅱ");
audio.addEventListener("pause", () => playButton.textContent = "▶");
progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
});
if (songs.length) loadSong(0);
else {
  titleEl.textContent = "Adicione suas músicas no script.js";
  artistEl.textContent = "Os arquivos devem ficar na pasta do site";
}

// Botão "Não": foge do ponteiro sem sair da área visível.
const noButton = document.getElementById("no-button");
let noMessageIndex = 0;
function moveNoButton() {
  const margin = 12;
  const buttonRect = noButton.getBoundingClientRect();
  const maxX = Math.max(margin, window.innerWidth - buttonRect.width - margin);
  const maxY = Math.max(margin, window.innerHeight - buttonRect.height - margin);
  const x = margin + Math.random() * (maxX - margin);
  const y = margin + Math.random() * (maxY - margin);
  noButton.style.position = "fixed";
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
  noButton.style.zIndex = "1050";
  noButton.textContent = noButtonMessages[noMessageIndex % noButtonMessages.length];
  noMessageIndex++;
}
noButton.addEventListener("mouseenter", moveNoButton);
noButton.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
}, { passive: false });
noButton.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

// Resposta "Sim" abre o modal do Bootstrap.
document.getElementById("yes-button").addEventListener("click", () => {
  const modal = new bootstrap.Modal(document.getElementById("loveModal"));
  modal.show();
});

// Corações discretos flutuando ao fundo.
const heartsLayer = document.getElementById("hearts-layer");
function createHeart() {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 20}px`;
  const duration = 9 + Math.random() * 9;
  heart.style.animationDuration = `${duration}s`;
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}
for (let i = 0; i < 10; i++) setTimeout(createHeart, i * 450);
setInterval(createHeart, 1200);
