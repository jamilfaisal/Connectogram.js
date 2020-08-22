
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function generateRect(cg) {
    const name = "blobRect" + cg.blobs.length;
    const height = getRandomInteger(25, 200)
    const width = getRandomInteger(25, 200)
    const x = getRandomInteger(25, 1300);
    const y = getRandomInteger(25, 500);
    const color = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const bordercolor = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    cg.addBlob(name, "rectangle", {height: height, width: width}, x, y, color, bordercolor).toggleDraggable()
}

function generateCircle(cg) {
    const name = "blobCirc" + cg.blobs.length;
    const radius = getRandomInteger(10, 100)
    const x = getRandomInteger(25, 1300);
    const y = getRandomInteger(25, 580);
    const color = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const bordercolor = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    cg.addBlob(name, "circle", {radius: radius}, x, y, color, bordercolor).toggleDraggable()
}

function generateEllip(cg) {
    const name = "blobEllip" + cg.blobs.length;
    const radiusx = getRandomInteger(10, 125)
    const radiusy = getRandomInteger(10, 125)
    const x = getRandomInteger(25, 1300);
    const y = getRandomInteger(25, 580);
    const color = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const bordercolor = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    cg.addBlob(name, "ellipse", {radiusx: radiusx, radiusy: radiusy}, x, y, color, bordercolor).toggleDraggable()
}

function connectRand(cg) {
    const blob1 = cg.blobs[getRandomInteger(0, cg.blobs.length)]
    const blob2 = cg.blobs[getRandomInteger(0, cg.blobs.length)]
    const types = ["default", "dotted"]
    const typeChoice = types[getRandomInteger(0, 4)]
    const color = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const strokeWidth = getRandomInteger(1, 6)
    cg.connect(blob1, blob2, typeChoice, color, strokeWidth)
}

function generateRandBlob(cg) {

    if (cg.blobs.length % 2 === 0) {
        connectRand(cg)
    }

    const choice = getRandomInteger(1, 4);
    if (choice === 1) {
        generateRect(cg)
    }
    else if (choice === 2) {
        generateCircle(cg)
    }
    else if (choice === 3) {
        generateEllip(cg)
    }
}

const after_html = document.querySelector(".svg_rand")
const cg = new Connectogram(after_html, "main_diagram")

const interval = setInterval(function() {
    generateRandBlob(cg);
  }, 3500);
