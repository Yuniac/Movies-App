// show/hide main content of the website;
const containers = document.querySelectorAll(".container");
const containersTogglers = document.querySelectorAll("[data-toggler-target]");

containersTogglers.forEach(toggler => {
    toggler.addEventListener("click", function(e) {
        containers.forEach(container => {
            if (container.id === e.target.dataset.togglerTarget) {
                container.classList.add("visible-container");
            } else {
                container.classList.remove("visible-container");
            }
        })
    })
})