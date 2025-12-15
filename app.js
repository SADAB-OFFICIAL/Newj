const API="/api/proxy?url=";
const BASE="https://netvlyx.pages.dev";

const moviesBox=document.getElementById("movies");
const modal=document.getElementById("modal");
const movieTitle=document.getElementById("movieTitle");
const qualitiesBox=document.getElementById("qualities");
const serversBox=document.getElementById("servers");
const finalBox=document.getElementById("final");

/* FORCE HIDE ON LOAD */
modal.style.display="none";
modal.classList.add("hide");

function apiFetch(url){
  return fetch(API+encodeURIComponent(url))
    .then(r=>{
      if(!r.ok)throw new Error("API Failed");
      return r.json();
    });
}

function driveId(url){return url.split("/").pop()}

/* LOAD HOME */
apiFetch(BASE+"/api/scrape")
  .then(data=>{
    if(!data||!data.movies)return;
    data.movies.forEach(m=>{
      const card=document.createElement("div");
      card.className="card";
      card.innerHTML=`<img src="${m.poster}"><p>${m.title}</p>`;
      card.onclick=()=>openMovie(m);
      moviesBox.appendChild(card);
    })
  })
  .catch(err=>{
    console.error(err);
    moviesBox.innerHTML="<p style='text-align:center;color:gray'>Failed to load movies</p>";
  });

/* OPEN MOVIE */
function openMovie(m){
  modal.classList.remove("hide");
  modal.style.display="flex";
  movieTitle.innerText=m.title;
  qualitiesBox.innerHTML=""; serversBox.innerHTML=""; finalBox.innerHTML="";

  apiFetch(BASE+"/api/m4ulinks-scraper?url="+m.link).then(data=>{
    data.linkData.forEach(q=>{
      const btn=document.createElement("button");
      btn.innerText=q.quality;
      btn.onclick=()=>showServers(q.links);
      qualitiesBox.appendChild(btn);
    })
  }).catch(e=>console.error(e));
}

/* SHOW SERVERS */
function showServers(list){
  serversBox.innerHTML="";
  finalBox.innerHTML="";
  list.forEach(s=>{
    const btn=document.createElement("button");
    btn.innerText=s.name;
    btn.onclick=()=>handleServer(s);
    serversBox.appendChild(btn);
  })
}

/* HANDLE SERVER */
function handleServer(server){
  if(server.name.toLowerCase()==="download links"){
    apiFetch(BASE+"/api/nextdrive-scraper?link="+server.url).then(d=>{
      serversBox.innerHTML="";
      d.movie.servers.forEach(r=>{
        const btn=document.createElement("button");
        btn.innerText=r.name;
        btn.onclick=()=>resolveFinal(r.url);
        serversBox.appendChild(btn);
      })
    }).catch(e=>console.error(e));
  }else resolveFinal(server.url);
}

/* FINAL LINKS */
function resolveFinal(url){
  finalBox.innerHTML="";
  apiFetch(BASE+"/api/nextdrive-scraper?driveid="+driveId(url)).then(d=>{
    d.movie.servers.forEach(f=>{
      const a=document.createElement("a");
      a.href=f.url;
      a.target="_blank";
      a.innerText=f.url;
      finalBox.appendChild(a);
    })
  }).catch(e=>console.error(e));
}

function closeModal(){
  modal.classList.add("hide");
  modal.style.display="none";
}
