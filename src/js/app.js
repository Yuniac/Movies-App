// this file is the main starting point for the app;

import { makeInTheaterNowMovies } from "./index";
import { makeLandingPageMovies } from "./index";
import { updateMoviesFilters } from "./index";
import { filterLandingPageMoviesBasedOnYear } from "./index";
import { mainSearchFunction } from "./index"

makeInTheaterNowMovies();
makeLandingPageMovies()
filterLandingPageMoviesBasedOnYear()
mainSearchFunction();

updateMoviesFilters(".sort-value", "#sort-by-placeholder", ".drop-down-current-value")
updateMoviesFilters(".ratings-value", "#ratings-placeholder", ".drop-down-current-value")