"use strict"; 

// Diagram 1 Code
const after_html = document.querySelector(".diagram-1")
const cg = new Connectogram(after_html, "diagram1")

// Blobs & Anchors
const start = cg.addBlob("start", "rectangle", {height: 100, width: 300}, 16, 146, "white", "blue")
start.addText("Johnny enters the dungeon alone", "Verdana", "20px", "center", "middle", "black")

const choice1 = cg.addBlob("choice1", "rectangle", {height: 100, width: 250}, 513, 17, "#BD2222", "darkred")
choice1.addText("Evil Bats Encounter!", "Verdana", "25px", "center", "middle", "black")

const path1 = cg.connect(start, choice1, "dotted", "darkred", 3)
path1.addLabel("Takes Left Path", "Verdana", "20px", "black")

const choice2 = cg.addBlob("choice2", "rectangle", {height: 100, width: 250}, 516, 265, "white", "green")
choice2.addText("Johnny meets a friendly cave dweller!", "Verdana", "19px", "center", "middle", "black")

const fight = cg.addBlob("fight", "ellipse", {radiusx: 50, radiusy: 35}, 960, 198, "white", "purple")
fight.addText("FIGHT!", "Verdana", "20px", "center", "middle", "black")

const winState = cg.addBlob("win", "circle", {radius: 50}, 1217, 71, "lime", "lime")
winState.addText("Exit Level", "Helvetica", "22px", "center", "middle", "blue")

const loseState = cg.addBlob("lose", "circle", {radius: 50}, 1122, 196, "black", "black")
loseState.addText("Game Over", "Arial", "23px", "center", "middle", "Red")

const ignoreAnchor = cg.addAnchor("ignorePoint", 3, 1214, 313, "lightgreen")

const runAnchor = cg.addAnchor("runAnchor", 3, 962, 68, "yellow")

// Edges
const path2 = cg.connect(start, choice2, "dotted", "green", 3)
path2.addLabel("Takes Right Path", "Verdana", "20px", "black")

const fightPath1 = cg.connect(choice1, fight, "dashed", "maroon", 3)
fightPath1.addLabel("Attack", "Verdana", "20px", "black")
const fightPath2 = cg.connect(choice2, fight, "dashed", "maroon", 3)
fightPath2.addLabel("Steal", "Verdana", "20px", "black")

const ignorePath1 = cg.connect(choice2, ignoreAnchor, "default", "darkgreen", 3)
ignorePath1.addLabel("Ignore", "Verdana", "20px", "black")
cg.connect(ignoreAnchor, winState, "default", "darkgreen", 3)

const runPath1 = cg.connect(choice1, runAnchor, "default", "#CCCC00", 3)
runPath1.addLabel("Run", "Verdana", "23px", "black")

const runPath2 = cg.connect(fight, runAnchor, "default", "#7F07FF", 3)
runPath2.addLabel("Run", "Verdana", "20px", "black")

const runPath3 = cg.connect(runAnchor, loseState, "default", "black", 3)
runPath3.addLabel("Fail","Verdana", "20px", "darkred" )

const runPath4 = cg.connect(runAnchor, winState, "default", "#006633", 3)
runPath4.addLabel("Success", "Verdana", "15px", "#7BE493" )

const fightlostPath = cg.connect(fight, loseState, "default", "black", 3)
fightlostPath.addLabel("Death", "Verdana", "17px", "darkred")


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


// Diagram 3 Code
const after_html3 = document.querySelector(".diagram-3")
const cg3 = new Connectogram(after_html3, "diagram3")
let gameCirc = null;
const timer = document.querySelector("#timer")
let clicked = false;
let startTime = null;

function startGame() {
    clicked = false;
    cg3.removeBlob("gameCirc")
    setTimeout(appear,Math.floor(Math.random() * (5500 - 3000)) + 3000);
}

function appear() {
    gameCirc = cg3.addBlob("gameCirc", "circle", {radius: 60}, 250, 100, "lightblue", "red")
    gameCirc.addText("Click Me!", "Verdana", "25px", "center", "black")
    gameCirc.addEvent("click", click);
    startTime = performance.now()
}

function click() {
    let endTime = performance.now()
    const timeElapsed = Math.round(endTime - startTime)
    if (timeElapsed > 600) {
        timer.innerHTML = timeElapsed + " milliseconds. Try Again!"
    }
    else if (timeElapsed >= 300 && timeElapsed <= 600) {
        timer.innerHTML = timeElapsed + " milliseconds. Good job!"
    }
    else {
        timer.innerHTML = timeElapsed + " milliseconds. Wow!"
    }
}
