const log = console.log

class Connectogram {
    constructor(after_html, name) {
        this.name = name;
        this.className = "cgram-" + name
        this.blobs = [];
        this.edges = {};
        this.root_html = addRoottoDOM(after_html, this.className)
    }

    addBlob(name=null, shape=null, size={}, x=0, y=0, color="white", borderColor="black") {
        if (name === null) {
            log("Could not instantiate Blob. Name missing.")
            return null
        }
        // Check for duplicates
        if (this.getBlob(name) !== null) {
            log("Duplicate name found. Choose a different name for your blob.")
            return null
        }
        if (shape === null) {
            log("Please select a shape for your blob.")
            return null
        }
        if (shape !== "rectangle" && shape !== "circle" && shape !== "ellipse") {
            log("Please select a valid shape. Ex: 'rectangle', 'circle', 'ellipse'")
            return null
        }
        if (isEmpty(size)) {
            log("Size missing.")
            return null
        }
        let newBlob;
        if (shape === "circle" && size['radius']) {
            newBlob = new CircleBlob(this, name, shape, color, borderColor, x, y, size['radius'])
        }
        else if (shape === "rectangle" && size['height'] && size['width']) {
            newBlob = new RectBlob(this, name, shape, color, borderColor, x, y, size['height'], size['width'])
        }
        else if (shape === "ellipse" && size['radiusx'] && size['radiusy']) {
            newBlob = new EllipseBlob(this, name, shape, color, borderColor, x, y, size['radiusx'], size['radiusy'])
        }
        else {
            log("Invalid parameters.")
            return null
        }
        newBlob.html = addBlobtoDOM(this.root_html, newBlob)
        this.blobs.push(newBlob)
        return newBlob
    }

    removeBlob(name) {
        const blob = this.getBlob(name);
        if (blob === null) {
            log("Blob not found.")
            return null;
        }
        this.blobs = this.blobs.filter(function(blob) {
            return blob !== blob
        })
        removeBlobFromDOM(blob);
    }

    getBlob(name) {
        const blob = this.blobs.filter(function(blob) {
            return blob.name === name
        })
        if (blob.length === 0) {
            return null
        }
        else {
            return blob[0]
        }
    }

    connect(blob1, blob2) {
        if (this.edges[blob1] === blob2) {
            log("The blobs are already connected1")
            return null
        }
        this.edges[blob1] = blob2;

    }

    changeBlobName(oldName, newName) {
        if (oldName === newName) {
            log("Same name.")
            return null
        }
        const blob = this.getBlob(oldName)
        if (blob === null) {
            log("Blob not found.")
            return null;
        }
        if (this.getBlob(newName) !== null) {
            log("Name already exists.")
            return null
        }
        blob.name = newName;
        log("Name Changed.")
        return blob
    }
}

class Blob {
    constructor(cgram, name, shape, color, borderColor, x, y) {
        this.cgram = cgram;
        this.name = name;
        this.shape = shape;
        this.x = x;
        this.y = y;
        this.color = color;
        this.borderColor = borderColor;
        this.numRows = 0;
        this.numCols = 0;
        this.html = null;
        this.text = "";
    }

    addText(text) {

    }

    changeName(newName) {
        this.cgram.changeBlobName(this.name, newName);
    }

    changeColor(newColor=this.color) {
        this.color = newColor;
        changeBlobColor(this.html, newColor);
    }

    changeBorderColor(newColor=this.borderColor) {
        this.borderColor = this.borderColor;
        changeBlobBorderColor(this.html, newColor);
    }

    setPosition(newX=this.x, newY=this.y) {
        this.x = newX;
        this.y = newY;
        setBlobPosition(this, newX, newY);
    }

    toggleHide() {
        toggleBlobHide(this.html);
    }
}

class CircleBlob extends Blob {
    constructor(cgram, name, shape, color, borderColor, x, y, radius) {
        super(cgram, name, shape, color, borderColor, x, y);
        this.radius = radius
    }

    changeRadius(newRadius=this.radius) {
        this.radius = newRadius;
        changeBlobRadius(this.html, newRadius);
    }
}

class RectBlob extends Blob {
    constructor(cgram, name, shape, color, borderColor, x, y, height, width) {
        super(cgram, name, shape, color, borderColor, x, y);
        this.height = height
        this.width = width
    }

    changeWidth(newWidth=this.width) {
        this.width = newWidth;
        changeBlobWidth(this.html, newWidth)
    }

    changeHeight(newHeight=this.height) {
        this.height = newHeight;
        changeBlobHeight(this.html, newHeight)
    }
}

class EllipseBlob extends Blob {
    constructor(cgram, name, shape, color, borderColor, x, y, radiusx, radiusy) {
        super(cgram, name, shape, color, borderColor, x, y);
        this.radiusx = radiusx;
        this.radiusy = radiusy;
    }

    changeRadius(newRadiusx=this.radiusx, newRadiusy=this.radiusy) {
        this.radiusx = newRadiusx;
        this.radiusy = newRadiusy;
        changeBlobRadiusxy(this.html, newRadiusx, newRadiusy)
    }
}

class Edge {
    constructor(type, from, to, color=null) {
        this.type = type;
        this.from = from;
        this.to = to;
        this.color = color;
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        calculatePositions()
    }

    calculatePositions() {

    }


}

/**DOM Functions */
function addRoottoDOM(after_html, className) {
    const svg = d3.select(after_html).insert("svg").attr("viewBox", "0 0 100 100").attr("preserveAspectRatio", "xMinYMax meet").classed(className, true)
    return svg
}

function addBlobtoDOM(root_html, blob) {
    const group = root_html.append("g")
    if (blob.shape === "rectangle") {
        const blobDom = group.append("rect")
        .attr("width", blob.width)
        .attr("height", blob.height)
        .attr("x", blob.x)
        .attr("y", blob.y)
        .attr("fill", blob.color)
        .attr("stroke", blob.borderColor)
        return blobDom
    }
    else if (blob.shape === "circle") {
        const blobDom = group.append("circle")
        .attr("r", blob.radius)
        .attr("cx", blob.x)
        .attr("cy", blob.y)
        .attr("fill", blob.color)
        .attr("stroke", blob.borderColor)
        return blobDom
    }
    else if (blob.shape === "ellipse") {
        const blobDom = group.append("ellipse")
        .attr("rx", blob.radiusx)
        .attr("ry", blob.radiusy)
        .attr("cx", blob.x)
        .attr("cy", blob.y)
        .attr("fill", blob.color)
        .attr("stroke", blob.borderColor)
        return blobDom
    }
    else {
        log("SOMETHING WENT WRONG")
        return null
    }
}

function addTexttoBlob(blob) {

}

function addEdgetoDOM(edge) {

}

function changeBlobWidth(blobDom, newWidth) {
    blobDom.attr("width", newWidth);
}

function changeBlobHeight(blobDom, newHeight) {
    blobDom.attr("height", newHeight);
}

function changeBlobRadius(blobDom, newRadius) {
    blobDom.attr("r", newRadius)
}

function changeBlobRadiusxy(blobDom, newRadiusx, newRadiusy) {
    blobDom.attr("rx", newRadiusx).attr("ry", newRadiusy);
}

function changeBlobColor(blobDom, newColor) {
    blobDom.attr("fill", newColor)
}

function changeBlobBorderColor(blobDom, newColor) {
    blobDom.attr("stroke", newColor)
}

function setBlobPosition(blob, newX, newY) {
    if (blob.shape === "rectangle") {
        blob.html.attr("x", newX).attr("y", newY);
    }
    else {
        blob.html.attr("cx", newX).attr("cy", newY);
    }
}

function toggleBlobHide(blobDOM) {
    if (blobDOM.attr('visibility') === "hidden") {
        blobDOM.attr("visibility", "visibile")
    }
    else {
        blobDOM.attr("visibility", "hidden")
    }
}

function removeBlobFromDOM(blob) {
    blobDOM = blob.html
    blobDOM.remove();
}


/** Misc. Functions */

// Check if the object is empty
const isEmpty = (obj) => {
	return Object.keys(obj).length === 0;
}