const api_url_data = "http://www.omdbapi.com/?apikey=";
const api_key = "18aa86a";

let loadedSearchNames = [];

document.addEventListener("DOMContentLoaded", function () {
  var hoverDiv = document.querySelector("#category-options-button"); // The div you hover over
  var activateDiv = document.querySelector(".category-menu-items"); // The div to activate

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
  console.log("DOM LOADED");
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

  const searchIndicator = document.getElementById("search-indicator");

  const testParams = {
    s: serchval,
  };

  const queryString = new URLSearchParams(testParams).toString();
  const final_url = api_url_data + `${api_key}&${queryString}`;
  searchIndicator.innerText = "Searching";
  fetch(final_url, { signal })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      searchIndicator.innerText = "Searching Complete";
      UpdateResults(data);
    })
    .catch((err) => {
      searchIndicator.innerText = "";
      console.log(err);
    });
}

function UpdateResults(data) {
  const results = document.getElementById("results");
  loadedSearchNames = [];
  results.innerText = "";
  if (data["Response"] === "True") {
    const searchArray = data["Search"];
    for (let result of searchArray) {
      loadedSearchNames.push(result["Title"]);
      const listItem = `<li>${result["Title"]}</li>`;
      results.insertAdjacentHTML("beforeend", listItem);
    }
  }
}
function ReturnAllMatchingSearches(searchval) {
  let matchingResults = [];

  for (let i = 0; i < loadedSearchNames.length; i++) {
    let current = loadedSearchNames[i].toLowerCase();
    if (current.startsWith(searchval)) {
      matchingResults.push(loadedSearchNames[i]);
    }
  }
  return matchingResults;
}

function LoadResults(searchResults) {
  for (let result of searchResults) {
    // Load with result
  }
}
