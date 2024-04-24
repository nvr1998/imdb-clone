const api_url_data = "http://www.omdbapi.com/?apikey=";
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
    .catch((err) => {});
}

let loadedSearchResults = new Map();

function UpdateResults(data) {
  loadedSearchResults.clear();
  if (data["Response"] === "True") {
    const searchArray = data["Search"];
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
      result["Poster"]
    );
  }
}

function LoadResult(title, years, genre, img_src) {
  const results = document.querySelector(".results");
  const result = ` <div class="search-result-container">
  <div class="result-img">
    <img src="${img_src}" alt="" />
  </div>
  <div class="result-data-text">
    <div class="result-name">${title}</div>
    <div class="result-year">${years}</div>
    <div class="result-genre">${genre}</div>
  </div>
  <div class="fav-btn-container material-icon-parent">
    <span
      onmouseenter="ToggleFavButton(this)"
      onmouseleave="ToggleFavButton(this)"
      class="material-icons-round"
    >
      favorite_border
    </span>
  </div>
</div>`;
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

function ToggleFavButton(target) {
  if (target.textContent.includes("favorite_border")) {
    target.textContent = "favorite";
    target.style.color = "#fc0339";
  } else {
    target.textContent = "favorite_border";
    target.style.color = "grey";
  }
}
