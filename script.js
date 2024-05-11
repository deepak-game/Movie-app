const mainContainer = document.querySelector(".main-container");
const movieContainer = document.querySelector(".movie-container");
const favMovieContainer = document.querySelector(".favorite-container");
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
const tabs = document.querySelectorAll(".tabs-container button");

let homePageData = [];
let favMovieData = [];

//Adding event listener on homepage and favorite tabs
tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    changeTabs(e.target);
    displayTabs(e.target);
  });
});

//Function to switch between homepage and favorite tabs
function changeTabs(input) {
  tabs.forEach((tab) => {
    if (tab === input) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

//Function to display homepage or favorite page movies
function displayTabs(input) {
  if (input.classList.contains("homepage-btn")) {
    //to show the favorite movies
    mainContainer.classList.remove("show");
    displayHomePageMovie();
  } else {
    //to show the homepage
    mainContainer.classList.add("show");
    displayFavoriteMovie();
  }
}

//Event listener on search field
searchInput.addEventListener("input", (e) => {
  if (e.target.value.trim()) {
    getSearchResult(e.target.value.trim());
  } else {
    homePageData = [];
    movieContainer.innerHTML = "Enter movie title to search";
  }
});

//Search Btn event Listener to clear search input field and display result
searchBtn.addEventListener("click", (e) => {
  searchInput.value = "";
});

//Dunction to get the movie data from api
async function getSearchResult(input) {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?s=${input}&apikey=68aad22e`
    );
    const data = await response.json();
    const searchResult = data.Search;
    if (searchResult) {
      //removing data from homePage to implement suggestion like result
      homePageData = [];
      searchResult.forEach((result) => {
        const { Title, Poster, Year, imdbID } = result;
        //adding movies data on homPageData array
        homePageData.push({ Title, Poster, Year, imdbID, isFav: false });
        compareMovies();
      });
      //callig to display movies on homepage
      displayHomePageMovie();
    } else {
      throw new Error("No movie found");
    }
  } catch (err) {
    movieContainer.innerHTML = err.message;
  }
}

//Function to display the according to title
function displayHomePageMovie() {
  //clearing previous movies if any, on each search input
  movieContainer.innerHTML = "";
  homePageData.forEach((result) => {
    const movie = `<div class="movie ${
      result.isFav ? "show-fav" : ""
    }" data-movie-id=${result.imdbID}>
  <div class='fav-mark'>*</div>
  <p class="movie-title">${result.Title}</p>
  <img src=${result.Poster} alt="movie-img" />
  <p class="movie-year">Year: ${result.Year}</p>
  <button class='fav-btn'>Add To Favorite</button>
  </div>`;

    //adding event listener on each movie
    movieContainer.insertAdjacentHTML("beforeend", movie);
  });

  //adding event listener on each movie of homepage
  const movies = movieContainer.querySelectorAll(".movie");
  movies.forEach((movie) => {
    movie.addEventListener("click", (e) => {
      const id = movie.getAttribute("data-movie-id");
      if (e.target.classList.contains("fav-btn")) {
        getFavMovieData(id);
      } else {
        getNewTabMovieData(id);
      }
    });
  });
}

//function to get fav movie Data
function getFavMovieData(input) {
  /* using map to remember clickable element is favorite
       by changing isFav field of movie to true
    */
  homePageData = homePageData.map((data) => {
    if (data.imdbID === input) {
      favMovieData.push(data);
      //stroing data in localStrorage
      localStorage.setItem("favMovies", JSON.stringify(favMovieData));
      return { ...data, isFav: true };
    } else {
      return { ...data };
    }
  });
  displayHomePageMovie();
}

//Function to display the favorite movie
function displayFavoriteMovie() {
  favMovieContainer.innerHTML = "";
  favMovieData.forEach((result) => {
    const movie = `<div class="movie" data-fav-movie-id=${result.imdbID}>
  <div class='fav-mark'>*</div>
  <p class="movie-title">${result.Title}</p>
  <img src=${result.Poster} alt="movie-img" />
  <p class="movie-year">Year: ${result.Year}</p>
  <button class='remove-fav-btn'>Remove Favorite</button>
  </div>`;

    //Adding event listener on each favorite movie
    favMovieContainer.insertAdjacentHTML("beforeend", movie);
    //Applying event listener on each fav movie
    const favMovies = favMovieContainer.querySelectorAll(".movie");
    favMovies.forEach((movie) => {
      movie.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-fav-btn")) {
          const parent = e.target.parentElement;
          const id = parent.getAttribute("data-fav-movie-id");
          updateFavorite(id);
        }
      });
    });
  });
}

//Function to update the favorite on removing favorite movie
function updateFavorite(id) {
  //updating homepage data with isFav field to false
  homePageData = homePageData.map((data) => {
    if (data.imdbID === id) {
      return { ...data, isFav: false };
    } else {
      return { ...data };
    }
  });

  //updating favorite page data
  favMovieData = favMovieData.filter((movie) => {
    return movie.imdbID !== id;
  });

  //displaying favorite page movie updated data
  localStorage.setItem("favMovies", JSON.stringify(favMovieData));
  displayFavoriteMovie();
}

//Function to make favorite movies persistent
function favMoviesLocalStorage() {
  const getFavMovies = JSON.parse(localStorage.getItem("favMovies"));
  if (getFavMovies) {
    favMovieData = getFavMovies;
    displayFavoriteMovie();
  }
}

//Function to show favorite on page refresh or window close
favMoviesLocalStorage();

/*Function to show movie as favorite in search result which 
already existed in favorite section*/
function compareMovies() {
  favMovieData.forEach((movie) => {
    homePageData = homePageData.map((data) => {
      if (data.imdbID === movie.imdbID) {
        return { ...data, isFav: true };
      } else {
        return { ...data };
      }
    });
  });
}

// //Function to get new tab movie data
async function getNewTabMovieData(input) {
  const response = await fetch(
    `http://www.omdbapi.com/?i=${input}&apikey=68aad22e`
  );
  const data = await response.json();
  // fecthing data for movie, open in new tab
  displayMovieInNewTab(data);
}

//Function to open movie in the new tab
function displayMovieInNewTab(input) {
  //destructuring the data
  const { Title, Poster, Year, imdbID, imdbRating, Plot } = input;
  //implementing new tab functionality
  let newTab = window.open();
  newTab.document.write(`<html>
  <head>
  <style>
  * {
    box-sizing: border-box;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color:  #bf00ff;
  }

  .movie-nt {
    width: 400px;
    height: 500px;
    position: relative;
    box-shadow: 0 0 10px rgba(0,0,0,0.6);
    padding: 30px;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 300px;
  }

  .movie-title-nt {
    text-align: center;
    color: #fff;
    font-size: 20px;
    width: 100%;
    height: 30px;
    padding: 0;
  }

  .movie-details-nt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
  }

  .movie-details-nt span{
    color: #fff;
  }

  .movie-plot-nt {
    position: absolute;
    bottom: -20px;
    right: 0;
    left: 0;
    padding: 30px;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    background-color: rgba(0,0,0,0.7);
    max-height: 100%;
    text-align: justify-content;
    transform: translateY(125%);
    overflow-y: auto;
    transition: transform 0.5s ease-in;
  }

  .movie-nt:hover .movie-plot-nt {
     transform: translateY(0%);
  }
  </style>
  </head>
  <body>
  <div class="movie-nt" data-fav-movie-id=${imdbID} target="_blank">
  <p class="movie-title-nt">${Title}</p>
  <img src=${Poster} alt="movie-img" />
  <div class='movie-details-nt'>
  <p class="movie-year-nt">Year: <span>${Year}</span></p>
  <p class='movie-rating-nt'>Rating: <span>${imdbRating}</span></p>
  </div>
  <p class='movie-plot-nt'>${!Plot.length ? "No plot info" : Plot}</p>
  </div>
  <script>
  <script>
  </body>
  </html>`);
}
