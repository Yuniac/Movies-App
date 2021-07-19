// show/hide main content of the website;
import { togglePopups } from "./helpers"

const containers = document.querySelectorAll(".container");
const containersTogglers = document.querySelectorAll("[data-toggler-target]");
containersTogglers.forEach(toggler => toggler.addEventListener("click", highLightCurrentPage))

function highLightCurrentPage() {
    // the side menu icons, when clicking on one of them:
    // 1) hide all html content containers and only show the one which represnts the icon that got clicked.
    // 2) remove the highlighting class from all the icons and only add it to the icon which represnts the current page/container which we are in.
    containersTogglers.forEach(toggler => {
        toggler.addEventListener("click", showTheCorrectPage(event))
    })

    function showTheCorrectPage(e) {
        containers.forEach(container => {
            if (container.id !== e.target.dataset.togglerTarget) {
                container.classList.remove("container--visible");
            } else {
                loadThisContainer(container)
                togglePopups()
            }
        })
    }

    function loadThisContainer(container) {
        container.classList.add("container--visible");
        containersTogglers.forEach(toggler => {
            toggler.previousElementSibling.classList.remove("current-page");
        })
        switch (container.id) {
            case (containersTogglers[0].dataset.togglerTarget):
                containersTogglers[0].previousElementSibling.classList.add("current-page")
                break;
            case (containersTogglers[1].dataset.togglerTarget):
                containersTogglers[1].previousElementSibling.classList.add("current-page")
                break;
            case (containersTogglers[2].dataset.togglerTarget):
                containersTogglers[2].previousElementSibling.classList.add("current-page")
                break;
            case (containersTogglers[3].dataset.togglerTarget):
                containersTogglers[3].previousElementSibling.classList.add("current-page")
                break;
        }
    }
}