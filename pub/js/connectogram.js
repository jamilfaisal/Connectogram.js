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
            newBlob = new CircleBlob(name, shape, color, borderColor, x, y, size['radius'])
        }
        else if (shape === "rectangle" && size['height'] && size['width']) {
            newBlob = new RectBlob(name, shape, color, borderColor, x, y, size['height'], size['width'])
        }
        else if (shape === "ellipse" && size['radiusx'] && size['radiusy']) {
            newBlob = new EllipseBlob(name, shape, color, borderColor, x, y, size['radiusx'], size['radiusy'])
        }
        else {
            log("Invalid parameters.")
            return null
        }
        newBlob.html = addBlobtoDOM(this.root_html, newBlob)
        this.blobs.push(newBlob)
        return newBlob
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
}

class Blob {
    constructor(name, shape, color, borderColor, x, y) {
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
}

class CircleBlob extends Blob {
    constructor(name, shape, color, borderColor, x, y, radius) {
        super(name, shape, color, borderColor, x, y);
        this.radius = radius
    }
}

class RectBlob extends Blob {
    constructor(name, shape, color, borderColor, x, y, height, width) {
        super(name, shape, color, borderColor, x, y);
        this.height = height
        this.width = width
    }
}

class EllipseBlob extends Blob {
    constructor(name, shape, color, borderColor, x, y, radiusx, radiusy) {
        super(name, shape, color, borderColor, x, y);
        this.radiusx = radiusx;
        this.radiusy = radiusy;
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

/** Misc. Functions */

// Check if the object is empty
const isEmpty = (obj) => {
	return Object.keys(obj).length === 0;
}