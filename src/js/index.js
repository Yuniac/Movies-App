// those two imports are required to make async functions work with parcel;
// import { search } from "core-js/fn/symbol";
import "core-js/stable";
import "regenerator-runtime/runtime";

import { togglePopups } from "./helpers"

// TODO remove this function: 
export const log = console.log;

// the api link structure
const apiKey = "?api_key=abb107c96224ec174a429b41fa17acda";

const moviesApiURL = "https://api.themoviedb.org/3/movie/";
const tvShowsApiURL = "https://api.themoviedb.org/3/tv/";
const nowPlayingApiUrl = "https://api.themoviedb.org/3/movie/now_playing"
const discoverMovieApiUrl = " https://api.themoviedb.org/3/discover/movie"

const imgURL = "https://image.tmdb.org/t/p/";
const linkToAMovieUsingItsID = "https://www.themoviedb.org/movie/";

const nowPlayingContainerElement = document.querySelector("#now-playing-container");

// get random movies
// const randomMovies = "https://api.themoviedb.org/3/discover/movie";

// fetch(randomMovies + apiKey).then(res => res.json()).then(res => console.log(res))

// get random movie/tvshow of the day;

// this function returns an array of 20 now in theatres movies;
let arrayToPreventDuplicatesMovies = [];
let randomMovie;

function makeInTheaterNowMovies() {
    let nowPlayingMoviesApiUrl = nowPlayingApiUrl + apiKey;
    fetch(nowPlayingMoviesApiUrl)
        .then(res => res.json())
        .then(jsonArray => {
            // whats going on here is that we are picking a random movie from the 'now playing' movies array which has about 20 movies;
            // then to prevent getting duplicates we are putting this movie in an array for comparison later.
            // then we are making another random number which represents different movie and making sure it doesn't already exist in 'arrayToPreventDuplicatesMovies' array (if it does, roll another random movie within range) and finally, we shift() (since shift removes the first element in an array, and since we are pushing new stuff, the older item in the array will have index of 0 so shift() removes it) the old movie and use the new one we just pushed to the array, thus never having two duplicates numbers/movies;
            function randomNumber() {
                let i = Math.floor(Math.random() * jsonArray.results.length);
                randomMovie = i;
            }
            randomNumber();

            function preventDuplicates() {
                if (arrayToPreventDuplicatesMovies.indexOf(randomMovie) === -1) {
                    arrayToPreventDuplicatesMovies.push(randomMovie)
                } else {
                    randomNumber();
                    preventDuplicates();
                }
                if (arrayToPreventDuplicatesMovies.length >= 2) {
                    arrayToPreventDuplicatesMovies.shift();
                }
            }
            preventDuplicates();
            let selectedMovie = jsonArray.results[arrayToPreventDuplicatesMovies[0]];
            if (selectedMovie.backdrop_path !== null || selectedMovie !== undefined) {
                makeHTMLMoviesContainers("now-playing__movie", "now-playing__overlay-css", nowPlayingContainerElement, false, selectedMovie)
            }
        })
        .catch(() => makeInTheaterNowMovies());
}

// ============================================================================================================================================================= // 

// this function will will make and return a backdrop or a poster image link for a given movie/tv show based on its id;
function makeMediaImg(imgSize, imgPath) {
    let backgroundImgURL = imgURL + imgSize + imgPath
    return backgroundImgURL
}

// storing the genres locally to save us a fetch call, its highly unlikely the api we are using is going to change how their genres work;
const allGenres = [{ "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" }, { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "TV Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western" }]

// this function will make and return the genres and the html needed for the them;
function makeGenres(movieGenresArray) {
    let genresElement = document.createElement("span");
    // if no genres;
    if (!movieGenresArray.length) {
        genresElement.textContent = "Unknown Genre"
        return genresElement
    }

    // if it has a known genre, we are going to show only two genres from its list;
    movieGenresArray = movieGenresArray.slice(0, 2)

    allGenres.forEach(oneOfTheAllgenres => {
        movieGenresArray.forEach(incomingGenre => {
            incomingGenre === oneOfTheAllgenres.id ? genresElement.textContent += oneOfTheAllgenres.name + ", " : null
        });

    });
    // remove the extra comma and space in case there are extra;
    genresElement.textContent = genresElement.textContent.slice(0, -2)
    return genresElement
}


// make and return the rating number and the html needed for the rating element;
// rating = 'vote_average';
function makeRating(rating) {
    let ratingElementContainer = document.createElement("p");
    let ratingElement = document.createElement("span");
    ratingElementContainer.classList.add("rating-css");
    if (rating) {
        // we only want to show the first digit in the rating, no floating rating numbers;
        // rating comes as a number;
        let ratingString = String(rating)
            // check its length, if it has two digits or more (which is the case with floating numbers ratings like: 7.1) then remove everything but the first number.
            // we made the number a string earlier so we can work with it;
        ratingString > 1 ? ratingElement.textContent = ratingString.slice(0, 1) : null
    } else {
        ratingElement.textContent = "N/A"
    }
    ratingElementContainer.append(ratingElement)
    return ratingElementContainer;
}

// ============================================================================================================================================================= // 

// this function will create and append a fitting div for each movie based on its arguments;
function makeHTMLMoviesContainers(containerCss, adjacentContinerCss, whereToAppendElement, poster = true, movie) {
    let containerElement = document.createElement("div");
    containerElement.classList.add(containerCss);

    let adjcentContainer = document.createElement("div");
    adjcentContainer.classList.add(adjacentContinerCss);

    containerElement.append(adjcentContainer);
    // is it a movie poster? or one with backdrop? (backdrop ones are the 'in theatre movies' ones on top of the page), if its a poster it needs a different css/elements;
    if (poster) {
        if (movie.poster_path !== null) {
            let backgroundImageLink = makeMediaImg("w780", movie.poster_path);
            let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";
            containerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
        } else {
            let backgroundImageFallSafeElement = document.createElement("div");
            backgroundImageFallSafeElement.classList.add("movie-container__background-img-fall-safe")
            let noBackgroundText = document.createElement("p");
            noBackgroundText.textContent = "No Poster 404";
            backgroundImageFallSafeElement.append(noBackgroundText);

            containerElement.append(backgroundImageFallSafeElement);
        }

        let movieLinkElement = document.createElement("a");
        movieLinkElement.href = linkToAMovieUsingItsID + movie.id;
        movieLinkElement.textContent = movie.title

        let movieNameElementContainer = document.createElement("div");
        let movieNameElement = document.createElement("h4");
        movieNameElement.append(movieLinkElement);
        movieNameElementContainer.append(movieNameElement);
        movieNameElementContainer.append(makeRating(movie.vote_average))
        movieNameElementContainer.classList.add("rating-container");

        let movieDetailsElement = document.createElement("p");
        // release date;
        let releaseDateElement = document.createElement("span");
        if (movie.release_date.length) {
            releaseDateElement.textContent = movie.release_date.slice(0, 4) + " / ";
        } else {
            releaseDateElement.textContent = "Unkown Release Date"
        }
        movieDetailsElement.append(releaseDateElement);
        // genres
        movieDetailsElement.append(makeGenres(movie.genre_ids))

        adjcentContainer.append(movieDetailsElement);
        adjcentContainer.append(movieNameElementContainer)
    } else {
        let backgroundImageLink = makeMediaImg("w1280", movie.backdrop_path);
        let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";

        containerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
        let movieLinkElement = document.createElement("a");
        movieLinkElement.href = linkToAMovieUsingItsID + movie.id;
        movieLinkElement.textContent = movie.title


        let movieNameElement = document.createElement("h4");
        movieNameElement.append(movieLinkElement);

        adjcentContainer.append(movieNameElement)
    }
    whereToAppendElement.append(containerElement);
}

// the landing-page/discover/sort-by-parameters movies;
const landingPageElement = document.querySelector("#landing-page");

// update the drop down menus values, I could have added this with the next sibiling function which uses the same values to fetch new movies but it proved more complicated/annoying than i thought it would be so i ended up splitting them in two separate functions;
function updateLandingPageMoviesFilters(el, elTargetToUpdate) {
    const valuesList = document.querySelectorAll(el);
    const spanToShowCurrentValue = document.querySelector(elTargetToUpdate);

    // handle updating the values visually and getting new movies accordingly;
    valuesList.forEach(li => {
        li.addEventListener("click", () => {
            spanToShowCurrentValue.textContent = li.textContent;
            spanToShowCurrentValue.dataset.parameter = li.dataset.value
            landingPageElement.innerHTML = "";
            makeLandingPageMoviesBasadOnParameters(1)
            togglePopups();
        })
    });
}
updateLandingPageMoviesFilters(".sort-value", "#sort-by-placeholder", ".drop-down-current-value")
updateLandingPageMoviesFilters(".ratings-value", "#ratings-placeholder", ".drop-down-current-value")

// fetch the landing page movies and make the html needed for them;
function makeLandingPageMovies(properties = "popularity.desc", rating = "vote_count.desc", specificYear, pageNumber = 1) {
    const sortBy = "&sort_by=";
    const andSymbol = "&";
    const page = "page="
    let discoverMoviesFetchUrl = discoverMovieApiUrl + apiKey + sortBy + properties + andSymbol + rating + andSymbol + specificYear + andSymbol + page + pageNumber;
    fetch(discoverMoviesFetchUrl)
        .then(res => res.json())
        .then(json => {
            json.results.forEach(movie => {
                makeHTMLMoviesContainers("movie-container", "movie-container__description-css", landingPageElement, true, movie);
            })
        }).catch((e) => console.log(e))
}


// load more content upon scrolling;
const main = document.querySelector("main");
let loadMoreThreshold = 1200;
main.addEventListener("scroll", () => {
    // we need a helper function to request a different page. if we call the same function that built the initial movies for us then we are going to rebuild the samve movies over and over;
    if (main.scrollTop + loadMoreThreshold > (main.scrollHeight - main.offsetHeight)) loadMoreContent();

})

// pageNumber is which page should the api response with, now it returns the first page (page number 1) by default but after scrolling, if we don't change the page number we will get the same movies over and over;
let pageNumber = 2;

function loadMoreContent() {
    pageNumber++
    makeLandingPageMoviesBasadOnParameters(pageNumber)
}

// change what movies being shown in the landing page based on the parameters which we take from the dropdown menus;
function makeLandingPageMoviesBasadOnParameters(pageNumber = 1) {
    // fetch movies based on the queries from the filters menus;
    const fetchParameter = document.querySelectorAll("[data-parameter]");
    const [sortBy, rating, year] = fetchParameter
    makeLandingPageMovies(sortBy.dataset.parameter, rating.dataset.parameter, year.dataset.parameter, pageNumber)
        // reset the year parameter
    year.dataset.parameter = "";
};

// show only movies based on a certian year;
let textInput = document.querySelector("#sort-byy-period");
let clearFiltersButton = document.querySelector("#clear-filters-button");

function filterLandingPageMoviesBasedOnYear() {
    textInput.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            let year = this.value
            if (this.value === "") {
                clearFiltersButton.classList.remove("clear-filters-button__visible")
                this.classList.add("warn-incorrect-query");
                setTimeout(() => {
                    this.classList.remove("warn-incorrect-query")
                }, 1500);
            } else {
                clearFiltersButton.classList.add("clear-filters-button__visible")
                this.dataset.parameter = "primary_release_year=" + year
                this.value = "";
                landingPageElement.innerHTML = "";
                makeLandingPageMoviesBasadOnParameters(1)
            }
        }
    })
}
filterLandingPageMoviesBasedOnYear()


// // build in theaters movies, currently only shows 2 therefor we calling this function twice;
for (let i = 0; i < 2; i++) makeInTheaterNowMovies();

// create landing page movies;
makeLandingPageMovies()

// ============================================================================================================================================================= // 

// search functions;

const searchInput = document.querySelector("#search-field");
const form = document.querySelector("#search-form");
let searchQuery;

searchInput.addEventListener("change", () => {
    searchQuery = searchInput.value;
    log(searchQuery)
})

































// function getMediaOfTheDay(mediaKindApi, mediaKind) {
//     let randomID = Math.floor(Math.random() * 10000) + 1;
//     let urlToFetch = mediaKindApi + randomID + apiKey
//     fetch(urlToFetch)
//         .then(res => {
//             if (res.ok) {
//                 return res.json()
//             } else {
//                 getMediaOfTheDay()
//             }
//         })
//         .then(json => {
//             if (json.backdrop_path === null) {
//                 // movie with this random id doesn't exist, roll again;
//                 getMediaOfTheDay();
//             } else {
//                 mediaKind === "movie" ? buildTodaysMovie(json) : buildTodaysTvShow(json);
//                 // TODO deal with the console errors
//                 // console.clear() 
//             }
//         }).catch((e) => {
//      
//             // getMediaOfTheDay()
//         })
// }

// // One function could have done the work, both fetching movie of the day and tv show of the day but, unfortunately, the api I'm using returns 'name' for tv shows and 'title' for movies when returing their names, so we are going to need two functions to handle each media kind;

// // if its a movie we have to get its title, if its a tv show we have to get its name, thats how the api works;
// function buildTodaysMovie(json) {
//     // let posterPath = json.backdrop_path
//     // makePosterImg("w500", posterPath)
//    
// }

// function buildTodaysTvShow(json) {
//     // let posterPath = json.backdrop_path
//     // makePosterImg("w500", posterPath)
//    
// }

// function makeMediaOfTheDay() {
//     getMediaOfTheDay(moviesApiURL, "movie");
//     getMediaOfTheDay(tvShowsApiURL, "tvshow");
// };

// makeMediaOfTheDay()