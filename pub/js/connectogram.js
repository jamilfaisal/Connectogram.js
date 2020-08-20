(function(global) {
    const log = console.log

    class Connectogram {
        constructor(after_html, name) {
            this.name = name;
            this.className = "cgram-" + name
            this.blobs = [];
            this.edges = [];
            this.root_html = this.addRoottoDOM(after_html, this.className)
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
            if (this.isEmpty(size)) {
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
            newBlob.html = this.addBlobtoDOM(this.root_html, newBlob)
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
                this.removeEdgeFromDOM(edges[i])
            }
            // Blob Removal
            this.blobs = this.blobs.filter(function(blob) {
                return blob !== blobToRemove
            })
            this.removeBlobFromDOM(blobToRemove);
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
            this.removeEdgeFromDOM(edgeToRemove);
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
                if (!this.isEmpty(blob.func)) {
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

        /* DOM Functions */
        addRoottoDOM(after_html, className) {
            const svg = d3.select(after_html).insert("svg")
            .classed(className, true)
            return svg
        }

        addBlobtoDOM(root_html, blob) {
            const group = root_html.append("g")
            if (blob.shape === "rectangle") {
                const blobDOM = group.append("rect")
                .attr("width", blob.width)
                .attr("height", blob.height)
                .attr("x", blob.x)
                .attr("y", blob.y)
                .attr("fill", blob.color)
                .attr("stroke", blob.borderColor)
                .attr("stroke-width", 3)
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
                .attr("stroke-width", 3)
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
                .attr("stroke-width", 3)
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

        removeBlobFromDOM(blob) {
            blob.html.node().parentNode.remove()
        }

        removeEdgeFromDOM(edge) {
            edge.html.remove();
        }

        // Misc. Functions

        // Check if the object is empty
        isEmpty(obj) {
            return Object.keys(obj).length === 0;
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
            this.addTexttoBlob(this, text, font_family, font_size, text_align, color)
        }

        textAlign(newTextAlign) {
            this.alignTextBlob(this.html, newTextAlign)
        }

        clearText() {
            this.text = "";
            this.removeTextFromBlob(this)
        }

        setLink(link) {
            if (this.link === "") {
                this.link = link;
                this.setLinktoBlob(this.html, link);
            }
            else {
                this.link = link
                this.changeLinktoBlob(this.html, link)
            }
        }

        clearLink() {
            if (this.link === "") {
                log("No link to remove.")
                return null
            }
            this.link = ""
            this.clearLinktoBlob(this.html)
        }

        changeName(newName) {
            this.cgram.changeBlobName(this.name, newName);
        }

        changeColor(newColor=this.color) {
            this.color = newColor;
            this.changeBlobColor(this.html, newColor);
        }

        changeBorderColor(newColor=this.borderColor) {
            this.borderColor = this.borderColor;
            this.changeBlobBorderColor(this.html, newColor);
        }

        setPosition(newX=this.x, newY=this.y) {
            this.x = newX;
            this.y = newY;
            this.updateEdges()
            this.setBlobPosition(this, newX, newY);
            if (this.shape === "rectangle") {
                this.updateTextPosition(this.html, this.x, this.y, this.width, this.height);
            }
            else if (this.shape === "circle") {
                this.updateTextPosition(this.html, this.x - this.radius/1.4, this.y - this.radius/1.4, this.radius*1.4, this.radius*1.4);
            }
            else {
                this.updateTextPosition(this.html, this.x - this.radiusx/1.4, this.y - this.radiusy/1.4, this.radiusx*1.4, this.radiusy*1.4);
            }
        }

        updateEdges() {
            const edges = this.cgram.getEdgesForBlob(this)
            for (let i=0; i < edges.length; i++) {
                edges[i].calculatePositions()
                this.updateEdgePositions(edges[i])
            }
        }

        toggleHide() {
            this.toggleBlobHide(this.html);
            const edges = this.cgram.getEdgesForBlob(this)
            for (let i=0; i < edges.length; i++) {
                this.toggleEdgeHide(edges[i].html)
            }
        }

        addEvent(eventListener, func) {
            this.func[eventListener] = func;
            this.addEventToBlob(this.html, eventListener, func);
        }

        removeEvent(eventListener) {
            delete this.func[eventListener];
            this.removeEventFromBlob(this.html, eventListener)
        }

        /* DOM Functions */

        addTexttoBlob(blob, text, font_family, font_size, text_align, color) {
            const xmlns = "http://www.w3.org/1999/xhtml"
            d3.select(blob.html.node().parentNode).select("foreignObject")
            .append("xhtml:p").text(text)
            .attr("xmlns", xmlns)
            .style("font-family", font_family)
            .style("font-size", font_size)
            .style("text-align", text_align)
            .style("color", color)
        }

        updateTextPosition(blobDOM, x, y, width, height) {
            d3.select(blobDOM.node().parentNode).select("foreignObject")
            .attr("x", x)
            .attr("y", y)
            .attr('width', width)
            .attr("height", height)
        }

        alignTextBlob(blobDOM, newTextAlign) {
            d3.select(blobDOM.node().parentNode).select("foreignObject")
            .selectAll("p").style("text-align", newTextAlign)
        }

        removeTextFromBlob(blob) {
            d3.select(blob.html.node().parentNode).select("foreignObject")
            .selectAll("p").remove()
        }

        setLinktoBlob(blobDOM, link) {
            const group = blobDOM.node().parentNode
            const root_node = group.parentNode
            d3.select(root_node).append("a")
            .attr("xlink:href", link)
            .append(function() { return group})
        }

        changeLinktoBlob(blobDOM, link) {
            const a = blobDOM.node().parentNode.parentNode
            d3.select(a).attr("xlink:href", link)
        }

        clearLinktoBlob(blobDOM) {
            const group = blobDOM.node().parentNode
            const a = group.parentNode
            const root_node = a.parentNode
            d3.select(root_node).append(function() {return group})
            a.remove()
        }

        updateEdgePositions(edge) {
            edge.html
            .attr("x1", edge.x1)
            .attr("y1", edge.y1)
            .attr("x2", edge.x2)
            .attr("y2", edge.y2)
        }

        changeBlobColor(blobDOM, newColor) {
            blobDOM.attr("fill", newColor)
        }

        changeBlobBorderColor(blobDOM, newColor) {
            blobDOM.attr("stroke", newColor)
        }

        setBlobPosition(blob, newX, newY) {
            if (blob.shape === "rectangle") {
                blob.html.attr("x", newX).attr("y", newY);
            }
            else {
                blob.html.attr("cx", newX).attr("cy", newY);
            }
        }

        toggleBlobHide(blobDOM) {
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

        toggleEdgeHide(edgeDOM) {
            if (edgeDOM.attr("visibility") === "hidden") {
                edgeDOM.attr("visibility", "visible")
            }
            else {
                edgeDOM.attr("visibility", "hidden")
            }
        }

        addEventToBlob(blobDOM, eventListener, func) {
            const foreignObject = d3.select(blobDOM.node().parentNode).select("foreignObject")
            foreignObject.on(eventListener, func);
        }

        removeEventFromBlob(blobDOM, eventListener) {
            const foreignObject = d3.select(blobDOM.node().parentNode).select("foreignObject")
            foreignObject.on(eventListener, null)
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
            this.changeBlobRadius(this.html, newRadius);
            this.updateEdges()
            super.updateTextPosition(this.html, this.x - this.radius/1.4, this.y - this.radius/1.4, this.radius*1.4, this.radius*1.4);
        }

        /* DOM functions */
        changeBlobRadius(blobDOM, newRadius) {
            blobDOM.attr("r", newRadius)
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
            this.changeBlobWidth(this.html, newWidth)
            this.updateEdges()
            super.updateTextPosition(this.html, this.x, this.y, this.width, this.height);
        }

        changeHeight(newHeight=this.height) {
            this.height = newHeight;
            this.changeBlobHeight(this.html, newHeight)
            this.updateEdges()
            super.updateTextPosition(this.html, this.x, this.y, this.width, this.height);
        }

        /* DOM Functions */

        changeBlobWidth(blobDOM, newWidth) {
            blobDOM.attr("width", newWidth);
        }

        changeBlobHeight(blobDOM, newHeight) {
            blobDOM.attr("height", newHeight);
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
            this.changeBlobRadiusxy(this.html, newRadiusx, newRadiusy)
            this.updateEdges()
            super.updateTextPosition(this.html, this.x - this.radiusx/1.4, this.y - this.radiusy/1.4, this.radiusx*1.4, this.radiusy*1.4);
        }
        
        /* DOM Functions */
        changeBlobRadiusxy(blobDOM, newRadiusx, newRadiusy) {
            blobDOM.attr("rx", newRadiusx).attr("ry", newRadiusy);
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
            this.html = this.addEdgetoDOM(root_html, this)
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

        /* DOM Functions */
        addEdgetoDOM(root_html, edge) {
            return root_html.insert("line", ":first-child")
            .attr("x1", edge.x1)
            .attr("y1", edge.y1)
            .attr("x2", edge.x2)
            .attr("y2", edge.y2)
            .style("stroke", edge.color)
            .attr("stroke-width", edge.stroke_width)
        }

    }

    global.Connectogram = global.Connectogram || Connectogram

})(window);


/**DOM Functions */




// function updateBlob(blob) {
//     if (blob.shape === "rectangle") {
//         blob.html
//         .attr("width", blob.width)
//         .attr("height", blob.height)
//         .attr("x", blob.x)
//         .attr("y", blob.y)
//         .attr("fill", blob.color)
//         .attr("stroke", blob.borderColor)
//     }
//     else if (blob.shape === "circle") {
//         blob.html
//         .attr("r", blob.radius)
//         .attr("cx", blob.x)
//         .attr("cy", blob.y)
//         .attr("fill", blob.color)
//         .attr("stroke", blob.borderColor)
//     }
//     else {
//         blob.html
//         .attr("rx", blob.radiusx)
//         .attr("ry", blob.radiusy)
//         .attr("cx", blob.x)
//         .attr("cy", blob.y)
//         .attr("fill", blob.color)
//         .attr("stroke", blob.borderColor)
//     }
// }


// function verticalAlignBlob(blobDOM) {
//     const div_height = d3.select(blobDOM.node().parentNode).select("foreignObject").attr("height")
//     d3.select(blobDOM.node().parentNode).select("foreignObject")
//     .selectAll("p").style("line-height", div_height)
// }


/**Blob Dragging Functions Below */

/** Misc. Functions */

// Get Radius
// function extractRadiusFromRect(width, height) {
//     return Math.pow(Math.pow(width, 2) + Math.pow(height, 2), 0.5)
// }

// function extractRadiusFromEllip(radiusx, radiusy) {
//     if (radiusx > radiusy) {
//         return radiusx
//     } else {
//         return radiusy
//     }
// }
