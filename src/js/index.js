/*
    IT'S ALL ABOUT FETCHING DATA AND WORKING WITH THE DOM HERE
*/
// those two imports are required to make async functions work with parcel;

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

const baseImgUrl = "https://image.tmdb.org/t/p/";
const personImgUrl = "https://api.themoviedb.org/3/person/"

const linkToAMovieUsingItsID = "https://www.themoviedb.org/movie/";

const nowPlayingContainerElement = document.querySelector("#now-playing-container");

// this function returns an array of 20 now in theatres movies;
let arrayToPreventDuplicateMovies = [];
let randomMovie;

function makeInTheaterNowMovies() {
    let nowPlayingMoviesApiUrl = nowPlayingApiUrl + apiKey;
    fetch(nowPlayingMoviesApiUrl)
        .then(res => res.json())
        .then(jsonArray => {
            // whats going on here is that we are picking a random movie from the 'now playing' movies array which has about 20 movies;
            // then to prevent getting duplicates we are putting this movie in an array for comparison later.
            // then we are making another random number which represents different movie and making sure it doesn't already exist in 'arrayToPreventDuplicateMovies' array (if it does, roll another random movie within range) and finally, we shift() (since shift removes the first element in an array, and since we are pushing new stuff, the older item in the array will have index of 0 so shift() removes it) the old movie and use the new one we just pushed to the array, thus never having two duplicates numbers/movies;
            function randomNumber() {
                let i = Math.floor(Math.random() * jsonArray.results.length);
                randomMovie = i;
            }
            randomNumber();

            function preventDuplicates() {
                if (arrayToPreventDuplicateMovies.indexOf(randomMovie) === -1) {
                    arrayToPreventDuplicateMovies.push(randomMovie)
                } else {
                    randomNumber();
                    preventDuplicates();
                }
                if (arrayToPreventDuplicateMovies.length >= 2) {
                    arrayToPreventDuplicateMovies.shift();
                }
            }
            preventDuplicates();
            let selectedMovie = jsonArray.results[arrayToPreventDuplicateMovies[0]];
            if (selectedMovie.backdrop_path !== null || selectedMovie !== undefined) {
                makeHTMLContainers(nowPlayingContainerElement, false, "movie", selectedMovie)

            }
        })
        .catch((e) => console.log(e));
}

/*
====================================================================================================================================
*/

// this function will will make and return a backdrop or a poster image link for a given movie/tv show based on its id;
function makeMediaImg(mediaKind, imgSize, imgPath, data) {
    if (mediaKind === "movie" || mediaKind === "mini-movie") {
        let backgroundImgURL = baseImgUrl + imgSize + imgPath
        return backgroundImgURL
    }
    if (mediaKind === "tvshow") {
        return data.image.original
    }
    if (mediaKind === "celebs") {
        let backgroundImgURL = baseImgUrl + imgSize + data.profile_path
        return backgroundImgURL
    }
}

// storing the genres locally to save us a fetch call, its highly unlikely the api we are using is going to change how their genres work;
const allMoviesGenres = [{ "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" }, { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "TV Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western" }]

// this function will make and return the genres and the html needed for the them;
function makeGenres(mediaKind, data) {
    let genresElement = document.createElement("span");
    if (mediaKind === "movie") {
        // if no genres;
        if (!data.genre_ids.length) {
            genresElement.textContent = "Unknown Genre"
            return genresElement
        }
        // if it has a known genre, we are going to show only two genres from its list;
        let movieGenresArray = data.genre_ids.slice(0, 2)

        allMoviesGenres.forEach(oneOfTheAllgenres => {
            movieGenresArray.forEach(incomingGenre => {
                incomingGenre === oneOfTheAllgenres.id ? genresElement.textContent += oneOfTheAllgenres.name + ", " : null
            });

        });
        // remove the extra comma and space in case there are extra;
        genresElement.textContent = genresElement.textContent.slice(0, -2)
        return genresElement
    } else {
        if (!data.genres.length) {
            genresElement.textContent = "Unknown Genre"
            return genresElement
        }
        data.genres.forEach(genre => {
            genresElement.textContent += genre + ", "
        })
        genresElement.textContent = genresElement.textContent.slice(0, -2)
        return genresElement
    }

}

// make and return the rating number and the html needed for the rating element;
// rating = 'vote_average';
function makeRating(mediaKind, data) {
    let ratingElementContainer = document.createElement("p");
    let ratingElement = document.createElement("span");
    ratingElementContainer.classList.add("rating-css");
    if (mediaKind === "movie") {
        if (data.vote_average) {
            // we only want to show the first digit in the rating, no floating rating numbers;
            // rating comes as a number;
            let rating = Math.round(data.vote_average)
            let ratingString = String(rating)
                // check its length, if it has two digits or more (which is the case with floating numbers ratings like: 7.1) then remove everything but the first number.
                // we made the number a string earlier so we can work with it;
            ratingString > 1 ? ratingElement.textContent = ratingString.slice(0, 1) : null
        } else {
            ratingElement.textContent = "N/A"
        }
    } else if (mediaKind === "tvshow") {
        if (data.rating.average) {
            // we only want to show the first digit in the rating, no floating rating numbers;
            // rating comes as a number;
            let rating = Math.round(data.rating.average);
            let ratingString = String(rating);
            // check its length, if it has two digits or more (which is the case with floating numbers ratings like: 7.1) then remove everything but the first number.
            // we made the number a string earlier so we can work with it;
            ratingString > 1 ? ratingElement.textContent = ratingString.slice(0, 1) : null
        } else {
            ratingElement.textContent = "N/A"
        }
    } else {
        return
    }

    ratingElementContainer.append(ratingElement)
    return ratingElementContainer;
}

function makeCelebBio(data) {
    let flag = 0;
    let celebDescription = document.createElement("div");
    celebDescription.classList.add("generic-celeb-container__info");
    while (flag < 3) {
        // while flag < 3 means we are making name, career, etc., a celeb details, once we leave this loop we are going to return something different;
        let celebInfo = document.createElement("p");
        let identifierSpan = document.createElement("span");
        identifierSpan.classList.add("generic-celeb-container__identifier")
        if (flag === 0) {
            identifierSpan.textContent = "Name: ";
            celebInfo.append(identifierSpan)
            celebInfo.append(data.name)
        }
        if (flag === 1) {
            identifierSpan.textContent = "Career: ";
            celebInfo.append(identifierSpan)
            celebInfo.append(data.known_for_department)
        }
        if (flag === 2) {
            identifierSpan.textContent = "Popularity: ";
            celebInfo.append(identifierSpan)
            celebInfo.append(data.popularity)
        }
        celebDescription.append(celebInfo);
        flag++
    }
    if (data.known_for !== null) {
        celebDescription.append(makeCelebKnownForMovies(data))
    } else {
        let celebInfo = document.createElement("p");
        let identifierSpan = document.createElement("span");
        identifierSpan.classList.add("generic-celeb-container__identifier");
        identifierSpan.textContent = "Known For:";
        celebInfo.append(identifierSpan);
        celebInfo.append("N/A");
    }

    return celebDescription

}

function makeCelebKnownForMovies(data) {
    let celebIsKnownForElement = document.createElement("div");
    celebIsKnownForElement.classList.add("generic-celeb-container__mini-movies");
    let identifierParagraph = document.createElement("p");
    identifierParagraph.classList.add("generic-celeb-container__identifier")
    identifierParagraph.textContent = "Known For: "
    celebIsKnownForElement.append(identifierParagraph);
    let moviesArray = data.known_for.splice(0, 3);
    log(moviesArray);
    moviesArray.forEach(workTheyDone => {
        makeHTMLContainers(celebIsKnownForElement, true, "mini-media", workTheyDone)
    })
    return celebIsKnownForElement

}
// ============================================================================================================================================================= // 

// this function will create and append a fitting div for each movie based on its arguments;
function makeHTMLContainers(whereToAppendElement, poster = true, mediaKind, data) {
    if (mediaKind === "movie") {
        let containerElement = document.createElement("div");
        let adjcentContainer = document.createElement("div");

        containerElement.append(adjcentContainer);
        // poster vs backdrop image, different css/size, etc;
        if (poster) {
            containerElement.classList.add("generic-media-container");
            adjcentContainer.classList.add("generic-media-container__description-css");
            if (data.poster_path !== null) {
                let backgroundImageLink = makeMediaImg("movie", "w780", data.poster_path, null);
                let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";
                containerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
            } else {
                let backgroundImageFallSafeElement = document.createElement("div");
                backgroundImageFallSafeElement.classList.add("generic-media-container__background-img-fall-safe")
                let noBackgroundText = document.createElement("p");
                noBackgroundText.textContent = "No Poster 404";
                backgroundImageFallSafeElement.append(noBackgroundText);

                containerElement.append(backgroundImageFallSafeElement);
            }
            let mediaNameElementContainer = document.createElement("div");
            mediaNameElementContainer.classList.add("rating-container");

            let mediaLinkElement = document.createElement("a");
            mediaLinkElement.href = linkToAMovieUsingItsID + data.id;
            mediaLinkElement.textContent = data.title

            let mediaNameElement = document.createElement("h4");
            mediaNameElement.append(mediaLinkElement);
            mediaNameElementContainer.append(mediaNameElement);
            mediaNameElementContainer.append(makeRating("movie", data))


            let mediaDetailsElement = document.createElement("p");
            // release date;
            let releaseDateElement = document.createElement("span");
            if (data.release_date.length) {
                releaseDateElement.textContent = data.release_date.slice(0, 4) + " / ";
            } else {
                releaseDateElement.textContent = "Unkown Release Date"
            }
            mediaDetailsElement.append(releaseDateElement);
            // genres
            mediaDetailsElement.append(makeGenres(mediaKind, data))

            adjcentContainer.append(mediaDetailsElement);
            adjcentContainer.append(mediaNameElementContainer)
        } else {
            containerElement.classList.add("now-playing__movie");
            adjcentContainer.classList.add("now-playing__overlay-css");

            let backgroundImageLink = makeMediaImg("movie", "w1280", data.backdrop_path);
            let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";

            containerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
            let mediaLinkElement = document.createElement("a");
            mediaLinkElement.href = linkToAMovieUsingItsID + data.id;
            mediaLinkElement.textContent = data.title


            let mediaNameElement = document.createElement("h4");
            mediaNameElement.append(mediaLinkElement);

            adjcentContainer.append(mediaNameElement)
        }
        whereToAppendElement.append(containerElement);
    } else if (mediaKind === "tvshow") {
        let containerElement = document.createElement("div");
        let adjcentContainer = document.createElement("div");

        containerElement.append(adjcentContainer);

        containerElement.classList.add("generic-media-container");
        adjcentContainer.classList.add("generic-media-container__description-css");
        if (data.image) {
            let backgroundImageLink = makeMediaImg("tvshow", null, null, data);
            let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";
            containerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
        } else {
            let backgroundImageFallSafeElement = document.createElement("div");
            backgroundImageFallSafeElement.classList.add("generic-media-container__background-img-fall-safe")
            let noBackgroundText = document.createElement("p");
            noBackgroundText.textContent = "No Poster 404";
            backgroundImageFallSafeElement.append(noBackgroundText);

            containerElement.append(backgroundImageFallSafeElement);
        }
        let mediaNameElementContainer = document.createElement("div");
        mediaNameElementContainer.classList.add("rating-container");

        let mediaLinkElement = document.createElement("a");
        mediaLinkElement.href = data.url
        mediaLinkElement.textContent = data.name


        let mediaNameElement = document.createElement("h4");
        mediaNameElement.append(mediaLinkElement);
        mediaNameElementContainer.append(mediaNameElement);
        mediaNameElementContainer.append(makeRating("tvshow", data))

        let mediaDetailsElement = document.createElement("p");
        // release date;
        let releaseDateElement = document.createElement("span");
        if (data.premiered !== null) {
            releaseDateElement.textContent = data.premiered.slice(0, 4) + " / ";
        } else {
            releaseDateElement.textContent = "Unkown Release Date / "
        }
        mediaDetailsElement.append(releaseDateElement);
        // genres
        mediaDetailsElement.append(makeGenres("tvshow", data))

        adjcentContainer.append(mediaDetailsElement);
        adjcentContainer.append(mediaNameElementContainer)
        adjcentContainer.append(mediaNameElementContainer)
            // 
        whereToAppendElement.append(containerElement);
    } else if (mediaKind === "celebs") {
        let containerElement = document.createElement("div");
        containerElement.classList.add("generic-celeb-container");

        let personalContainerElement = document.createElement("div");
        personalContainerElement.classList.add("generic-celeb-container__personal");
        let imgContainerElement = document.createElement("div");
        imgContainerElement.classList.add("generic-celeb-container__img");
        if (data.profile_path !== null) {
            let backgroundImageLink = makeMediaImg("celebs", "w780", null, data);
            let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";
            imgContainerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
            personalContainerElement.append(imgContainerElement)
        } else {
            let backgroundImageFallSafeElement = document.createElement("div");
            backgroundImageFallSafeElement.classList.add("generic-celeb-container__celeb-background-img-fall-safe")
            let noBackgroundText = document.createElement("p");
            noBackgroundText.textContent = `No Image was found for ${data.name}`;
            backgroundImageFallSafeElement.append(noBackgroundText);

            personalContainerElement.append(backgroundImageFallSafeElement);
        }
        let overviewContainerElement = document.createElement("div");
        overviewContainerElement.classList.add("generic-celeb-container__overview");

        overviewContainerElement.append(makeCelebBio(data));

        function makeCelebMovies() {
            return ":)"
        }

        // function makeCelebBio() {
        //     let strongTagElement = document.createElement("strong");
        //     strongTagElement.textContent = data.name;

        //     let spanKnownForWhatElement = document.createElement("span");
        //     spanKnownForWhatElement.textContent = data.known_for_department

        //     let spanPopularity = document.createElement("span");
        //     spanPopularity.textContent = data.popularity

        //     let creditAtag = document.createElement("a");
        //     creditAtag.href = "https://www.themoviedb.org/";
        //     creditAtag.textContent = "The Movie DB";

        //     let brTag = document.createElement("br");
        //     return `
        //     ${strongTagElement.textContent} is known for ${spanKnownForWhatElement.textContent} with popularity of ${spanPopularity.textContent} according to ${creditAtag.textContent}. ${brTag.textContent}
        //     Some of his most well known for movies incldue, but not limited to: ${makeCelebMovies()}
        // `;
        // }


        containerElement.append(personalContainerElement);
        containerElement.append(overviewContainerElement);
        whereToAppendElement.append(containerElement);
    } else if (mediaKind === "mini-media") {
        let containerElement = document.createElement("div");
        let backgroundImageLink = makeMediaImg("mini-movie", "w342", data.poster_path, data);
        let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";
        containerElement.style.backgroundImage = backgroundImageLinkInCssFormat;

        whereToAppendElement.append(containerElement);
    }

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
                makeHTMLContainers(landingPageElement, true, "movie", movie);
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
    makeLandingPageMovies(sortBy.dataset.parameter, rating.dataset.parameter, year.dataset.parameter, pageNumber);
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
// for (let i = 0; i < 2; i++) makeInTheaterNowMovies();

// // create landing page movies;
// makeLandingPageMovies()

// ============================================================================================================================================================= // 

// search functions;
let searchQuery;
const querySymbol = "&query=";
// tv search variables;
const tvSearchResultsElement = document.querySelector("#tvshows-results")
const tvSearchInput = document.querySelector("#tv-search-field");
const tvForm = document.querySelector("#tv-search-form");
const tvSearchApiUrl = "https://api.tvmaze.com/search/shows?q=";
// movie search variables;
const moveisSearchResultElement = document.querySelector("#movies-results");
const moviesSearchInput = document.querySelector("#movies-search-field");
const moviesForm = document.querySelector("#movies-search-form");
const moviesSearchApiUrl = "https://api.themoviedb.org/3/search/movie";
// celebrities search variables;
const celebsSearchResultElement = document.querySelector("#celebs-results");
const celebsSearchInput = document.querySelector("#celebs-search-field");
const celebsForm = document.querySelector("#celebs-search-form");
const celebsSearchApiUrl = "https://api.themoviedb.org/3/search/person";





getUserSearch(tvForm, tvSearchInput, "tvshow", tvSearchResultsElement);
getUserSearch(moviesForm, moviesSearchInput, "movie", moveisSearchResultElement);
getUserSearch(celebsForm, celebsSearchInput, "celebs", celebsSearchResultElement);



function getUserSearch(element, input, mediaKind, whereToAppendElement) {
    element.addEventListener("submit", (e) => {
        e.preventDefault();
        searchQuery = input.value;
        input.value = "";
        whereToAppendElement.innerHTML = "";
        searchForMedia(searchQuery, mediaKind, whereToAppendElement);
    })

    function searchForMedia(searchQuery, mediaKind, whereToAppendElement) {
        if (mediaKind === "tvshow") {
            let urlToFetch = tvSearchApiUrl + searchQuery
            fetch(urlToFetch)
                .then(response => response.json())
                .then(json => {
                    json.forEach(tvShow => {
                        makeHTMLContainers(whereToAppendElement, true, mediaKind, tvShow.show);
                    })
                })
        } else if (mediaKind === "movie") {
            let urlToFetch = moviesSearchApiUrl + apiKey + querySymbol + searchQuery
            fetch(urlToFetch)
                .then(response => response.json())
                .then(json => {
                    json.results.forEach(movie => {
                        makeHTMLContainers(whereToAppendElement, true, mediaKind, movie);
                    })
                })
        } else {
            let urlToFetch = celebsSearchApiUrl + apiKey + querySymbol + searchQuery
            fetch(urlToFetch)
                .then(response => response.json())
                .then(json => {
                    // sort the results in term of popularity, it's more likely that whoever the user is searching for is a known actor so this would show them on top right away.
                    json.results = json.results.sort((a, b) => b.popularity - a.popularity)
                    json.results.forEach(person => {
                        makeHTMLContainers(whereToAppendElement, true, mediaKind, person)
                    })
                })
        }
    }

}































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