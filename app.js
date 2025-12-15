const movies = [
  {
    title:"Jawan",
    poster:"https://image.tmdb.org/t/p/w500/6k6X8JqzY2w0b0Yz.jpg",
    qualities:["480p","720p","1080p"]
  },
  {
    title:"Animal",
    poster:"https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    qualities:["720p","1080p"]
  }
];

const grid = document.getElementById("movies");
const modal = document.getElementById("modal");
const qualitiesBox = document.getElementById("qualities");
const serversBox = document.getElementById("servers");
const titleBox = document.getElementById("mTitle");

movies.forEach(m=>{
  const c=document.createElement("div");
  c.className="card";
  c.innerHTML=`<img src="${m.poster}"><p>${m.title}</p>`;
  c.onclick=()=>openMovie(m);
  grid.appendChild(c);
});

function openMovie(movie){
  modal.classList.remove("hidden");
  titleBox.innerText=movie.title;
  qualitiesBox.innerHTML="<h3>Quality</h3>";
  serversBox.innerHTML="";
  movie.qualities.forEach(q=>{
    let b=document.createElement("button");
    b.innerText=q;
    b.onclick=()=>showServers();
    qualitiesBox.appendChild(b);
  });
}

function showServers(){
  serversBox.innerHTML="<h3>Servers</h3>";
  ["HubCloud","GDFlix","Drive"].forEach(s=>{
    let b=document.createElement("button");
    b.innerText=s;
    b.onclick=()=>alert("Connect backend here");
    serversBox.appendChild(b);
  });
}

function closeModal(){
  modal.classList.add("hidden");
}
