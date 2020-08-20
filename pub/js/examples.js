"use strict"; 

function examples() {
    // Diagram 1 Code
    const after_html = document.querySelector(".diagram-1")
    const cg = new Connectogram(after_html, "diagram1")
    // Blobs
    const blobRect = cg.addBlob("blobRect1", "rectangle", {height: 250, width: 175}, 0, 140, "green", "yellow")
    const blobRect2 = cg.addBlob("blobRect2", "rectangle", {height: 150, width: 140}, 850, 200, "black", "red")
    const blobCirc = cg.addBlob("blobCirc", "circle", {radius: 100}, 550, 125, "pink", "purple")
    const blobEllip = cg.addBlob("blobEllip", "ellipse", {radiusx: 150, radiusy: 80}, 450, 400, "INDIANRED", "blue")
    // Edges
    cg.connect(blobRect, blobRect2, "blue", 5)
    cg.connect(blobCirc, blobEllip, "red", 10)
    cg.connect(blobCirc, blobRect, "green", 1)
    cg.connect(blobCirc, blobRect2, "brown", 3)
    // Text
    blobRect.addText("Large Text", "Verdana", "40px", "left", "black")
    blobRect.addText("Normal Text", "Verdana", "20px", "left", "black")
    blobRect.addText("Small Text", "Verdana", "7px", "left", "black")
    blobRect.addText("Multiple sizes of text can be inserted here.", "Verdana", "20px", "left", "black")
    blobCirc.addText("", "Helvetica", "20px", "left", "black")
    blobCirc.addText("Left Text", "Times New Roman", "20px", "left", "black")
    blobCirc.addText("Center Text", "Courier", "20px", "center", "black")
    blobCirc.addText("Right Text", "Arial", "20px", "right", "black")
    blobEllip.addText("Multiple", "Sans-Serif", "20px", "center", "blue")
    blobEllip.addText("different", "Sans-Serif", "20px", "left", "darkgreen")
    blobEllip.addText("colors!", "Sans-Serif", "20px", "right", "yellow")

    // Diagram 2 Code
    const after_html2 = document.querySelector(".diagram-2")
    const cg2 = new Connectogram(after_html2, "diagram2")
    // Remove
    const removeCirc = cg2.addBlob("removeCirc", "circle", {radius: 60}, 65, 100, "lightblue", "red")
    removeCirc.addText("No! Don't", "Verdana", "30px", "center", "black")
    // Connect/Disconnect
    const connectCirc = cg2.addBlob("connectCirc1", "circle", {radius: 50}, 240, 100, "lightgreen", "purple")
    const connectRect = cg2.addBlob("connectRect", "rectangle", {height: 70, width: 100}, 345, 70, "yellow", "blue")
    // Link
    const linkRect = cg2.addBlob("linkBlob", "rectangle", {height: 80, width: 100}, 510, 10, "pink", "lightblue")
    linkRect.addText("Follow Me!", "Verdana", "27px", "center", "black")
    linkRect.setLink("https://touchpianist.com/")
    const linkRect2 = cg2.addBlob("linkBlob2", "rectangle", {height: 80, width: 100}, 510, 110, "lightblue", "pink")
    linkRect2.addText("Follow Me!", "Verdana", "27px", "center", "black")
    linkRect2.setLink("http://corndog.io/")
    // Color Change
    const colorEllip = cg2.addBlob("colorEllip", "ellipse", {radiusx: 100, radiusy: 30}, 765, 100, "black", "black")
    // Alert
    const alertCircle = cg2.addBlob("alertCirc", "circle", {radius: 55}, 955, 100, "turquoise", "red")
    alertCircle.addText("Click me!", "Arial", "27px", "center", "red")
    alertCircle.addEvent("click", function() {
        alert("This is a callback function. You can add events to all the shapes!")
        log("This is a secret message...")
    })
    // Magic!
    const magicRect = cg2.addBlob("magicRect", "rectangle", {width: 150, height: 90}, 1085, 75, "black", "black")
    magicRect.addText("", "comic-sans", "25px", "center", "yellow");
    magicRect.addText("", "comic-sans", "25px", "center", "yellow");
    magicRect.addText("Abra-cadabra!", "comic-sans", "25px", "center", "yellow");
}

examples();
