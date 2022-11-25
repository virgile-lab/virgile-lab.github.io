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

const toggleMode = document.querySelector(".toggle-mode");

function darkMode() {
    toggleMode.setAttribute('data-mode', 'dark');
    document.documentElement.style.setProperty('--clr-neutral-100', 'hsl(240, 100%, 5%)');
    document.documentElement.style.setProperty('--clr-neutral-400', 'hsl(236, 13%, 60%)');
    document.documentElement.style.setProperty('--clr-neutral-900', 'hsl(240, 18%, 35%)');
}

function lightMode() {
    toggleMode.setAttribute('data-mode', 'light');
    document.documentElement.style.setProperty('--clr-neutral-100', 'hsl(36, 100%, 99%)');
    document.documentElement.style.setProperty('--clr-neutral-400', 'hsl(236, 13%, 42%)');
    document.documentElement.style.setProperty('--clr-neutral-900', 'hsl(240, 100%, 5%)');
}

toggleMode.addEventListener('click', () => {
    var modeData = toggleMode.getAttribute('data-mode');

    if (modeData === "light") {
        darkMode();
        localStorage.setItem('mode', 'dark')
    } else {
        lightMode();
        localStorage.setItem('mode', 'light')
    }
})



function modeStorage() {
    var modeStorage = localStorage.getItem('mode');
    if (modeStorage === "light") {
        lightMode();
    } else {
        darkMode();
    }
};

modeStorage();

/* End Dark/Light Mode */