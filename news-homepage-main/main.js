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

/* Dark/Light Theme */

// function activateDarkMode() {
//     // set style to dark
//   }

//   // MediaQueryList
//   const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");

//   // recommended method for newer browsers: specify event-type as first argument
//   darkModePreference.addEventListener("change", e => e.matches && activateDarkMode());

const browserThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const browserThemeLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const tooltipToggleTheme = document.querySelector(".toggle-theme-tooltip");
const toggleThemeBtn = document.querySelector(".toggle-theme-btn");
var tooltipStorage = localStorage.getItem('tooltip');



function darkTheme() {
    // Change value of HTML attribute "data-theme" in "dark"
    toggleThemeBtn.setAttribute('data-theme', 'dark');
    // Dark theme colors and properties
    document.documentElement.style.setProperty('--clr-neutral-100', 'hsl(240, 100%, 5%)');
    document.documentElement.style.setProperty('--clr-neutral-400', 'hsl(236, 13%, 60%)');
    document.documentElement.style.setProperty('--clr-neutral-900', 'hsl(240, 18%, 35%)');
}

function lightTheme() {
    // Change value of HTML attribute "data-theme" in "light"
    toggleThemeBtn.setAttribute('data-theme', 'light');
    // Light theme colors and properties
    document.documentElement.style.setProperty('--clr-neutral-100', 'hsl(36, 100%, 99%)');
    document.documentElement.style.setProperty('--clr-neutral-400', 'hsl(236, 13%, 42%)');
    document.documentElement.style.setProperty('--clr-neutral-900', 'hsl(240, 100%, 5%)');
}


if (tooltipStorage != "true") {
    if (browserThemeDark) {

        darkTheme();
        tooltipToggleTheme.innerHTML = "Dark theme applied based on your browser preferences";
        tooltipToggleTheme.setAttribute('data-display', 'true');

        setTimeout(() => {
            tooltipToggleTheme.setAttribute('data-display', 'false');
        }, 3000)

        localStorage.setItem('theme', 'dark')
        localStorage.setItem('tooltip', 'true');

    } else if (browserThemeLight) {

        lightTheme();
        tooltipToggleTheme.innerHTML = "Light theme applied based on your browser preferences";
        tooltipToggleTheme.setAttribute('data-display', 'true');

        setTimeout(() => {
            tooltipToggleTheme.setAttribute('data-display', 'false');
        }, 3000)

        localStorage.setItem('theme', 'light')
        localStorage.setItem('tooltip', 'true');
    }
}

// Change the theme on click on the toggle button
toggleThemeBtn.addEventListener('click', () => {
    var themeData = toggleThemeBtn.getAttribute('data-theme');

    if (themeData === "light") {
        darkTheme();
        localStorage.setItem('theme', 'dark')
    } else {
        lightTheme();
        localStorage.setItem('theme', 'light')
    }
})


function themeStorage() {
    var themeStorage = localStorage.getItem('theme');
    if (themeStorage === "light") {
        lightTheme();
    } else {
        darkTheme();
    }
};

themeStorage();

/* End Dark/Light Theme */