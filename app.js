let purchased = false;

client.auth.getUser().then(({ data }) => {
  if (!data.user) window.location.href = "login.html";
});

async function logout() {
  await client.auth.signOut();
  window.location.href = "login.html";
}

function openModal(callback) {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  window.movieCallback = callback;
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function subscribe() {
  purchased = true;
  closeModal();
  if (typeof window.movieCallback === "function") window.movieCallback();
}

async function loadMovies() {
  const movies = [
    { title: "Sample Movie", file: "poster1.jpg", video: "sample.mp4" }
  ];

  const container = document.getElementById("movieContainer");
  for (const mv of movies) {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="assets/${mv.file}" alt="${mv.title}" />
      <h3>${mv.title}</h3>
    `;
    card.onclick = async () => {
      if (!purchased) return openModal(async () => showVideo(card, mv.video));
      showVideo(card, mv.video);
    };
    container.appendChild(card);
  }
}

async function showVideo(card, videoFile) {
  const { data, error } = await client.storage.from("movies").createSignedUrl(videoFile, 3600);
  if (error) return alert("Error loading video");
  card.innerHTML += `<video controls autoplay src="${data.signedUrl}"></video>`;
}

loadMovies();
