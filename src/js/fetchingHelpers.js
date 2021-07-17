import { makeHTMLContainers } from "./index";

// this function will will make and return a backdrop or a poster image link for a given movie/tv show based on its id;
const baseImgUrl = "https://image.tmdb.org/t/p/";
const personImgUrl = "https://api.themoviedb.org/3/person/"
export function makeMediaImg(mediaKind, imgSize, imgPath, data) {
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
export function makeGenres(mediaKind, data) {
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
export function makeRating(mediaKind, data) {
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

export function makeCelebBio(data) {
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

export function makeCelebKnownForMovies(data) {
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
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}