// functions related to hiding/showing elements based on screen size, interactivity, etc;

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
let sideBarToggler = document.querySelector("#toggle-side-bar");
let sideBarEl = document.querySelector(".side-bar");
let overlayDiv = document.querySelector("#overlay-div");

let overlayDivTogglingCssClass = "overlay-div__overlay--modifier";
let sideBarTogglingCssClass = "side-bar-visible";

sideBarToggler.addEventListener("click", () => {
    sideBarEl.classList.add(sideBarTogglingCssClass)
    overlayDiv.classList.add(overlayDivTogglingCssClass)
})

overlayDiv.addEventListener("click", () => {
    if (sideBarEl.classList.contains(sideBarTogglingCssClass)) {
        sideBarEl.classList.remove(sideBarTogglingCssClass)
    }
    overlayDiv.classList.remove(overlayDivTogglingCssClass);
})

// the hover effects on the movies posters;