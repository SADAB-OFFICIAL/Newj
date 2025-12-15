const API = "/api/proxy?url=";
const BASE = "https://netvlyx.pages.dev";

const moviesBox = document.getElementById("movies");
const modal = document.getElementById("modal");
const movieTitle = document.getElementById("movieTitle");
const qualitiesBox = document.getElementById("qualities");
const serversBox = document.getElementById("servers");
const finalBox = document.getElementById("final");

function apiFetch(url) {
  return fetch(API + encodeURIComponent(url)).then(r => r.json());
}

function driveId(url) {
  return url.split("/").pop();
}

/* LOAD HOME */
apiFetch(BASE + "/api/scrape").then(data => {
  data.movies.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img src="${m.poster}"><p>${m.title}</p>`;
    card.onclick = () => openMovie(m);
    moviesBox.appendChild(card);
  });
});

/* OPEN MOVIE */
function openMovie(movie) {
  modal.classList.remove("hide");
  movieTitle.innerText = movie.title;
  qualitiesBox.innerHTML = "";
  serversBox.innerHTML = "";
  finalBox.innerHTML = "";

  apiFetch(BASE + "/api/m4ulinks-scraper?url=" + movie.link).then(data => {
    data.linkData.forEach(q => {
      const btn = document.createElement("button");
      btn.innerText = q.quality;
      btn.onclick = () => showServers(q.links);
      qualitiesBox.appendChild(btn);
    });
  });
}

/* SHOW SERVERS */
function showServers(servers) {
  serversBox.innerHTML = "";
  finalBox.innerHTML = "";

  servers.forEach(s => {
    const btn = document.createElement("button");
    btn.innerText = s.name;
    btn.onclick = () => handleServer(s);
    serversBox.appendChild(btn);
  });
}

/* HANDLE SERVER */
function handleServer(server) {
  if (server.name.toLowerCase() === "download links") {
    apiFetch(BASE + "/api/nextdrive-scraper?link=" + server.url).then(d => {
      serversBox.innerHTML = "";
      d.movie.servers.forEach(r => {
        const btn = document.createElement("button");
        btn.innerText = r.name;
        btn.onclick = () => resolveFinal(r.url);
        serversBox.appendChild(btn);
      });
    });
  } else {
    resolveFinal(server.url);
  }
}

/* FINAL LINKS */
function resolveFinal(url) {
  finalBox.innerHTML = "";
  apiFetch(BASE + "/api/nextdrive-scraper?driveid=" + driveId(url)).then(d => {
    d.movie.servers.forEach(f => {
      const a = document.createElement("a");
      a.href = f.url;
      a.target = "_blank";
      a.innerText = f.url;
      finalBox.appendChild(a);
    });
  });
}

function closeModal() {
  modal.classList.add("hide");
}
