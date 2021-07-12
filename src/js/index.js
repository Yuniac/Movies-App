// those two imports are required to make async functions work with parcel;
import "core-js/stable";
import "regenerator-runtime/runtime";

import { togglePopups } from "./helpers"

// TODO remove this function: 
export const log = console.log;

// for fetching data and working with the api;
// the api link structure
const apiKey = "?api_key=abb107c96224ec174a429b41fa17acda";

const moviesApiURL = "https://api.themoviedb.org/3/movie/";
const tvShowsApiURL = "https://api.themoviedb.org/3/tv/";
const nowPlayingApiUrl = "https://api.themoviedb.org/3/movie/now_playing"
const discoverMovieApiUrl = " https://api.themoviedb.org/3/discover/movie"

let movieID;
const linkToMovieUsingID = "https://www.themoviedb.org/movie/";
const imgURL = "https://image.tmdb.org/t/p/";
// html element
const nowPlayingContainerElement = document.querySelector("#now-playing-container");

// makePosterImg(250, "w500")


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
            // whats going on here is that we are picking a random movie from the 'now playing' movies array which has about 20 movies, after that, to prevent getting duplicates we are putting this movie in an array and using it, after that we are making another random number which is another different movie and making sure it doesn't already exist in 'arrayToPreventDuplicatesMovies' array (if it does, roll another random movie in range again) and then, we remove the old movie and use the new one we just pushed to the array, thus never having two duplicates numbers/movies;
            function randomNumber() {
                let i = Math.floor(Math.random() * jsonArray.results.length) + 1;
                randomMovie = i;
            }
            randomNumber()
            if (arrayToPreventDuplicatesMovies.indexOf(randomMovie) === -1) {
                arrayToPreventDuplicatesMovies.push(randomMovie)
            } else {
                randomNumber();
            }
            if (arrayToPreventDuplicatesMovies.length >= 2) {
                arrayToPreventDuplicatesMovies.shift();
            }
            let selectedMovie = jsonArray.results[arrayToPreventDuplicatesMovies[0]];
            if (selectedMovie.backdrop_path === null || selectedMovie === undefined) {
                // this movie doesn't have a poster image or it doesn't exist, its unlikely given we are working with new/in theatres movies but just in case and if so, refetch;
                makeInTheaterNowMovies();
                log("this ran")
            } else {
                makeHTMLMoviesContainers("now-playing__movie", "now-playing__overlay-css", nowPlayingContainerElement, false, selectedMovie)
            }
        }).catch(e => console.log(e));
}


function makeHTMLMoviesContainers(wrapperCss, overlayCss, whereToAppendElement, poster = true, movie) {
    let containerElement = makeDivsElements(wrapperCss, overlayCss, movie);
    if (poster) {
        let backgroundImageLink = makeMediaImg("w1280", movie.poster_path);
        let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";

        containerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
    } else {
        let backgroundImageLink = makeMediaImg("w1280", movie.backdrop_path);
        let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";

        containerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
    }
    whereToAppendElement.append(containerElement);
}


// this function will create a div based on its arguments to contain a movie;
function makeDivsElements(wrapperCss, overlayCss, movie) {
    let wrapper = document.createElement("div");
    wrapper.classList.add(wrapperCss);

    let overlayDiv = document.createElement("div");
    overlayDiv.classList.add(overlayCss);

    let movieLink = document.createElement("a");
    movieLink.href = linkToMovieUsingID + movie.id;
    movieLink.textContent = movie.title

    let movieNameElement = document.createElement("h4");
    movieNameElement.append(movieLink);

    overlayDiv.append(movieNameElement)
    wrapper.append(overlayDiv)
    return wrapper;
}


// this function will create a backdrop image for a given movie/tv show based on its id;
function makeMediaImg(imgSize, imgPath) {
    let backgroundImgURL = imgURL + imgSize + imgPath
    return backgroundImgURL
}



// build in theaters movies, currently only shows 2 therefor we calling this function twice;
for (let i = 0; i < 2; i++) makeInTheaterNowMovies()


// the landing page/discover/sort by parameters movies;
const sortBy = "&sort_by="
const andSymbol = "&"
const landingPageElement = document.querySelector("#landing-page");

function makeLandingPageMovies(properties, rating, specificYear) {
    let discoverMoviesFetchUrl = discoverMovieApiUrl + apiKey + sortBy + properties + andSymbol + rating + andSymbol + specificYear;
    fetch(discoverMoviesFetchUrl)
        .then(res => res.json())
        .then(json => {
            log(json)
            json.results.forEach(movie => {
                makeHTMLMoviesContainers("movie-container", "movie-container__overlay-css", landingPageElement, true, movie);
            })
        })
}

function filterLandingPageMovies(el, elTargetToUpdate, fetchParametersValue) {
    const valuesList = document.querySelectorAll(el);
    const spanToShowCurrentValue = document.querySelector(elTargetToUpdate);

    // fetch movies based on the queries from the filters menus;
    const fetchParameter = document.querySelectorAll(fetchParametersValue);
    const [sortBy, rating, year] = fetchParameter
    // log(year)

    // handle updating the values visually;
    valuesList.forEach(li => {
        li.addEventListener("click", () => {
            // send the values from each sorting field as a query in our fetch request;
            landingPageElement.innerHTML = "";
            makeLandingPageMovies(sortBy.dataset.parameter, rating.dataset.parameter, year.dataset.parameter)
            spanToShowCurrentValue.textContent = li.textContent;
            spanToShowCurrentValue.dataset.parameter = li.dataset.value
            togglePopups();
        })
    });

    let textInput = document.querySelector("#sort-byy-period");
    textInput.addEventListener("keyup", (e) => {
        e.key === "Enter" ? makeLandingPageMovies(sortBy.dataset.parameter, rating.dataset.parameter, year.dataset.parameter) : null
        textInput.value === "" ? textInput.dataset.parameter = "year=2021" : textInput.dataset.parameter = `year=${textInput.value}`
    })

    // build movies upon loading;
    makeLandingPageMovies(sortBy.dataset.parameter, rating.dataset.parameter, year.dataset.parameter)
}


filterLandingPageMovies(".sort-value", "#sort-by-placeholder", ".drop-down-current-value")
filterLandingPageMovies(".ratings-value", "#ratings-placeholder", ".drop-down-current-value")


// const testDataSet = document.querySelector("#test");
// log(testDataSet.dataset.value)






































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
//             // log(e)
//             // getMediaOfTheDay()
//         })
// }

// // One function could have done the work, both fetching movie of the day and tv show of the day but, unfortunately, the api I'm using returns 'name' for tv shows and 'title' for movies when returing their names, so we are going to need two functions to handle each media kind;

// // if its a movie we have to get its title, if its a tv show we have to get its name, thats how the api works;
// function buildTodaysMovie(json) {
//     // let posterPath = json.backdrop_path
//     // makePosterImg("w500", posterPath)
//     log(json.title)
// }

// function buildTodaysTvShow(json) {
//     // let posterPath = json.backdrop_path
//     // makePosterImg("w500", posterPath)
//     log(json.name);
// }

// function makeMediaOfTheDay() {
//     getMediaOfTheDay(moviesApiURL, "movie");
//     getMediaOfTheDay(tvShowsApiURL, "tvshow");
// };

// makeMediaOfTheDay()