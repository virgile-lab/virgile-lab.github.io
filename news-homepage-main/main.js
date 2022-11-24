const toggleMenu = document.querySelector(".toggle-menu");
const primaryNav = document.querySelector(".primary-nav");
const bodyDocument = document.querySelector("body");
const screenOverlay = document.querySelector(".screen-overlay");
var viewportWidth = window.innerWidth;
var a = false;

function vSize() {
    window.onresize = function() {
        viewportWidth = window.innerWidth;
        if (viewportWidth >= 768) {
            console.log("sup");
            bodyDocument.style.overflowY = "scroll";
            primaryNav.setAttribute('data-visible', 'false');

        }
    }
}

vSize();

toggleMenu.addEventListener('click', () => {

    var visibility = primaryNav.getAttribute('data-visible');

    if (visibility === 'false') {
        bodyDocument.style.overflowY = "hidden";
        primaryNav.setAttribute('data-visible', 'true');;
    } else {
        bodyDocument.style.overflowY = "scroll";
        primaryNav.setAttribute('data-visible', 'false');
    }

});

screenOverlay.addEventListener('click', () => {

    bodyDocument.style.overflowY = "scroll";
    primaryNav.setAttribute('data-visible', 'false');

});