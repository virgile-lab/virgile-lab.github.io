const toggleMenu = document.querySelector(".toggle-menu");
const primaryNav = document.querySelector(".primary-nav");
const menu = primaryNav.querySelector("ul");
const bodyDocument = document.querySelector("body");
const screenOverlay = document.querySelector(".screen-overlay");


toggleMenu.addEventListener('click', () => {

        var visibility = primaryNav.getAttribute('data-visible');

        if (visibility === 'false') {
            bodyDocument.style.overflowY = "hidden";
            menu.style.display = "flex";
            setTimeout(() => {
                primaryNav.setAttribute('data-visible', 'true');
            });

        } else {
            bodyDocument.style.overflowY = "scroll";
            primaryNav.setAttribute('data-visible', 'false');
            setTimeout(() => {
                menu.style.display = "none";

            }, 1001);
        }

    }

)
screenOverlay.addEventListener('click', () => {
    primaryNav.setAttribute('data-visible', 'false');
})