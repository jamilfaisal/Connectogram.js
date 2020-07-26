const log = console.log

class Connectogram {
    constructor(after_html, name) {
        this.name = name;
        this.className = "cgram-" + name
        this.blobs = [];
        this.edges = [];
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
        const blobToRemove = this.getBlob(name);
        if (blobToRemove === null) {
            log("Blob not found.")
            return null;
        }
        // Edge Removal
        const edges = this.getEdgesForBlob(blobToRemove)
        for (let i=0; i < edges.length; i++) {
            this.edges = this.edges.filter(function(edge) {
                return edges[i] !== edge;
            })
            removeEdgeFromDOM(edges[i])
        }
        // Blob Removal
        this.blobs = this.blobs.filter(function(blob) {
            return blob !== blobToRemove
        })
        removeBlobFromDOM(blobToRemove);
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

    connect(blob1, blob2, color="black", stroke_width=2) {
        if (this.getEdge(blob1, blob2) !== null) {
            log("The blobs are already connected")
            return null
        }
        this.edges.push(new Edge(this.root_html, "default", blob1, blob2, color, stroke_width))
    }

    disconnect(blob1, blob2) {
        const edgeToRemove = this.getEdge(blob1, blob2)
        if (edgeToRemove === null) {
            log("Edge not found.")
            return null;
        }
        this.edges = this.edges.filter(function(edge) {
            return edgeToRemove !== edge;
        })
        removeEdgeFromDOM(edgeToRemove);
    }

    getEdge(blob1, blob2) {
        const edge = this.edges.filter(function(edge) {
            return (edge.from === blob1 && edge.to === blob2) || (edge.from === blob2 && edge.to === blob1)
        })
        if (edge.length === 0) {
            return null
        }
        else {
            return edge[0]
        }
    }

    getEdgesForBlob(blob) {
        const edges = this.edges.filter(function(edge) {
            return (edge.from === blob || edge.to === blob)
        })
        return edges
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

    displayAll() {
        for (let i=0; i < this.blobs.length; i++) {
            this.displayBlob(this.blobs[i])
            log("\n")
        }
    }

    displayBlob(blob) {
        if (this.getBlob(blob.name)) {
            log("Diagram Name: " + this.name)
            log("Blob Name: " + blob.name);
            log("Shape: " + blob.shape)
            log("(x, y) Coordinates: (" + blob.x + ", " + blob.y + ")")
            if (blob.shape === "rectangle") {
                log("Width: " + blob.width + "px")
                log("Height: " + blob.height + "px")
            }
            else if (blob.shape === "circle") {
                log("Radius: " + blob.radius + "px")
            }
            else {
                log("Radius X: " + blob.radiusx + "px")
                log("Radius Y: " + blob.radiusy + "px")
            }
            log("Color: " + blob.color)
            log("Border Color: " + blob.borderColor)
            if (blob.text !== "") {
                log("Internal Text: " + blob.text)
            }
            if (blob.link !== "") {
                log("Links to: " + blob.link)
            }
            if (!isEmpty(blob.func)) {
                log("Events: ")
                const keys = Object.keys(blob.func)
                for (let i=0; i < keys.length; i++) {
                    log("Listener: " + keys[i] + ", Event: " + blob.func[keys[i]])
                }
            }
            this.displayEdges(blob)
        } else {
            log("Blob not found.")
        }
    }

    displayEdges(blob) {
        const edges = this.getEdgesForBlob(blob)
        if (edges.length === 0) {
            return null
        }
        log("Edges: ")
        for (let i=0; i < edges.length; i++) {
            log("\t " + edges[i].from.name + " -> " + edges[i].to.name)
        }
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
        this.numRows = 0;   // Implement later
        this.numCols = 0;   // Implement later
        this.html = null;
        this.text = "";
        this.link = "";
        this.func = {};
    }

    addText(text, font_family, font_size, text_align="left", color="black") {
        if (this.text === "") {
            this.text = text;
        }
        else {
            this.text = this.text + "\n" + text
        }
        addTexttoBlob(this, text, font_family, font_size, text_align, color)
    }

    textAlign(newTextAlign) {
        alignTextBlob(this.html, newTextAlign)
    }

    clearText() {
        this.text = "";
        removeTextFromBlob(this)
    }

    setLink(link) {
        if (this.link === "") {
            this.link = link;
            setLinktoBlob(this.html, link);
        }
        else {
            this.link = link
            changeLinktoBlob(this.html, link)
        }
    }

    clearLink() {
        if (this.link === "") {
            log("No link to remove.")
            return null
        }
        this.link = ""
        clearLinktoBlob(this.html)
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

    // Needs Work
    // changeShape(newShape) {
    //     if (newShape === this.shape) {
    //         log("Same shape...")
    //         return null
    //     }
    //     if (newShape !== "rectangle" || newShape !== "circle" || newShape !== "ellipse") {
    //         log("Invalid Shape.")
    //         return null
    //     }
    // }

    setPosition(newX=this.x, newY=this.y) {
        this.x = newX;
        this.y = newY;
        this.updateEdges()
        setBlobPosition(this, newX, newY);
        if (this.shape === "rectangle") {
            updateTextPosition(this.html, this.x, this.y, this.width, this.height);
        }
        else if (this.shape === "circle") {
            updateTextPosition(this.html, this.x - this.radius/1.4, this.y - this.radius/1.4, this.radius*1.4, this.radius*1.4);
        }
        else {
            updateTextPosition(this.html, this.x - this.radiusx/1.4, this.y - this.radiusy/1.4, this.radiusx*1.4, this.radiusy*1.4);
        }
    }

    updateEdges() {
        const edges = this.cgram.getEdgesForBlob(this)
        for (let i=0; i < edges.length; i++) {
            edges[i].calculatePositions()
            updateEdgePositions(edges[i])
        }
    }

    toggleHide() {
        toggleBlobHide(this.html);
        const edges = this.cgram.getEdgesForBlob(this)
        for (let i=0; i < edges.length; i++) {
            toggleEdgeHide(edges[i].html)
        }
    }

    addEvent(eventListener, func) {
        this.func[eventListener] = func;
        addEventToBlob(this.html, eventListener, func);
    }

    removeEvent(eventListener) {
        delete this.func[eventListener];
        removeEventFromBlob(this.html, eventListener)
    }
}

class CircleBlob extends Blob {
    constructor(cgram, name, shape, color, borderColor, x, y, radius) {
        super(cgram, name, shape, color, borderColor, x, y);
        this.radius = radius
    }

    getCenterX() {
        return this.x;
    }

    getCenterY() {
        return this.y
    }

    getWidth() {
        return 2*this.radius
    }

    getHeight() {
        return 2*this.radius
    }

    changeRadius(newRadius=this.radius) {
        this.radius = newRadius;
        changeBlobRadius(this.html, newRadius);
        this.updateEdges()
        updateTextPosition(this.html, this.x - this.radius/1.4, this.y - this.radius/1.4, this.radius*1.4, this.radius*1.4);
    }
}

class RectBlob extends Blob {
    constructor(cgram, name, shape, color, borderColor, x, y, height, width) {
        super(cgram, name, shape, color, borderColor, x, y);
        this.height = height
        this.width = width
    }

    getCenterX() {
        return this.x + this.width/2
    }

    getCenterY() {
        return this.y + this.height/2
    }
    
    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    changeWidth(newWidth=this.width) {
        this.width = newWidth;
        changeBlobWidth(this.html, newWidth)
        this.updateEdges()
        updateTextPosition(this.html, this.x, this.y, this.width, this.height);
    }

    changeHeight(newHeight=this.height) {
        this.height = newHeight;
        changeBlobHeight(this.html, newHeight)
        this.updateEdges()
        updateTextPosition(this.html, this.x, this.y, this.width, this.height);
    }
}

class EllipseBlob extends Blob {
    constructor(cgram, name, shape, color, borderColor, x, y, radiusx, radiusy) {
        super(cgram, name, shape, color, borderColor, x, y);
        this.radiusx = radiusx;
        this.radiusy = radiusy;
    }

    getCenterX() {
        return this.x;
    }
    
    getCenterY() {
        return this.y;
    }
    
    getWidth() {
        return 2*this.radiusx
    }
    getHeight() {
        return 2*this.radiusy
    }

    changeRadius(newRadiusx=this.radiusx, newRadiusy=this.radiusy) {
        this.radiusx = newRadiusx;
        this.radiusy = newRadiusy;
        changeBlobRadiusxy(this.html, newRadiusx, newRadiusy)
        this.updateEdges()
        updateTextPosition(this.html, this.x - this.radiusx/1.4, this.y - this.radiusy/1.4, this.radiusx*1.4, this.radiusy*1.4);
    }
}

class Edge {
    constructor(root_html, type, from, to, color, stroke_width) {
        this.type = type;
        this.from = from;
        this.to = to;
        this.color = color;
        this.stroke_width = stroke_width;
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.calculatePositions()
        this.html = addEdgetoDOM(root_html, this)
    }

    calculatePositions() {
        // const deltax = this.from.getCenterX() - this.to.getCenterX()
        // const deltay = this.from.getCenterY() - this.to.getCenterY()
        // const p1 = this.findBorderPoints(deltax, deltay, this.from.getCenterX(), this.from.getCenterY(), this.from.getWidth()/2, this.from.getHeight()/2)
        // const p2 = this.findBorderPoints(-deltax, -deltay, this.to.getCenterX(), this.to.getCenterY(), this.to.getWidth()/2, this.to.getHeight()/2)
        // this.x1 = p1[0]
        // this.y1 = p1[1]
        // this.x2 = p2[0]
        // this.y2 = p2[1]

        this.x1 = this.from.getCenterX()
        this.y1 = this.from.getCenterY()
        this.x2 = this.to.getCenterX()
        this.y2 = this.to.getCenterY()

    }

    findBorderPoints(deltax, deltay, centerx, centery, width, height) {
        const distance_ratio = Math.abs(deltay/deltax);
        const size_ratio = height/width
        let xpoint;
        let ypoint;
        if (distance_ratio < size_ratio) {
            if (deltax > 0) {
                xpoint = centerx + width
            } else {
                xpoint = centerx - width
            }
            ypoint = centery + deltay * width/Math.abs(deltax)
        } else {
            if (deltay > 0) {
                ypoint = centery + height
            } else {
                ypoint = centery - height
            }
            xpoint = centerx + deltax * height/Math.abs(deltay)
        }
        return [xpoint, ypoint]
    }

}

/**DOM Functions */
function addRoottoDOM(after_html, className) {
    const svg = d3.select(after_html).insert("svg")
    .classed(className, true)
    return svg
}

function addBlobtoDOM(root_html, blob) {
    const group = root_html.append("g")
    if (blob.shape === "rectangle") {
        const blobDOM = group.append("rect")
        .attr("width", blob.width)
        .attr("height", blob.height)
        .attr("x", blob.x)
        .attr("y", blob.y)
        .attr("fill", blob.color)
        .attr("stroke", blob.borderColor)
        // For text elements
        group.append("foreignObject")
        .attr("x", blob.x)
        .attr("y", blob.y)
        .attr('width', blob.width)
        .attr("height", blob.height)
        return blobDOM
    }
    else if (blob.shape === "circle") {
        const blobDOM = group.append("circle")
        .attr("r", blob.radius)
        .attr("cx", blob.x)
        .attr("cy", blob.y)
        .attr("fill", blob.color)
        .attr("stroke", blob.borderColor)
        // For text elements
        group.append("foreignObject")
        .attr("x", blob.x - blob.radius/1.4)
        .attr("y", blob.y - blob.radius/1.4)
        .attr('width', blob.radius*1.4)
        .attr("height", blob.radius*1.4)
        return blobDOM
    }
    else if (blob.shape === "ellipse") {
        const blobDOM = group.append("ellipse")
        .attr("rx", blob.radiusx)
        .attr("ry", blob.radiusy)
        .attr("cx", blob.x)
        .attr("cy", blob.y)
        .attr("fill", blob.color)
        .attr("stroke", blob.borderColor)
        // For text elements
        group.append("foreignObject")
        .attr("x", blob.x - blob.radiusx/1.4)
        .attr("y", blob.y - blob.radiusy/1.4)
        .attr('width', blob.radiusx*1.4)
        .attr("height", blob.radiusy*1.4)
        return blobDOM
    }
    else {
        log("SOMETHING WENT WRONG")
        return null
    }
}

function updateBlob(blob) {
    if (blob.shape === "rectangle") {
        blob.html
        .attr("width", blob.width)
        .attr("height", blob.height)
        .attr("x", blob.x)
        .attr("y", blob.y)
        .attr("fill", blob.color)
        .attr("stroke", blob.borderColor)
    }
    else if (blob.shape === "circle") {
        blob.html
        .attr("r", blob.radius)
        .attr("cx", blob.x)
        .attr("cy", blob.y)
        .attr("fill", blob.color)
        .attr("stroke", blob.borderColor)
    }
    else {
        blob.html
        .attr("rx", blob.radiusx)
        .attr("ry", blob.radiusy)
        .attr("cx", blob.x)
        .attr("cy", blob.y)
        .attr("fill", blob.color)
        .attr("stroke", blob.borderColor)
    }
}

function addTexttoBlob(blob, text, font_family, font_size, text_align, color) {
    const xmlns = "http://www.w3.org/1999/xhtml"
    d3.select(blob.html.node().parentNode).select("foreignObject")
    .append("xhtml:p").text(text)
    .attr("xmlns", xmlns)
    .style("font-family", font_family)
    .style("font-size", font_size)
    .style("text-align", text_align)
    .style("color", color)
}

function updateTextPosition(blobDOM, x, y, width, height) {
    d3.select(blobDOM.node().parentNode).select("foreignObject")
    .attr("x", x)
    .attr("y", y)
    .attr('width', width)
    .attr("height", height)
}

function alignTextBlob(blobDOM, newTextAlign) {
    d3.select(blobDOM.node().parentNode).select("foreignObject")
    .selectAll("p").style("text-align", newTextAlign)
}

// function verticalAlignBlob(blobDOM) {
//     const div_height = d3.select(blobDOM.node().parentNode).select("foreignObject").attr("height")
//     d3.select(blobDOM.node().parentNode).select("foreignObject")
//     .selectAll("p").style("line-height", div_height)
// }

function removeTextFromBlob(blob) {
    d3.select(blob.html.node().parentNode).select("foreignObject")
    .selectAll("p").remove()
}

function setLinktoBlob(blobDOM, link) {
    const group = blobDOM.node().parentNode
    const root_node = group.parentNode
    d3.select(root_node).append("a")
    .attr("xlink:href", link)
    .append(function() { return group})
}

function changeLinktoBlob(blobDOM, link) {
    const a = blobDOM.node().parentNode.parentNode
    d3.select(a).attr("xlink:href", link)
}

function clearLinktoBlob(blobDOM) {
    const group = blobDOM.node().parentNode
    const a = group.parentNode
    const root_node = a.parentNode
    d3.select(root_node).append(function() {return group})
    a.remove()
}

function addEdgetoDOM(root_html, edge) {
    return root_html.insert("line", ":first-child")
    .attr("x1", edge.x1)
    .attr("y1", edge.y1)
    .attr("x2", edge.x2)
    .attr("y2", edge.y2)
    .style("stroke", edge.color)
    .attr("stroke-width", edge.stroke_width)
}

function updateEdgePositions(edge) {
    edge.html
    .attr("x1", edge.x1)
    .attr("y1", edge.y1)
    .attr("x2", edge.x2)
    .attr("y2", edge.y2)
}

function changeBlobWidth(blobDOM, newWidth) {
    blobDOM.attr("width", newWidth);
}

function changeBlobHeight(blobDOM, newHeight) {
    blobDOM.attr("height", newHeight);
}

function changeBlobRadius(blobDOM, newRadius) {
    blobDOM.attr("r", newRadius)
}

function changeBlobRadiusxy(blobDOM, newRadiusx, newRadiusy) {
    blobDOM.attr("rx", newRadiusx).attr("ry", newRadiusy);
}

function changeBlobColor(blobDOM, newColor) {
    blobDOM.attr("fill", newColor)
}

function changeBlobBorderColor(blobDOM, newColor) {
    blobDOM.attr("stroke", newColor)
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
        d3.select(blobDOM.node().parentNode).select("foreignObject")
        .selectAll("p")
        .style("visibility", "visible")
    }
    else {
        blobDOM.attr("visibility", "hidden")
        d3.select(blobDOM.node().parentNode).select("foreignObject")
        .selectAll("p")
        .style("visibility", "hidden")
    }
}

function toggleEdgeHide(edgeDOM) {
    if (edgeDOM.attr("visibility") === "hidden") {
        edgeDOM.attr("visibility", "visible")
    }
    else {
        edgeDOM.attr("visibility", "hidden")
    }
}
function removeBlobFromDOM(blob) {
    blob.html.node().parentNode.remove()
}

function removeEdgeFromDOM(edge) {
    edge.html.remove();
}

function addEventToBlob(blobDOM, eventListener, func) {
    blobDOM.on(eventListener, func);
}

function removeEventFromBlob(blobDOM, eventListener) {
    blobDOM.on(eventListener, null)
}

/**Blob Dragging Functions Below */

/** Misc. Functions */

// Check if the object is empty
const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

// Get Radius
function extractRadiusFromRect(width, height) {
    return Math.pow(Math.pow(width, 2) + Math.pow(height, 2), 0.5)
}

function extractRadiusFromEllip(radiusx, radiusy) {
    if (radiusx > radiusy) {
        return radiusx
    } else {
        return radiusy
    }
}

// Export SVG Image
// function exportSVG(cgram) {
//     const svg = cgram.root_html;

//     const serializer = new XMLSerializer();
//     const source = serializer.serializeToString(svg)


// }