/*
    IT'S ALL ABOUT FETCHING DATA AND WORKING WITH THE DOM HERE
*/
// those two imports are required to make async functions work with parcel;
import "core-js/stable";
import "regenerator-runtime/runtime";

import { togglePopups } from "./helpers"

import { makeMediaImg } from "./fetchingHelpers"
import { makeGenres } from "./fetchingHelpers"
import { makeCelebBio } from "./fetchingHelpers"
import { makeRating } from "./fetchingHelpers"
import { shuffleArray } from "./fetchingHelpers";

// TODO remove this function: 
export const log = console.log;

// the api link structure
const apiKey = "?api_key=abb107c96224ec174a429b41fa17acda";

const nowPlayingApiUrl = "https://api.themoviedb.org/3/movie/now_playing"
const discoverMovieApiUrl = " https://api.themoviedb.org/3/discover/movie"
const linkToPerson = "https://www.themoviedb.org/person/";
const linkToAMovieUsingItsID = "https://www.themoviedb.org/movie/";

const tvSearchApiUrl = "https://api.tvmaze.com/search/shows?q=";
const moviesSearchApiUrl = "https://api.themoviedb.org/3/search/movie";
const celebsSearchApiUrl = "https://api.themoviedb.org/3/search/person";


const nowPlayingContainerElement = document.querySelector("#now-playing-container");
const landingPageContainerElement = document.querySelector("#landing-page-container");

export function makeInTheaterNowMovies() {
    let nowPlayingMoviesApiUrl = nowPlayingApiUrl + apiKey;
    fetch(nowPlayingMoviesApiUrl)
        .then(res => res.json())
        .then(moviesArray => {
            moviesArray = shuffleArray(moviesArray.results)
            for (let i = 0; i < 2; i++) makeHTMLContainers(nowPlayingContainerElement, false, "movie", moviesArray[i])
        })
        .catch((e) => console.log(e));
};
// this function will create and append a fitting div for each movie based on its arguments;
export function makeHTMLContainers(whereToAppendElement, poster = true, mediaKind, data) {
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

        whereToAppendElement.append(containerElement);
    } else if (mediaKind === "celebs") {
        let containerElement = document.createElement("div");
        containerElement.classList.add("generic-celeb-container");

        let personalContainerElement = document.createElement("div");
        personalContainerElement.classList.add("generic-celeb-container__personal");
        let imgContainerElement = document.createElement("div");
        imgContainerElement.classList.add("generic-celeb-container__img");
        let linkToMovieElement = document.createElement("a");
        linkToMovieElement.href = linkToPerson + data.id;
        linkToMovieElement.classList.add("generic-celeb-container__link-to")

        imgContainerElement.append(linkToMovieElement)
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

        containerElement.append(personalContainerElement);
        containerElement.append(overviewContainerElement);
        whereToAppendElement.append(containerElement);
    } else if (mediaKind === "mini-media") {
        if (data.poster_path !== null && data.poster_path !== undefined) {
            let containerElement = document.createElement("div");
            let backgroundImageLink = makeMediaImg("mini-movie", "w342", data.poster_path, data);
            let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";
            containerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
            let linkToMovieElement = document.createElement("a");
            linkToMovieElement.href = linkToAMovieUsingItsID + data.id;
            linkToMovieElement.classList.add("generic-celeb-container__link-to")

            containerElement.append(linkToMovieElement)
            whereToAppendElement.append(containerElement)
        } else {
            let backgroundImageFallSafeElement = document.createElement("div");
            backgroundImageFallSafeElement.classList.add("generic-celeb-container__celeb-movies-img-fall-safe")
            let noBackgroundText = document.createElement("p");
            noBackgroundText.textContent = data.title;
            backgroundImageFallSafeElement.append(noBackgroundText);

            whereToAppendElement.append(backgroundImageFallSafeElement)
        }
    }

}

// update the drop down menus values, I could have added this with the next sibiling function which uses the same values to fetch new movies but it proved more complicated/annoying than i thought it would be so i ended up splitting them in two separate functions;
export function updateMoviesFilters(el, elTargetToUpdate) {
    const valuesList = document.querySelectorAll(el);
    const spanToShowCurrentValue = document.querySelector(elTargetToUpdate);

    // handle updating the values visually and getting new movies accordingly;
    valuesList.forEach(li => {
        li.addEventListener("click", () => {
            spanToShowCurrentValue.textContent = li.textContent;
            spanToShowCurrentValue.dataset.parameter = li.dataset.value
            landingPageContainerElement.innerHTML = "";
            makeLandingPageMoviesBasadOnParameters(1)
            togglePopups();
        })
    });
    // load more movies upon scrolling;
    const mainHTMLElement = document.querySelector("main");
    const whereToLodMoreMoviesIntoElement = document.querySelector("#browse-container")
    const loadMoreThreshold = 1200;
    mainHTMLElement.addEventListener("scroll", () => {
        if (mainHTMLElement.scrollTop + loadMoreThreshold > (mainHTMLElement.scrollHeight - mainHTMLElement.offsetHeight) && whereToLodMoreMoviesIntoElement.classList.contains("container--visible")) {
            loadMoreMovies();
        }
    })

    // pageNumber is which page should the api response with, now it returns the first page (page number 1) by default but after scrolling, if we don't change the page number we will get the same movies over and over;
    let pageNumber = 2;

    function loadMoreMovies() {
        makeLandingPageMoviesBasadOnParameters(pageNumber)
        pageNumber++
    }
}

// fetch the landing page movies and make the html needed for them;
export function makeLandingPageMovies(properties = "popularity.desc", rating = "vote_count.desc", specificYear = "2020", pageNumber = 1) {
    const sortBy = "&sort_by=";
    const andSymbol = "&";
    const page = "page="
    let discoverMoviesFetchUrl = discoverMovieApiUrl + apiKey + sortBy + properties + andSymbol + rating + andSymbol + specificYear + andSymbol + page + pageNumber;
    fetch(discoverMoviesFetchUrl)
        .then(res => res.json())
        .then(json => {
            json.results.forEach(movie => {
                makeHTMLContainers(landingPageContainerElement, true, "movie", movie);
            })
        }).catch((e) => console.log(e))
}

// change what movies being shown in the landing page based on the parameters which we take from the dropdown menus;
function makeLandingPageMoviesBasadOnParameters(pageNumber) {
    const fetchParameter = document.querySelectorAll("[data-parameter]");
    const [sortBy, rating, year] = fetchParameter
    makeLandingPageMovies(sortBy.dataset.parameter, rating.dataset.parameter, year.dataset.parameter, pageNumber);
};
// show only movies based on a certian year;
export function filterLandingPageMoviesBasedOnYear() {
    const textInputElement = document.querySelector("#sort-byy-period");
    const clearYearFiltersButton = document.querySelector("#clear-year-filter-button");
    const sortingByDropDowns = document.querySelectorAll(".properties-drop-down");
    textInputElement.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            let year = Number(this.value)
            if (year === "" || year.length < 4) {
                this.classList.add("warn-invalid-query");
                setTimeout(() => {
                    this.classList.remove("warn-invalid-query")
                }, 1500);
            } else {
                clearYearFiltersButton.classList.add("clear-year-filter-button__visible")
                this.dataset.parameter = "primary_release_year=" + year
                year = "";
                landingPageContainerElement.innerHTML = "";
                sortingByDropDowns.forEach(dropDownMenu => dropDownMenu.classList.add("properties-drop-down--temporarily-disabled"))
                makeLandingPageMoviesBasadOnParameters(1)
            }
            if (year < 1900 || year > 2030) {
                noSearchWasFoundFallSafe(landingPageContainerElement);
            }
        }
    })
    clearYearFiltersButton.addEventListener("click", () => {
        landingPageContainerElement.innerHTML = "";
        textInputElement.value = "";
        textInputElement.dataset.parameter = "primary_release_year="
        makeLandingPageMovies("popularity.desc", "vote_count.desc", "2020", 1)
        clearYearFiltersButton.classList.remove("clear-year-filter-button__visible")
        sortingByDropDowns.forEach(dropDownMenu => dropDownMenu.classList.remove("properties-drop-down--temporarily-disabled"))
    })
}

// search functions;

export function mainSearchFunction() {
    let searchQuery;
    const querySymbol = "&query=";
    // tv search variables;
    const tvSearchResultsElement = document.querySelector("#tvshows-results")
    const tvSearchInput = document.querySelector("#tv-search-field");
    const tvForm = document.querySelector("#tv-search-form");
    // movie search variables;
    const moveisSearchResultElement = document.querySelector("#movies-results");
    const moviesSearchInput = document.querySelector("#movies-search-field");
    const moviesForm = document.querySelector("#movies-search-form");
    // celebrities search variables;
    const celebsSearchResultElement = document.querySelector("#celebs-results");
    const celebsSearchInput = document.querySelector("#celebs-search-field");
    const celebsForm = document.querySelector("#celebs-search-form");

    function getUserSearchResult(element, input, mediaKind, whereToAppendElement) {
        element.addEventListener("submit", (e) => {
            e.preventDefault();
            searchQuery = input.value;

            if (searchQuery !== "") {
                whereToAppendElement.innerHTML = "";
                searchForMedia(searchQuery, mediaKind, whereToAppendElement);
            } else {
                element.classList.add("warn-invalid-query");
                setTimeout(() => {
                    element.classList.remove("warn-invalid-query");
                }, 1000)
            }
            input.value = "";
        })

        function searchForMedia(searchQuery, mediaKind, whereToAppendElement) {
            if (mediaKind === "tvshow") {
                let urlToFetch = tvSearchApiUrl + searchQuery
                fetch(urlToFetch)
                    .then(response => response.json())
                    .then(searchResultInJson => {
                        log(searchResultInJson)
                        validateSearchResult(searchResultInJson, tvSearchResultsElement);
                        searchResultInJson.forEach(tvShow => {
                            makeHTMLContainers(whereToAppendElement, true, mediaKind, tvShow.show);
                        })
                    }).catch(e => console.log(e))
            } else if (mediaKind === "movie") {
                if (searchQuery.length) {
                    let urlToFetch = moviesSearchApiUrl + apiKey + querySymbol + searchQuery
                    fetch(urlToFetch)
                        .then(response => response.json())
                        .then(searchResultInJson => {
                            validateSearchResult(searchResultInJson.results, moveisSearchResultElement)
                            if (searchResultInJson.results) {
                                searchResultInJson.results.forEach(movie => {
                                    makeHTMLContainers(whereToAppendElement, true, mediaKind, movie);
                                })
                            }
                        }).catch(e => console.log(e))
                }
            } else {
                let urlToFetch = celebsSearchApiUrl + apiKey + querySymbol + searchQuery
                fetch(urlToFetch)
                    .then(response => response.json())
                    .then(searchResultInJson => {
                        validateSearchResult(searchResultInJson.results, celebsSearchResultElement);
                        // sort the results in term of popularity, it's more likely that whoever the user is searching for is a known actor so this would show them on top right away;
                        searchResultInJson.results = searchResultInJson.results.sort((a, b) => b.popularity - a.popularity)
                        searchResultInJson.results.forEach(person => {
                            makeHTMLContainers(whereToAppendElement, true, mediaKind, person)
                        })
                    }).catch(e => console.log(e))
            }
        }

    }

    function validateSearchResult(searchResultToValidate, whereToAppendElement) {
        if (searchResultToValidate.length === 0) {
            noSearchWasFoundFallSafe(whereToAppendElement);
            return
        }

    }
    getUserSearchResult(tvForm, tvSearchInput, "tvshow", tvSearchResultsElement);
    getUserSearchResult(moviesForm, moviesSearchInput, "movie", moveisSearchResultElement);
    getUserSearchResult(celebsForm, celebsSearchInput, "celebs", celebsSearchResultElement);


}


function noSearchWasFoundFallSafe(whereToAppendElement) {
    whereToAppendElement.innerHTML = "";
    let warnningContainerElement = document.createElement("div");
    warnningContainerElement.classList.add("no-serach-results-continer");
    let warnningElement = document.createElement("h2");
    warnningElement.textContent = "looks like we couldn't find anything, try adjusting your parameters or keywords!"
    warnningElement.classList.add("no-serach-results-continer__text");
    warnningContainerElement.append(warnningElement);

    whereToAppendElement.append(warnningContainerElement)
}