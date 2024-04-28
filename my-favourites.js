const api_url_data = "https://www.omdbapi.com/?apikey=";
const api_key = "18aa86a";

let my_favourites = load_myfavs();

function save_myfavs() {
  let arrayFromSet = Array.from(my_favourites);
  localStorage.setItem("my_favs", JSON.stringify(arrayFromSet));
}
function load_myfavs() {
  if (localStorage.getItem("my_favs")) {
    return new Set(JSON.parse(localStorage.getItem("my_favs")));
  } else {
    return new Set();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  LoadFavMovieDetails(my_favourites);
});

function LoadFavMovieDetails(imdbIDs) {
  let array = Array.from(imdbIDs);
  array.sort();
  for (let i = 0; i < array.length; i++) {
    FetchAndLoadMovie(array[i]);
  }
}

function FetchAndLoadMovie(imdbID) {
  const search_params = {
    i: imdbID,
  };

  const queryString = new URLSearchParams(search_params).toString();
  const final_url = api_url_data + `${api_key}&${queryString}`;

  fetch(final_url)
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
    })
    .then((data) => {
      LoadMovie(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function LoadMovie(movieData) {
  const movie_list_parent = document.querySelector(".movie-list");

  const movie_box = `<div  data-id="${movieData["imdbID"]}" class="movie-container">
  <div onclick="LoadMovieDetailsPage('${movieData["imdbRating"]}')" class="poster" style="background-image: url(${movieData["Poster"]})"></div>
  <div class="movie-details">
    <h3 onclick="LoadMovieDetailsPage('${movieData["imdbRating"]}')" class="movie-name">${movieData["Title"]}</h3>
    <div class="movie-rating">
      <span class="material-icons-round"> star </span>
      <span id="movie-rating">${movieData["imdbRating"]}</span>
    </div>
  </div>
  <div class="remove-fav-btn">
    <button onclick="RemoveFromFavs(this)" >Remove</button>
  </div>
</div>`;
  movie_list_parent.insertAdjacentHTML("beforeend", movie_box);
}

function LoadMovieDetailsPage(imdbID) {
  localStorage.setItem("recent_saved_movie", imdbID);
  window.location.href = "movie-details.html";
}
function RemoveFromFavs(target) {
  const itemToRemove = target.closest(".movie-container");
  let movie_id = itemToRemove.dataset.id;
  console.log(movie_id);
  my_favourites.delete(movie_id);
  save_myfavs();
  itemToRemove.remove();
}
