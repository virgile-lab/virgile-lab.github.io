const firstGradientColor = ["#f42a85", "#642dbe", "#00aeb8", "#f4c434", "#f3851f"];
const secondGradientColor = ["transparent"];

function randomPickFirstColor() {
    let numberOfColors = firstGradientColor.length - 1; // Number of colors in the array
    let randomNumber = Math.floor(Math.random() * (numberOfColors + 1)); // generate a number between 0 and (numberOfColors + 1)
    let pickColor = firstGradientColor[randomNumber] // pick randomly a color in the array
    return pickColor // return the color picked in the array
}

function randomPickSecondColor() {
    let numberOfColors = secondGradientColor.length - 1; //
    let randomNumber = Math.floor(Math.random() * (numberOfColors + 1)); // generate a number between 0 and (numberOfColors + 1)
    let pickColor = secondGradientColor[randomNumber] // pick randomly a color in the array
    return pickColor // return the color picked in the array
}

function randomGradient() {
    let gradient = 'linear-gradient(' + randomPickFirstColor() + ', ' + randomPickSecondColor() + ')'; // generate a linear gradient where randomPickFirstColor() is the first color and randomPickSecondColor() is the second color
    return gradient // return the linear gradient
}

function fillItemsBackground() {
    const items = document.querySelectorAll('.random-linear-gradient');
    for (var i = 0; i < items.length; i++) { // for each selected class...
        items[i].style.background = randomGradient(); // change their background properties with randomGradient()
    }
}

fillItemsBackground()