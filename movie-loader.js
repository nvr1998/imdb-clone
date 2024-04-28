document.addEventListener("DOMContentLoaded", function () {
  let recent_saved_movie = localStorage.getItem("recent_saved_movie");
  console.log("Loading " + recent_saved_movie);
  const api_url_data = "https://www.omdbapi.com/?apikey=";
  const api_key = "18aa86a";
  const searchParams = {
    i: recent_saved_movie,
  };
  const queryString = new URLSearchParams(searchParams).toString();
  const final_url = api_url_data + `${api_key}&${queryString}`;
  fetch(final_url)
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((data) => {
      LoadMovie(data);
    })
    .catch((err) => {
      console.log("The error message is " + err);
    });

  function LoadMovie(data) {
    const body = document.querySelector("body");
    body.style.backgroundImage = `url(${data["Poster"]})`;

    const moviePage = document.querySelector(".movie-details-container");
    moviePage.classList.toggle("disabled");
    const poster = document.getElementById("poster");
    poster.style.backgroundImage = `url(${data["Poster"]})`;

    const movieName = document.getElementById("movie-name");
    movieName.innerText = data["Title"];

    const movieRunTime = document.getElementById("movie-run-time");
    movieRunTime.innerText = data["Runtime"];

    const movieRating = document.getElementById("movie-rating");
    movieRating.innerText = data["imdbRating"];

    const plotTexts = document.querySelectorAll(".plot");

    for (const plotText of plotTexts) {
      plotText.innerText = data["Plot"];
    }
  }
});
