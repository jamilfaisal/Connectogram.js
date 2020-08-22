"use strict"; 

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