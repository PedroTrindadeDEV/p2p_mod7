// MODELO DE DATOS

let mis_peliculas_iniciales = [
  {
    titulo: "Superlópez",
    director: "Javier Ruiz Caldera",
    miniatura: "files/superlopez.png",
  },
  {
    titulo: "Jurassic Park",
    director: "Steven Spielberg",
    miniatura: "files/jurassicpark.png",
  },
  {
    titulo: "Interstellar",
    director: "Christopher Nolan",
    miniatura: "files/interstellar.png",
  },
];

let mis_peliculas = [];

const postAPI = async (peliculas) => {
  try {
    const res = await fetch("https://myjson.dit.upm.es/api/bins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(peliculas),
    });
    const { uri } = await res.json();
    return uri;
  } catch (err) {
    alert("No se ha podido crear el endpoint.");
  }
};
const getAPI = async () => {
  // Completar: Llamar a la API para leer la información guardada en myjson a través de la API
  try {
    const res = await fetch(localStorage.URL);
    return res.json();
  } catch (e) {
    alert("No se ha podido recuperar la información.");
  }
};
const updateAPI = async (peliculas) => {
  // Completar: Actualizar la información a través de la API
  try {
    await fetch(localStorage.URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(peliculas),
    });
  } catch (e) {
    alert("Ha ocurrido un error.");
    return;
  }
};

// VISTAS

const indexView = (peliculas) => {
  let i = 0;
  let view = "";

  while (i < peliculas.length) {
    view += `
        <div class="movie">
           <div class="movie-img">
                <img class="show" data-my-id="${i}" src="${
      peliculas[i].miniatura
    }" onerror="this.src='files/placeholder.png'"/>
           </div>
           <div class="title">
               ${peliculas[i].titulo || "<em>Sin título</em>"}
           </div>
           <div class="actions">
           <button class="show" data-my-id="${i}">Ver</button>
           <button class="edit" data-my-id="${i}">editar</button>
               <button class="delete" data-my-id="${i}">Borrar</button>
            </div>
        </div>\n`;
    i = i + 1;
  }

  view += `<div class="actions">
                <!--Insertar aquí botones de "Añadir" y "Reset"-->
                <button class="new">Añadir</button>
                <button class="reset">Reset</button>
            </div>`;

  return view;
};

const editView = (i, pelicula) => {
  return `<h2>Editar Película </h2>
        <div class="field">
        Título <br>
        <input  type="text" id="titulo" placeholder="Título" 
                value="${pelicula.titulo}">
        </div>
        <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director" 
                value="${pelicula.director}">
        </div>
        <div class="field">
        Miniatura <br>
        <input  type="text" id="miniatura" placeholder="URL de la miniatura" 
                value="${pelicula.miniatura}">
        </div>
        <div class="actions">
            <button class="update" data-my-id="${i}">
                Actualizar
            </button>
            <button class="index">
                Volver
            </button>
       `;
};

const showView = (pelicula) => {
  // Completar: genera HTML con información de la película
  // ...

  return `
     <p>La película <b> ${pelicula.titulo}</b> fue dirigida por <b> ${pelicula.director}</b></p>
     <div class="actions">
        <button class="index">Volver</button>
     </div>`;
};

const newView = () => {
  // Completar: genera formulario para crear nuevo quiz
  // ...

  return `<h2>Crear Película</h2>
  <div class="field">
  Título<br>
  <input type="text" id="titulo" placeholder="Título">
  </div>
  <div class="field">
  Director<br>
  <input type="text" id="director" placeholder="Director">
  </div>
  <div class="field">
  Miniatura<br>
  <input type="text" id="miniatura" placeholder="URL de la miniatura">
  </div>
        <div class="actions">
        <button class="create">Crear</button>
            <button class="index">Volver</button>
        </div>`;
};

// CONTROLADORES

const initContr = async () => {
  if (!localStorage.URL || localStorage.URL === "undefined") {
    localStorage.URL = await postAPI(mis_peliculas_iniciales);
  }
  indexContr();
};

const indexContr = async () => {
  mis_peliculas = (await getAPI()) || [];
  document.getElementById("main").innerHTML = await indexView(mis_peliculas);
};

const showContr = (i) => {
  // Completar: controlador que muestra la vista showView()
  document.getElementById("main").innerHTML = showView(mis_peliculas[i]);
};

const newContr = () => {
  // Completar: controlador que muestra la vista newView()
  document.getElementById("main").innerHTML = newView();
};

const createContr = async () => {
  // Completar: controlador que crea una película nueva en el modelo guardado en myjson
  let n_titulo = document.getElementById("titulo").value;
  let n_director = document.getElementById("director").value;
  let n_miniatura = document.getElementById("miniatura").value;
  mis_peliculas.push({
    titulo: n_titulo,
    director: n_director,
    miniatura: n_miniatura,
  });
  await updateAPI(mis_peliculas);
  indexContr();
};

const editContr = (i) => {
  document.getElementById("main").innerHTML = editView(i, mis_peliculas[i]);
};

const updateContr = async (i) => {
  mis_peliculas[i].titulo = document.getElementById("titulo").value;
  mis_peliculas[i].director = document.getElementById("director").value;
  mis_peliculas[i].miniatura = document.getElementById("miniatura").value;
  await updateAPI(mis_peliculas);
  indexContr();
};

const deleteContr = async (i) => {
  // Completar:  controlador que actualiza el modelo borrando la película seleccionada
  // Genera diálogo de confirmación: botón Aceptar devuelve true, Cancel false
  if (confirm(`¿Quieres borrar ${mis_peliculas[i].titulo}?`)) {
    mis_peliculas.splice(i, 1); // elimina elemente i del array
    await updateAPI(mis_peliculas);
    await indexContr();
  }
};

const resetContr = async () => {
  // Completar:  controlador que reinicia el modelo guardado en myjson con las películas originales
  mis_peliculas = [...mis_peliculas_iniciales];
  await updateAPI(mis_peliculas);
  await indexContr();
};

// ROUTER de eventos
const matchEvent = (ev, sel) => ev.target.matches(sel);
const myId = (ev) => Number(ev.target.dataset.myId);

document.addEventListener("click", (ev) => {
  if (matchEvent(ev, ".index")) indexContr();
  else if (matchEvent(ev, ".show")) showContr(myId(ev));
  else if (matchEvent(ev, ".new")) newContr();
  else if (matchEvent(ev, ".create")) createContr();
  else if (matchEvent(ev, ".edit")) editContr(myId(ev));
  else if (matchEvent(ev, ".update")) updateContr(myId(ev));
  else if (matchEvent(ev, ".delete")) deleteContr(myId(ev));
  else if (matchEvent(ev, ".reset")) resetContr();
});

// Inicialización
document.addEventListener("DOMContentLoaded", initContr);
