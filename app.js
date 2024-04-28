const api_url_data = "https://www.omdbapi.com/?apikey=";
const api_key = "18aa86a";

document.addEventListener("DOMContentLoaded", function () {
  const hoverDiv = document.querySelector("#category-options-button"); // The div you hover over
  const activateDiv = document.querySelector(".category-menu-items"); // The div to activate

  hoverDiv.addEventListener("mouseenter", function () {
    activateDiv.style.display = "block";
  });

  hoverDiv.addEventListener("mouseleave", function () {
    activateDiv.style.display = "none";
  });

  activateDiv.addEventListener("mouseenter", function () {
    activateDiv.style.display = "block";
  });

  activateDiv.addEventListener("mouseleave", function () {
    activateDiv.style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const reference = document.querySelector(".search-bar");
  const absoluteDiv = document.querySelector(".search-results-container");

  const matchSizeAndPosition = () => {
    const rect = reference.getBoundingClientRect();

    absoluteDiv.style.width = `${rect.width}px`;

    absoluteDiv.style.top = `${rect.top + 55}px`;
    absoluteDiv.style.left = `${rect.left}px`;
  };

  matchSizeAndPosition(); // Run on initial load

  window.addEventListener("resize", matchSizeAndPosition);
});

function CategoryOptionSelected(option) {
  const selected_option = document.getElementById("selected-option");
  var activateOptionDiv = document.querySelector(".category-menu-items");
  switch (option) {
    case 0:
      selected_option.textContent = "All";
      break;
    case 1:
      selected_option.textContent = "Movies";
      break;
    case 2:
      selected_option.textContent = "Tv Shows";
      break;
    case 3:
      selected_option.textContent = "Episodes";
      break;
  }
  activateOptionDiv.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.getElementById("search-box");
  searchBox.addEventListener("input", (event) => {
    let matchingResults = ReturnAllMatchingSearches(event.target.value);
    if (matchingResults.length > 0) {
      LoadResults(matchingResults);
    } else {
      FetchData(event.target.value);
    }
  });
});

let controller = new AbortController();
function FetchData(serchval) {
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();
  const signal = controller.signal;

  const results = document.querySelector(".results");
  results.innerHTML = "";
  const searchIndicator = document.querySelector(".initial-loading-indicator");
  searchIndicator.style.display = "flex";

  const testParams = {
    s: serchval,
  };

  const queryString = new URLSearchParams(testParams).toString();
  const final_url = api_url_data + `${api_key}&${queryString}`;

  fetch(final_url, { signal })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      if (data["Response"] === "True") {
        searchIndicator.style.display = "none";
        UpdateResults(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

let loadedSearchResults = new Map();
let firstSearchResult = "";

function UpdateResults(data) {
  loadedSearchResults.clear();
  firstSearchResult = "";
  if (data["Response"] === "True") {
    const searchArray = data["Search"];
    firstSearchResult =
      data["Search"].length > 0 ? data["Search"][0]["imdbID"] : "";
    for (let result of searchArray) {
      loadedSearchResults.set(result["Title"], result);
    }
  }
  LoadResults(Array.from(loadedSearchResults.keys()));
}
function ReturnAllMatchingSearches(searchval) {
  let matchingResults = [];
  let loadedSearchNames = Array.from(loadedSearchResults.keys());
  for (let i = 0; i < loadedSearchNames.length; i++) {
    let current = loadedSearchNames[i].toLowerCase();
    if (current.startsWith(searchval)) {
      matchingResults.push(loadedSearchNames[i]);
    }
  }
  return matchingResults;
}

function LoadResults(titles) {
  const results = document.querySelector(".results");
  results.innerHTML = "";
  for (let title of titles) {
    let result = loadedSearchResults.get(title);
    LoadResult(
      result["Title"],
      result["Year"],
      result["Type"],
      result["Poster"],
      result["imdbID"]
    );
  }
}

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

function LoadResult(title, years, genre, img_src, imdbID) {
  if (img_src.includes("N/A")) {
    img_src = "";
  }
  const results = document.querySelector(".results");
  const result = ` <div data-id="${imdbID}" onclick="LoadTitlePage(this)" class="search-result-container">
  <div class="result-img">
    <img src="${img_src}" alt="" />
  </div>
  <div class="result-data-text">
    <div class="result-name">${title}</div>
    <div class="result-year">${years}</div>
    <div class="result-genre">${genre}</div>
  </div>
  <div onclick="ToggleFavButtonClicked(this,event,'${imdbID}')" data-id="${imdbID}" id="fav-button-${imdbID}" class="fav-btn-container material-icon-parent">
    <span
      class="material-icons-round"
    >
      favorite_border
    </span>
  </div>
</div>`;

  setTimeout(() => {
    const fav_button = document.getElementById("fav-button-" + imdbID);
    SetFavButtonStatus(fav_button, imdbID);
  }, 10);

  results.insertAdjacentHTML("beforeend", result);
}

// Loading Page

document.addEventListener("DOMContentLoaded", function () {
  const search_box = document.getElementById("search-box");
  const categoryMenuItems = document.querySelector(".category-menu-items");
  const search_results_container = document.querySelector(
    ".search-results-container"
  );
  search_box.addEventListener("focus", (event) => {
    categoryMenuItems.style.display = "none";
    ChangeSearchContainerVisibility(event);
  });

  search_box.addEventListener("input", function (event) {
    ChangeSearchContainerVisibility(event);
    let matchingResults = ReturnAllMatchingSearches(event.target.value);
    if (matchingResults.length > 0) {
      LoadResults(matchingResults);
    } else {
      FetchData(event.target.value);
    }
  });

  function ChangeSearchContainerVisibility(event) {
    if (event.target.value.length > 1) {
      search_results_container.style.display = "block";
    } else {
      search_results_container.style.display = "none";
    }
  }
  document.addEventListener("click", function (event) {
    if (
      !search_box.contains(event.target) &&
      !search_results_container.contains(event.target)
    ) {
      search_results_container.style.display = "none";
    }
  });
});

function ToggleFavButtonHover(target) {
  if (target.textContent.includes("favorite_border")) {
    target.textContent = "favorite";
    target.style.color = "#fc0339";
  } else {
    target.textContent = "favorite_border";
    target.style.color = "grey";
  }
}

function SetFavButtonStatus(target, imdbID) {
  let status = my_favourites.has(imdbID);
  if (status) {
    target.querySelector("span").textContent = "favorite";
    target.querySelector("span").style.color = "#fc0339";
  } else {
    target.querySelector("span").textContent = "favorite_border";
    target.querySelector("span").style.color = "grey";
  }
}

function ToggleFavButtonClicked(target, event, imdbID) {
  event.stopPropagation();
  console.log(imdbID);
  if (my_favourites.has(imdbID)) {
    my_favourites.delete(imdbID);
  } else {
    my_favourites.add(imdbID);
  }
  let id = target.dataset.id;
  SetFavButtonStatus(target, id);
  save_myfavs();
}

document.addEventListener("DOMContentLoaded", function () {
  const search_box = document.getElementById("search-box");
  search_box.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      SearchClicked();
    }
  });
});

function SearchClicked() {
  const search_box = document.getElementById("search-box");
  const search_results_container = document.querySelector(
    ".search-results-container"
  );
  search_box.value = "";
  search_results_container.style.display = "none";
  if (firstSearchResult.length > 2) LoadMovieDetailsPage(firstSearchResult);
}

function LoadTitlePage(target) {
  const search_box = document.getElementById("search-box");
  const search_results_container = document.querySelector(
    ".search-results-container"
  );
  search_box.value = "";
  search_results_container.style.display = "none";
  console.log(`Loading Page With Title ${target.dataset.id}`);
  LoadMovieDetailsPage(target.dataset.id);
}

let preloadedTopPicksLists = {
  "breaking-bad": {
    name: "Breaking Bad",
    poster: "breaking-bad.jpg",
    rating: "9.5",
    imdbID: "tt0903747",
  },
  "bettr-call-saul": {
    name: "Better Call Saul",
    poster: "better-call-saul.jpg",
    rating: "9.0",
    imdbID: "tt3032476",
  },
  "fall-out": {
    name: "Fallout",
    poster: "fall-out.jpg",
    rating: "8.7",
    imdbID: "tt12637874",
  },
  dune: {
    name: "Dune",
    poster: "dune.jpg",
    rating: "8.0",
    imdbID: "tt1160419",
  },
  "i-robot": {
    name: "I, Robot",
    poster: "i-robot.jpg",
    rating: "7.1",
    imdbID: "tt0343818",
  },
};
let preloadedFanFavLists = {
  "a-beautiful-mind": {
    name: "A Beautiful Mind",
    poster: "a-beatiful-mind.jpg",
    rating: "8.2",
    imdbID: "tt0268978",
  },
  inception: {
    name: "Inception",
    poster: "inception.jpg",
    rating: "8.8",
    imdbID: "tt1375666",
  },
  "batman-rises": {
    name: "Batman-Rises",
    poster: "batman-rises.jpg",
    rating: "8.4",
    imdbID: "tt1345836",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Object.keys(preloadedTopPicksLists).forEach((key) => {
    AddMovieInList(preloadedTopPicksLists, key, "top-pics-list");
  });
  Object.keys(preloadedFanFavLists).forEach((key) => {
    AddMovieInList(preloadedFanFavLists, key, "fan-fav-list");
  });
});

function AddMovieInList(preloaded, movie_id, sectionID) {
  const movieName = preloaded[movie_id].name;
  const movieRatings = preloaded[movie_id].rating;
  const poster = preloaded[movie_id].poster;
  const imdbID = preloaded[movie_id].imdbID;

  const movie_list_container = document.querySelector(
    `#${sectionID} .movie-list`
  );
  const movie_container = `<div data-id="${imdbID}" class="movie-container">
  <div onclick="LoadMovieDetailsPage('${imdbID}')" class="poster" style="background-image: url(${poster})"></div>
  <div class="movie-details">
    <h3 onclick="LoadMovieDetailsPage('${imdbID}')" class="movie-name">${movieName}</h3>
    <div class="movie-rating">
      <span class="material-icons-round"> star </span>
      <span id="movie-rating">${movieRatings}</span>
    </div>
  </div>
</div>`;
  movie_list_container.insertAdjacentHTML("beforeend", movie_container);
}

function LoadMovieDetailsPage(imdbID) {
  if (imdbID.length > 0) {
    localStorage.setItem("recent_saved_movie", imdbID);
    window.location.href = "movie-details.html";
  }
}

function LoadMyFavPage() {
  window.location.href = "favouries-page.html";
}
