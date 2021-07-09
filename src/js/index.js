// those two imports are required to make async functions work with parcel;
import "core-js/stable";
import "regenerator-runtime/runtime";

// TODO remove this function: 
const log = console.log;

// for fetching data and working with the api;
// the api link structure
const apiKey = "?api_key=abb107c96224ec174a429b41fa17acda";

const moviesApiURL = "https://api.themoviedb.org/3/movie/";
const tvShowsApiURL = "https://api.themoviedb.org/3/tv/";
const discoverMovieApiUrl = "https://api.themoviedb.org/3/discover/movie"
const nowPlayingApiUrl = "https://api.themoviedb.org/3/movie/now_playing"

let movieID;
const imgURL = "https://image.tmdb.org/t/p/";
// html element
const nowPlayingContainerElement = document.querySelector("#now-playing-container");

// makePosterImg(250, "w500")


// get random movies
// const randomMovies = "https://api.themoviedb.org/3/discover/movie";

// fetch(randomMovies + apiKey).then(res => res.json()).then(res => console.log(res))

// get random movie/tvshow of the day;
// const nowPlayingContainerElement = document.querySelector("#now-playing");

// this function returns an array of 20 now in theatres movies;
function makeInTheaterNowMovies() {
    let urlToFetch = nowPlayingApiUrl + apiKey;

    fetch(urlToFetch)
        .then(res => res.json())
        .then(jsonArray => {
            let i = Math.floor(Math.random() * jsonArray.results.length) + 1;
            let selectedMovie = jsonArray.results[i];

            if (selectedMovie.backdrop_path === null) {
                // movie with this random id doesn't exist, roll again;
                makeInTheaterNowMovies();
            } else {
                buildNowPlayingMovies(selectedMovie)
                    // TODO deal with the console errors
                    // console.clear() 
            }
        })
}




function buildNowPlayingMovies(movie) {
    let container = document.createElement("div");

    let cssClass = "now-playing__movie";
    container.classList.add(cssClass);
    let backgroundImageLink = makeMediaImg("w500", movie.backdrop_path)
    let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')"
    log(backgroundImageLinkInCssFormat)
    container.style.backgroundImage = backgroundImageLinkInCssFormat

    nowPlayingContainerElement.append(container);

    log("build function has been called")


    // // container.style.backgroundImage = `"url('${makePosterImg("w500", json.posterPath)}')"`
    // // container.textContent = json.title
    // // log(`"url('${makePosterImg()}')"`);
}

// this function will create a poster image for a given movie/tv show based on its id;
function makeMediaImg(imgSize, imgPath) {
    let backgroundImgURL = imgURL + imgSize + imgPath
    return backgroundImgURL
}
makeInTheaterNowMovies()
makeInTheaterNowMovies()








































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

// let i = 15;
// while (i > 0) {
//     getMovieOfTheDay()
//     i--;
// }