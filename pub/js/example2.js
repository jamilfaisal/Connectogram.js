"use strict"; 

// Diagram 2 Code
const after_html2 = document.querySelector(".diagram-2")
const cg2 = new Connectogram(after_html2, "diagram2")

const circ1 = cg2.addBlob("circ1", "circle", {radius: 6}, 610, 15, "red", "red")
circ1.addEvent("click", nextPicture.bind(this, 0))
const circ2 = cg2.addBlob("circ2", "circle", {radius: 6}, 637, 15, "green", "green")
circ2.addEvent("click", nextPicture.bind(this, 1))
const circ3 = cg2.addBlob("circ3", "circle", {radius: 6}, 665, 15, "blue", "blue")
circ3.addEvent("click", nextPicture.bind(this, 2))
const circ4 = cg2.addBlob("circ4", "circle", {radius: 6}, 693, 15, "purple", "purple")
circ4.addEvent("click", nextPicture.bind(this, 3))

function nextPicture(num) {
    const pictures = ['./img/boxy.png', "./img/creeper.png", "./img/dinosaur.png", "./img/potato_head.png"]
    const picture = document.querySelector("#picture");
    picture.setAttribute('src', pictures[num])
    console.log(picture)
}