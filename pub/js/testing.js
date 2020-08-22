function addBlob() {
    const blobName = document.querySelector('#blobName').value;
    let blobShape;

    const blobX = parseInt(document.querySelector("#blobX").value);
    const blobY = parseInt(document.querySelector("#blobY").value);
    const blobColor = document.querySelector("#blobColor").value
    const blobBorderColor = document.querySelector("#blobBorderColor").value
    const blobDraggable = document.querySelector("#blobDraggable").checked

    if (document.querySelector('#rectangle').checked) {
        blobShape = "rectangle"
        const blobHeight = parseInt(document.querySelector("#blobHeight").value);
        const blobWidth = parseInt(document.querySelector("#blobWidth").value);
        const newBlob = cg.addBlob(blobName, blobShape, {height: blobHeight, width: blobWidth}, blobX, blobY, blobColor, blobBorderColor)
        if (newBlob && blobDraggable) {
            newBlob.toggleDraggable()
        }
    }
    else if (document.querySelector('#circle').checked) {
        blobShape = "circle"
        const blobRadius = parseInt(document.querySelector("#blobRadius").value);
        const newBlob = cg.addBlob(blobName, blobShape, {radius: blobRadius}, blobX, blobY, blobColor, blobBorderColor)
        if (newBlob && blobDraggable) {
            newBlob.toggleDraggable()
        }
    }
    else if (document.querySelector('#ellipse').checked) {
        blobShape = "ellipse"
        const blobRadiusx = parseInt(document.querySelector("#blobRadiusx").value);
        const blobRadiusy = parseInt(document.querySelector("#blobRadiusy").value);
        const newBlob = cg.addBlob(blobName, blobShape, {radiusx: blobRadiusx, radiusy: blobRadiusy}, blobX, blobY, blobColor, blobBorderColor)
        if (newBlob && blobDraggable) {
            newBlob.toggleDraggable()
        }
    }
    else {
        return null;
    }
}

function connect() {
    const blob1Name = document.querySelector('#blob1Name').value;
    const blob2Name = document.querySelector('#blob2Name').value;
    const edgeLabel = document.querySelector('#edgeLabel').value;
    const edgeLabelColor = document.querySelector('#edgeLabelColor').value;
    const edgeLabelFontSize = document.querySelector('#edgeLabelFontSize').value;
    const edgeColor = document.querySelector("#edgeColor").value;
    const edgeWidth = parseInt(document.querySelector("#edgeWidth")).value;

    let blobType;

    if (document.querySelector('#edgeSolid').checked) {
        blobType = "default";
    }
    else if (document.querySelector('#edgeDotted').checked) {
        blobType = "dotted";
    }
    else if (document.querySelector('#edgeDashed').checked) {
        blobType = "dashed";
    }
    else {
        blobType = "default";
    }
    const blob1 = cg.getBlob(blob1Name);
    const blob2 = cg.getBlob(blob2Name);
    if (!(blob1 && blob2)) {
        return null;
    }
    const edge = cg.connect(blob1, blob2, blobType, edgeColor, edgeWidth)
    if (edge) {
        edge.addLabel(edgeLabel, "Verdana", edgeLabelFontSize, edgeLabelColor)
    }
}

const after_html = document.querySelector(".testdiagram")
const cg = new Connectogram(after_html, "testdiagram")