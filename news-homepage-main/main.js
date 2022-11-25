/* Menu Toggle */

const toggleMenu = document.querySelector(".toggle-menu");
const primaryNav = document.querySelector(".primary-nav");
const bodyDocument = document.querySelector("body");
const screenOverlay = document.querySelector(".screen-overlay");



window.addEventListener('resize', () => {

    var viewportWidth = window.innerWidth;

    if (viewportWidth >= 768) {

        bodyDocument.style.overflowY = "scroll";
        primaryNav.setAttribute('data-visible', 'false');

    }
});


toggleMenu.addEventListener('click', () => {

    var visibility = primaryNav.getAttribute('data-visible');

    if (visibility === 'false') {

        bodyDocument.style.overflowY = "hidden";
        primaryNav.setAttribute('data-visible', 'true');

    } else {

        bodyDocument.style.overflowY = "scroll";
        primaryNav.setAttribute('data-visible', 'false');

    }
});

screenOverlay.addEventListener('click', () => {

    bodyDocument.style.overflowY = "scroll";
    primaryNav.setAttribute('data-visible', 'false');

});

/* End Menu Toggle */

/* Dark/Light Mode */

const btnToggle = document.querySelector(".mode-toggle");

function darkMode() {
    btnToggle.setAttribute('data-mode', 'dark');
    document.documentElement.style.setProperty('--clr-neutral-100', 'hsl(240, 100%, 5%)');
    document.documentElement.style.setProperty('--clr-neutral-400', 'hsl(236, 13%, 60%)');
    document.documentElement.style.setProperty('--clr-neutral-900', 'hsl(240, 18%, 35%)');
}

function lightMode() {
    btnToggle.setAttribute('data-mode', 'light');
    document.documentElement.style.setProperty('--clr-neutral-100', 'hsl(36, 100%, 99%)');
    document.documentElement.style.setProperty('--clr-neutral-400', 'hsl(236, 13%, 42%)');
    document.documentElement.style.setProperty('--clr-neutral-900', 'hsl(240, 100%, 5%)');
}

btnToggle.addEventListener('click', () => {
    var darkLight = btnToggle.getAttribute('data-mode');

    if (darkLight === "light") {
        darkMode();
        localStorage.setItem('mode', 'dark')
    } else {
        lightMode();
        localStorage.setItem('mode', 'light')
    }
})



function modeStore() {
    var modeStore = localStorage.getItem('mode');
    if (modeStore === "dark") {
        darkMode();
    } else {
        lightMode();
    }
};

modeStore();

/* End Dark/Light Mode */