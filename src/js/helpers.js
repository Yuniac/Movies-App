/*

functions related to hiding/showing elements based on screen size, interactivity, etc;

*/

// the notifications and messages boxes;
toggleNotificationsBox("alerts", "alertsBox", "notifications-area__alerts-box--visible");
toggleNotificationsBox("messages", "messagesBox", "notifications-area__messages-box--visible");

function toggleNotificationsBox(el, elBox, css) {
    let toggler = document.getElementById(el);
    let togglerBox = document.getElementById(elBox);
    let cssClass = css;
    toggler.addEventListener("click", () => {
        if (!togglerBox.classList.contains(cssClass)) {
            togglerBox.classList.add(cssClass);
            setTimeout(() => {
                togglerBox.classList.remove(cssClass)
            }, 1000);
        }
    })
}


// the side bar hiding/showing based on the size of the screen;
const sideBarToggler = document.querySelector("#toggle-side-bar");
const sideBarEl = document.querySelector(".side-bar");
const overlayDiv = document.querySelector("#overlay-div");
const loadThisMovieContainerElement = document.querySelector("#current-movie")

const overlayDivTogglingCssClass = "overlay-div__overlay--modifier";
const sideBarTogglingCssClass = "side-bar-visible";
const loadThisMovieContainerElementTogglingCss = "current-movie--visible"

sideBarToggler.addEventListener("click", () => {
    sideBarEl.classList.add(sideBarTogglingCssClass)
    overlayDiv.classList.add(overlayDivTogglingCssClass)
})

// the sort by drop-down menus: using native 'select' and 'datalist' HTML elements was problematic because each browser renders them differently and there is no way to style them all consistently. So, I'm going to use custom HTML/CSS/JS to get the same result;
function showSortMenus(el, elTarget, css) {
    let htmlTogglerEl = document.getElementById(el);
    let htmlTargetToToggle = document.getElementById(elTarget);

    htmlTogglerEl.addEventListener("click", () => {
        htmlTargetToToggle.classList.add(css)
        overlayDiv.classList.add(overlayDivTogglingCssClass)
    })
}

let dropDownMenuTogglingCss = "visible-drop-down-menu"

showSortMenus("sort-by-placeholder", "sort-by-menu", dropDownMenuTogglingCss);
showSortMenus("sort-menu-toggler-icon", "sort-by-menu", dropDownMenuTogglingCss);

showSortMenus("ratings-placeholder", "ratings-menu", dropDownMenuTogglingCss);
showSortMenus("ratings-menu-toggler-icon", "ratings-menu", dropDownMenuTogglingCss);


// any click on the overlay div means that it has been invoked by a popup somewhere on the page, so it will remove all enabling classes from all our elements that uses this feature;
const sortMenu = document.getElementById("sort-by-menu");
const ratingsMenu = document.getElementById("ratings-menu");

export function togglePopups() {
    sideBarEl.classList.remove(sideBarTogglingCssClass);
    ratingsMenu.classList.remove(dropDownMenuTogglingCss);
    sortMenu.classList.remove(dropDownMenuTogglingCss);
    overlayDiv.classList.remove(overlayDivTogglingCssClass);
    loadThisMovieContainerElement.classList.remove(loadThisMovieContainerElementTogglingCss)

}
togglePopups();
overlayDiv.addEventListener("click", () => {
    togglePopups();
})