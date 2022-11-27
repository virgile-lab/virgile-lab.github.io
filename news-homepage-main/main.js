/*** Toggle Primary Nav ***/

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

/*** End Toggle Primary Nav ***/

/*** Dark/Light Theme ***/

// function activateDarkMode() {
//     // set style to dark
//   }

//   // MediaQueryList
//   const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");

//   // recommended method for newer browsers: specify event-type as first argument
//   darkModePreference.addEventListener("change", e => e.matches && activateDarkMode());


const tooltipToggleTheme = document.querySelector(".toggle-theme-tooltip");
const toggleThemeBtn = document.querySelector(".toggle-theme-btn");



/* Colors and properties of themes */

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

/* End Colors and properties of themes */

/* Browser color scheme detection */

//Detect and apply the theme matches the browser preferences, and display a tooltip message

const browserThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const browserThemeLight = window.matchMedia('(prefers-color-scheme: light)').matches;
var tooltipStorage = localStorage.getItem('tooltip');
const tooltipTimeDisplay = 5000; // Tooltip time displaying on screen

if (tooltipStorage != "true") {
    if (browserThemeDark) {

        darkTheme();
        tooltipToggleTheme.innerHTML = "Dark theme applied based on your browser preferences";
        tooltipToggleTheme.setAttribute('data-display', 'true');

        setTimeout(() => {
            tooltipToggleTheme.setAttribute('data-display', 'false');
        }, tooltipTimeDisplay)

        localStorage.setItem('theme', 'dark')
        localStorage.setItem('tooltip', 'true');

    } else if (browserThemeLight) {

        lightTheme();
        tooltipToggleTheme.innerHTML = "Light theme applied based on your browser preferences";
        tooltipToggleTheme.setAttribute('data-display', 'true');

        setTimeout(() => {
            tooltipToggleTheme.setAttribute('data-display', 'false');
        }, tooltipTimeDisplay)

        localStorage.setItem('theme', 'light')
        localStorage.setItem('tooltip', 'true');
    }
}

/* End Browser color scheme detection */

/* Apply and store the theme on click on the toggle button */

toggleThemeBtn.addEventListener('click', () => {
    var themeData = toggleThemeBtn.getAttribute('data-theme');

    if (themeData === "light") {
        darkTheme();
        localStorage.setItem('theme', 'dark');
    } else {
        lightTheme();
        localStorage.setItem('theme', 'light');
    }
});

/* End Apply and store the theme on click on the toggle button */

/* Apply the user theme choice */

function applyThemeStore() {
    var themeStore = localStorage.getItem('theme');
    if (themeStore === "light") {
        lightTheme();
    } else {
        darkTheme();
    }
};

applyThemeStore();

/* End Apply the user theme choice */

/*** End Dark/Light Theme ***/