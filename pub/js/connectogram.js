const log = console.log;

class Connectogram {
    constructor(after_html, name) {
        this.root_div = this.addRootDiv(after_html, name);
        this.name = name;
        this.blobs = [];
        this.edges = {};
    }

    addRootDiv(after_html, name) {
        root_div = "<svg class='cgram-" + name + "'></svg>"
        addRoottoDOM(after_html, root_div)
        return root_div
    }

    addBlob(name=null, shape=null, size, x=0, y=0, color="white", borderColor="black", ) {
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
        newBlob = new Blob(name, shape, color, borderColor, height, width, x, y);
        newBlob.html = addBlobtoDOM(this.root_div, newBlob)
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
        this.radius = radius
    }
}

class EllipseBlob extends Blob {
    constructor(name, shape, color, borderColor, x, y, height, width) {
        super(name, shape, color, borderColor, x, y);
        this.radius = radius
    }
}

/**DOM Functions */
function addRoottoDOM(after_html, root_div) {
    $(after_html).after(root_div)
}

function addBlobtoDOM(root_div, blob) {
    if (blob.shape === "rectangle") {
        const blobDom = $("<rect />")
    }
    if (blob.shape === "circle") {
        const blobDom = $("<circle />")
        $(blobDom).attr({
            "cx"
            "fill" : blob.color,
            "stroke" : blobl.borderColor,
            ""
        })
    }
    if (blob.shape === "ellipse") {
        const blobDom = $("<ellipse />")
    }



}

function addTexttoBlob(blob) {

}