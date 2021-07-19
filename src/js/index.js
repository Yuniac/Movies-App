/*
    IT'S ALL ABOUT FETCHING DATA AND WORKING WITH THE DOM HERE
*/
// those two imports are required to make async functions work with parcel;
// import "core-js/stable";
// import "regenerator-runtime/runtime";

import { togglePopups } from "./helpers"

const log = console.log;
// the api link structure
const apiKey = "?api_key=abb107c96224ec174a429b41fa17acda";

const nowPlayingApiUrl = "https://api.themoviedb.org/3/movie/now_playing"
const discoverMovieApiUrl = " https://api.themoviedb.org/3/discover/movie"
const linkToPerson = "https://www.themoviedb.org/person/";
const linkToAMovieUsingItsID = "https://www.themoviedb.org/movie/";


// const tvSearchApiUrl = "https://api.tvmaze.com/search/shows?q=";
const tvSearchApiUrl = "https://api.themoviedb.org/3/search/tv"
const moviesSearchApiUrl = "https://api.themoviedb.org/3/search/movie";
const celebsSearchApiUrl = "https://api.themoviedb.org/3/search/person";


const nowPlayingContainerElement = document.querySelector("#now-playing-container");
const landingPageContainerElement = document.querySelector("#landing-page-container");
const loadThisMovieContainerElement = document.querySelector("#current-media-container");


/* 
    helpers functions related to doing small tasks;
*/
// this function will will make and return a backdrop or a poster image link for a given movie/tv show based on its id;
const baseImgUrl = "https://image.tmdb.org/t/p/";

function makeMediaImg(mediaKind, imgSize, imgPath, data) {
    if (mediaKind === "media" || mediaKind === "mini-media") {
        let backgroundImgURL = baseImgUrl + imgSize + imgPath
        return backgroundImgURL
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
    if (mediaKind === "media") {
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
    moviesArray.forEach(workTheyDone => {
        makeHTMLContainers(celebIsKnownForElement, true, "mini-media", workTheyDone)
    })
    return celebIsKnownForElement
}

// get two or more random movies for the 'now in theatres' section;
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function makeInTheaterNowMovies() {
    let nowPlayingMoviesApiUrl = nowPlayingApiUrl + apiKey;
    fetch(nowPlayingMoviesApiUrl)
        .then(res => res.json())
        .then(moviesArray => {
            moviesArray = shuffleArray(moviesArray.results)
            for (let i = 0; i < 2; i++) makeHTMLContainers(nowPlayingContainerElement, false, "media", moviesArray[i])
        })
        .catch((e) => console.log(e));
};

/* 
    functions which will fetch data/update the page content;
*/

// this function will create and append a fitting div for each movie based on its arguments;
function makeHTMLContainers(whereToAppendElement, poster = true, mediaKind, data) {
    if (mediaKind === "media") {
        let containerElement = document.createElement("div");
        let adjcentContainer = document.createElement("div");

        containerElement.append(adjcentContainer);
        // poster vs backdrop image, different css/size, etc;
        if (poster) {
            containerElement.classList.add("generic-media-container");
            adjcentContainer.classList.add("generic-media-container__description-css");
            if (data.poster_path !== null) {
                let backgroundImageLink = makeMediaImg(mediaKind, "w780", data.poster_path, null);
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


            let mediaNameElement = document.createElement("h4");
            mediaNameElement.textContent = data.title
            mediaNameElementContainer.append(mediaNameElement);
            mediaNameElementContainer.append(makeRating("movie", data))


            let mediaDetailsElement = document.createElement("p");
            // release date;
            let releaseDateElement = document.createElement("span");
            if (data.release_date === undefined) {
                releaseDateElement.textContent = "Unkown Release Date"
            } else if (data.release_date.length) {
                releaseDateElement.textContent = data.release_date.slice(0, 4) + " / ";
            }
            mediaDetailsElement.append(releaseDateElement);
            // genres
            mediaDetailsElement.append(makeGenres(mediaKind, data))

            adjcentContainer.append(mediaDetailsElement);
            adjcentContainer.append(mediaNameElementContainer)
        } else {
            containerElement.classList.add("now-playing__movie");
            adjcentContainer.classList.add("now-playing__overlay-css");

            let backgroundImageLink = makeMediaImg(mediaKind, "w1280", data.backdrop_path);
            let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";

            containerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
            let mediaLinkElement = document.createElement("a");
            mediaLinkElement.href = linkToAMovieUsingItsID + data.id;
            mediaLinkElement.textContent = data.title

            let mediaNameElement = document.createElement("h4");
            mediaNameElement.append(mediaLinkElement);

            adjcentContainer.append(mediaNameElement)
        }
        // show and hide the overview element;
        containerElement.addEventListener("click", () => {
            const loadThisMovieContainerElement = document.querySelector("#current-movie")
            loadThisMovieContainerElement.innerHTML = "";
            loadThisMovieContainerElement.classList.add("current-movie--visible");
            makeHTMLContainers(loadThisMovieContainerElement, false, "movie-preview", data);
            const overlayDiv = document.querySelector("#overlay-div");
            overlayDiv.classList.add("overlay-div__overlay--modifier");
        })
        whereToAppendElement.append(containerElement);
    } else if (mediaKind === "movie-preview") {
        let bannerElement = document.createElement("div");
        bannerElement.classList.add("current-movie__banner")
        if (data.backdrop_path !== null && data.backdrop_path !== undefined) {

            let backgroundImageLink = makeMediaImg("media", "w1280", data.backdrop_path, data);
            let backgroundImageLinkInCssFormat = "url('" + backgroundImageLink + "')";
            bannerElement.style.backgroundImage = backgroundImageLinkInCssFormat;
        } else {
            let bannerImageFallSafeElement = document.createElement("h4");
            bannerImageFallSafeElement.textContent = data.title;
        }


        let descriptionContainer = document.createElement("div");
        descriptionContainer.classList.add("current-movie__description");

        let descriptionParagraph = document.createElement("p");
        descriptionParagraph.textContent = data.overview;
        descriptionContainer.append(descriptionParagraph);

        let detailsElementContiner = document.createElement("div");
        detailsElementContiner.classList.add("current-movie__details");
        let linkElement = document.createElement("a");
        linkElement.textContent = data.title;
        linkElement.href = linkToAMovieUsingItsID + data.id;
        detailsElementContiner.append(linkElement);

        whereToAppendElement.append(bannerElement);
        whereToAppendElement.append(descriptionContainer);
        whereToAppendElement.append(detailsElementContiner);
        // containerElement.addEventListener("click", loadThisMovie(data, "movie-preview"))
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
            let backgroundImageLink = makeMediaImg(mediaKind, "w342", data.poster_path, data);
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
function updateMoviesFilters(el, elTargetToUpdate) {
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
}
updateMoviesFilters(".sort-value", "#sort-by-placeholder", ".drop-down-current-value");
updateMoviesFilters(".ratings-value", "#ratings-placeholder", ".drop-down-current-value");

// load more movies upon scrolling;
let pageNumber = 2;

function LoadMoreContentAfterScrolling() {
    const mainHTMLElement = document.querySelector("main");
    const whereToLodMoreMoviesIntoElement = document.querySelector("#browse-container")
    const loadMoreThreshold = 100;
    // pageNumber is which page should the api response with, now it returns the first page (page number 1) by default but after scrolling, if we don't change the page number we will get the same movies over and over;
    mainHTMLElement.addEventListener("scroll", () => {
        if (mainHTMLElement.scrollTop + loadMoreThreshold > (mainHTMLElement.scrollHeight - mainHTMLElement.offsetHeight) && whereToLodMoreMoviesIntoElement.classList.contains("container--visible")) {
            pageNumber++
            loadMoreMedia(pageNumber);
        }
    })

    function loadMoreMedia(pageNumber) {
        makeLandingPageMoviesBasadOnParameters(pageNumber)
    }
}
// change what movies being shown in the landing page based on the parameters which we take from the dropdown menus;
function makeLandingPageMoviesBasadOnParameters(pageNumber) {
    const fetchParameter = document.querySelectorAll("[data-parameter]");
    const [sortBy, rating, year] = fetchParameter
    makeLandingPageMovies(sortBy.dataset.parameter, rating.dataset.parameter, year.dataset.parameter, pageNumber);
};

// fetch the landing page movies and make the html needed for them;
function makeLandingPageMovies(properties = "popularity.desc", rating = "vote_count.desc", specificYear = "2021", pageNumber = 1) {
    const sortBy = "&sort_by=";
    const andSymbol = "&";
    const page = "page="
    const primaryReleaseYear = "primary_release_year="
    let discoverMoviesFetchUrl = discoverMovieApiUrl + apiKey + sortBy + properties + andSymbol + rating + andSymbol + primaryReleaseYear + specificYear + andSymbol + page + pageNumber;
    fetch(discoverMoviesFetchUrl)
        .then(res => res.json())
        .then(json => {
            json.results.forEach(movie => {
                makeHTMLContainers(landingPageContainerElement, true, "media", movie);
            })
        }).catch((e) => console.trace(e))
}

// show only movies based on a certian year;
const textInputElement = document.querySelector("#sort-byy-period");
const clearYearFiltersButton = document.querySelector("#clear-year-filter-button");
const sortingByDropDowns = document.querySelectorAll(".properties-drop-down");

function filterLandingPageMoviesBasedOnYear() {
    textInputElement.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            let year = Number(this.value)
            if (year < 1900 || year > 2030) {
                noSearchWasFoundFallSafe(landingPageContainerElement);
            }
            if (year === "" || year.length < 4) {
                this.classList.add("warn-invalid-query");
                setTimeout(() => {
                    this.classList.remove("warn-invalid-query")
                }, 1500);
            } else {
                clearYearFiltersButton.classList.add("clear-year-filter-button__visible")
                this.dataset.parameter = year
                year = "";
                landingPageContainerElement.innerHTML = "";
                sortingByDropDowns.forEach(dropDownMenu => dropDownMenu.classList.add("properties-drop-down--temporarily-disabled"))
                makeLandingPageMoviesBasadOnParameters(1)
            }
        }
    })
    clearYearFiltersButton.addEventListener("click", () => {
        landingPageContainerElement.innerHTML = "";
        textInputElement.value = "";
        textInputElement.dataset.parameter = "2021"
        pageNumber = 1;
        makeLandingPageMovies("popularity.desc", "vote_count.desc", "2021", 1)
        clearYearFiltersButton.classList.remove("clear-year-filter-button__visible")
        sortingByDropDowns.forEach(dropDownMenu => dropDownMenu.classList.remove("properties-drop-down--temporarily-disabled"))
    })
}

// search functions;
function mainSearchFunction() {
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
                let urlToFetch = tvSearchApiUrl + apiKey + querySymbol + searchQuery
                fetch(urlToFetch)
                    .then(response => response.json())
                    .then(searchResultInJson => {
                        validateSearchResult(searchResultInJson.results, tvSearchResultsElement);
                        searchResultInJson.results.forEach(tvShow => {
                            debugger
                            makeHTMLContainers(whereToAppendElement, true, "media", tvShow);
                        })
                    }).catch(e => console.log(e))
            } else if (mediaKind === "movie") {
                if (searchQuery.length) {
                    let urlToFetch = moviesSearchApiUrl + apiKey + querySymbol + searchQuery
                    fetch(urlToFetch)
                        .then(response => response.json())
                        .then(searchResultInJson => {
                            validateSearchResult(searchResultInJson.results, moveisSearchResultElement);
                            if (searchResultInJson.results) {
                                searchResultInJson.results.forEach(movie => {
                                    makeHTMLContainers(whereToAppendElement, true, "media", movie);
                                })
                            }
                        }).catch(e => console.log(e))
                }
            } else if (mediaKind === "celebs") {
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

makeLandingPageMovies()
makeInTheaterNowMovies()
filterLandingPageMoviesBasedOnYear()
mainSearchFunction();
LoadMoreContentAfterScrolling()

/* 
    ~~
*/