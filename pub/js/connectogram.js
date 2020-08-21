(function(global) {
    const log = console.log

    // Main Diagram Class
    class Connectogram {
        constructor(after_html, name) {
            this.name = name;   // For identification
            this.className = "cgram-" + name    // For CSS Styling
            this.blobs = [];    // Stores a list of all blobs in this diagram
            this.edges = [];    // Stores a list of all connections between blobs
            this.root_html = this.addRoottoDOM(after_html, this.className)  // refernce to d3.js element
        }

        // Adds a Blob to the diagram
        addBlob(name=null, shape=null, size={}, x=0, y=0, color="white", borderColor="black") {
            // Edge Cases
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
            // Create new Blob based on shape
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
            // Add to DOM
            newBlob.html = this.addBlobtoDOM(this.root_html, newBlob)
            // Add to Blob List
            this.blobs.push(newBlob)
            // Return a reference to the new Blob
            return newBlob
        }

        // Remove a Blob by its unique name
        removeBlob(name) {
            // Get the Blob
            const blobToRemove = this.getBlob(name);
            if (blobToRemove === null) {
                log("Blob not found.")
                return null;
            }
            // Remove all edges associated with it
            const edges = this.getEdgesForBlob(blobToRemove)
            for (let i=0; i < edges.length; i++) {
                this.edges = this.edges.filter(function(edge) {
                    return edges[i] !== edge;
                })
                this.removeEdgeFromDOM(edges[i])
            }
            // Remove the Blob
            this.blobs = this.blobs.filter(function(blob) {
                return blob !== blobToRemove
            })
            // Remove from the DOM
            this.removeBlobFromDOM(blobToRemove);
        }

        // Return a reference to the Blob by its unique name
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

        // Create an Edge between two Blobs
        connect(blob1, blob2, type="default", color="black", stroke_width=2) {
            // Edge must be unique
            if (this.getEdge(blob1, blob2) !== null) {
                log("The blobs are already connected")
                return null
            }
            // Create the edge
            const newEdge = new Edge(this.root_html, type, blob1, blob2, color, stroke_width)
            this.edges.push(newEdge)
            // Return a reference to the new Edge
            return newEdge;
        }

        // Remove the edge between two Blobs
        disconnect(blob1, blob2) {
            // Find the Edge
            const edgeToRemove = this.getEdge(blob1, blob2)
            if (edgeToRemove === null) {
                log("Edge not found.")
                return null;
            }
            // Remove the Edge
            this.edges = this.edges.filter(function(edge) {
                return edgeToRemove !== edge;
            })
            // Remove from DOM
            this.removeEdgeFromDOM(edgeToRemove);
        }

        // Get a reference to the Edge based on its endpoints
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

        // Get all Edges associated with a Blob
        getEdgesForBlob(blob) {
            const edges = this.edges.filter(function(edge) {
                return (edge.from === blob || edge.to === blob)
            })
            return edges
        }

        // Change the Blob's unique name
        changeBlobName(oldName, newName) {
            // Edge Cases
            if (oldName === newName) {
                log("Same name.")
                return null
            }
            // Get the Blob
            const blob = this.getBlob(oldName)
            if (blob === null) {
                log("Blob not found.")
                return null;
            }
            // Check if name is unique
            if (this.getBlob(newName) !== null) {
                log("Name already exists.")
                return null
            }
            // Set the new Name
            blob.name = newName;
            log("Name Changed.")
            return blob
        }

        // Display information on all Blobs
        displayAll() {
            for (let i=0; i < this.blobs.length; i++) {
                this.displayBlob(this.blobs[i])
                log("\n")
            }
        }

        // Display information on a specific Blob
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

        // Display all Edges associated with a Blob
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
        // Add the Connectogram after the HTML element
        addRoottoDOM(after_html, className) {
            const svg = d3.select(after_html).insert("svg")
            .classed(className, true)
            .on("load", this.makeDraggable.bind(this)); // Allows draggability for all elements in the diagram
            return svg
        }

        // Add the Blob to the DOM and return a reference to the d3.js element
        // Uses d3.js to append an SVG element to the DOM
        addBlobtoDOM(root_html, blob) {
            // Create a group
            const group = root_html.append("g")
            // Rectangle Blob
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
                .append("xhtml:div")
                .style("display", "table")  // For alignment
                .style('width', blob.width + "px")
                .style("height", blob.height + "px")
                return blobDOM
            }
            // Circle Blob
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
                .append("xhtml:div")
                .style("display", "table")
                .style('width', blob.radius*1.4 + "px")
                .style("height", blob.radius*1.4 + "px")
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
                .append("xhtml:div")
                .style("display", "table")
                .style('width', blob.radiusx*1.4 + "px")
                .style("height", blob.radiusy*1.4 + "px")
                return blobDOM
            }
            else {
                log("SOMETHING WENT WRONG")
                return null
            }
        }

        // Remove the Blob DOM element using d3.js
        removeBlobFromDOM(blob) {
            blob.html.node().parentNode.remove()
        }

        // Remove the Edge DOM element using d3.js
        removeEdgeFromDOM(edge) {
            edge.html.node().parentNode.remove();
        }

        /* Drag Functions */
        // Logic inherited from http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
        // Code was (heavily) adjusted based on Blob and Edge properties
        makeDraggable() {
            const svg = d3.event.target;    // The main SVG element
            const self = this   // Connectogram Reference
            svg.addEventListener('mousedown', startDrag);
            svg.addEventListener('mousemove', drag);
            svg.addEventListener('mouseup', endDrag);
            svg.addEventListener('mouseleave', endDrag);
            
            let selectedHTMLElement = null; // Keeps track of the DOM element
            let offset = null;  // Offset the center coordinates if a rectangle is dragged
            let selectedBlob = null;    // A reference to the Blob element that is dragged
            // On mouse down
            function startDrag(evt) {
                const target = evt.target;
                let group = null;
                // Get the main group element based on what is being clicked on
                if (target.nodeName === "foreignObject" || target.nodeName === "rect" || target.nodeName === "ellipse" || target.nodeName === "circle") {
                    group = target.parentElement;
                }
                else {
                    group = null;
                }
                // Check if the Blob is draggable
                if (group && group.classList.contains("cg-draggable")) {
                    // Get the Blob DOM element
                    selectedBlob = getBlobFromDOM(group.firstChild);
                    if (selectedBlob) {
                        selectedHTMLElement = group.firstChild;
                    }
                    // Set the offset based on mouse coordinates
                    offset = getMousePosition(evt);
                    offset.x -= parseFloat(selectedHTMLElement.getAttributeNS(null, "x"));
                    offset.y -= parseFloat(selectedHTMLElement.getAttributeNS(null, "y"));
                }
            }

            // Main Drag Function
            function drag(evt) {
                // Only if dragged element is valid
                if (selectedHTMLElement && selectedBlob) {
                    evt.preventDefault();   // Prevents highlighting
                    // Get Mouse coordinates
                    const coord = getMousePosition(evt);
                    // Set new X and Y coordinates based on offset (or not)
                    let newX = null;
                    let newY = null; 
                    if (selectedBlob.shape === "rectangle") {
                        newX = coord.x - offset.x;
                        newY = coord.y - offset.y
                    }
                    else if (selectedBlob.shape === "circle" || selectedBlob.shape === "ellipse") {
                        newX = coord.x;
                        newY = coord.y;
                    }
                    // Update Blob DOM element
                    selectedHTMLElement.setAttributeNS(null, "x", newX);
                    selectedHTMLElement.setAttributeNS(null, "y", newY);
                    // Update Blob properties and Edge & Text DOM elements
                    selectedBlob.setPosition(newX, newY)
                }
            }

            // Reset selected elements to null
            function endDrag(evt) {
                selectedHTMLElement = null;
                selectedBlob = null;
            }

            // Get a reference to the Blob based on its DOM element
            function getBlobFromDOM(blobDOM) {
                const blobs = self.blobs.filter((blob) => {
                    return blob.html.node() === blobDOM
                })
                if (blobs.length > 0) {
                    return blobs[0]
                } else {
                    return null;
                }
            }

            // Gets Mouse coordinates
            function getMousePosition(evt) {
                const CTM = svg.getScreenCTM();
                return {
                    x: (evt.clientX - CTM.e) / CTM.a,
                    y: (evt.clientY - CTM.f) / CTM.d
                };
            }
        }

        // Misc. Functions
        
        // Check if the object is empty
        isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }
    }

    // Blob SuperClass
    class Blob {
        constructor(cgram, name, shape, color, borderColor, x, y) {
            this.cgram = cgram; // Reference to its Connectogram
            this.name = name;   // Unique name identifier
            this.shape = shape; // "rectangle", "circle", or "ellipse"
            // x and y coordinates
            this.x = x; 
            this.y = y;
            // Style properties
            this.color = color;
            this.borderColor = borderColor;
            this.html = null;   // Reference to the DOM element
            this.text = ""; // Text the Blob contains
            this.link = ""; // Hyperlink to another webpage
            this.func = {}; // Callback function
            this.draggable = false; // Whether element is draggable or not
        }

        // Adds Text to the Blob
        addText(text, font_family, font_size, text_align="left", vertical_align="top", color="black") {
            if (this.text === "") {
                this.text = text;
            }
            else {
                this.text = this.text + "\n" + text
            }
            // Update DOM element
            this.addTexttoBlob(this, text, font_family, font_size, text_align, vertical_align, color)
        }

        // Align Text
        textAlign(newTextAlign) {
            this.alignTextBlob(this.html, newTextAlign)
        }

        // Remove all Text in the Blob
        clearText() {
            this.text = "";
            this.removeTextFromBlob(this)
        }

        // Set hyperlink
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

        // Remove hyperlink
        clearLink() {
            if (this.link === "") {
                log("No link to remove.")
                return null
            }
            this.link = ""
            this.clearLinktoBlob(this.html)
        }

        // Update the unique Name
        changeName(newName) {
            this.cgram.changeBlobName(this.name, newName);
        }

        // Change Style Properties
        changeColor(newColor=this.color) {
            this.color = newColor;
            this.changeBlobColor(this.html, newColor);
        }
    
        changeBorderColor(newColor=this.borderColor) {
            this.borderColor = this.borderColor;
            this.changeBlobBorderColor(this.html, newColor);
        }

        // Update position in Connectogram (used in dragging functions as well)
        setPosition(newX=this.x, newY=this.y) {
            this.x = newX;
            this.y = newY;
            this.updateEdges()  // Update Edge positions
            this.setBlobPosition(this, newX, newY); // Update DOM element
            // Update Text Positioning
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

        // Update Edge locations
        updateEdges() {
            // Get all edges
            const edges = this.cgram.getEdgesForBlob(this)
            for (let i=0; i < edges.length; i++) {
                edges[i].calculatePositions()
                this.updateEdgePositions(edges[i])
                this.updateEdgeLabel(edges[i])
            }
        }

        // Hide or Unhide Blob Element
        toggleHide() {
            this.toggleBlobHide(this.html);
            // Hide all Edges associated with Blob
            const edges = this.cgram.getEdgesForBlob(this)
            for (let i=0; i < edges.length; i++) {
                this.toggleEdgeHide(edges[i].html)
            }
        }

        // Add event listener to Blob
        addEvent(eventListener, func) {
            this.func[eventListener] = func;
            this.addEventToBlob(this.html, eventListener, func);
        }

        // Remove the Event Listener from the Blob
        removeEvent(eventListener) {
            delete this.func[eventListener];
            this.removeEventFromBlob(this.html, eventListener)
        }

        // Set or Unset the Blob element to be draggable
        toggleDraggable() {
            this.draggable = !this.draggable;
            if (this.draggable) {
                this.setDraggable(this.html);
            } else {
                this.unsetDraggable(this.html)
            }
        }

        /* DOM Functions - All SVG manipulation was done using d3.js*/
        
        // Update the Mouse cursor styling
        setDraggable(blobDOM) {
            d3.select((blobDOM.node().parentNode)).classed('cg-draggable', true)
        }

        // Update the Mouse cursor styling
        unsetDraggable(blobDOM) {
            d3.select((blobDOM.node().parentNode)).classed('cg-draggable', false)
        }

        // Add Text (SVG element) as a new row in the Div Table
        addTexttoBlob(blob, text, font_family, font_size, text_align, vertical_align, color) {
            const xmlns = "http://www.w3.org/1999/xhtml"
            d3.select(blob.html.node().parentNode).select("foreignObject")
            .select("div")
            .append("xhtml:div")
            .style("display", "table-row")
            .append("xhtml:p").text(text)
            .attr("xmlns", xmlns)
            .style("font-family", font_family)
            .style("font-size", font_size)
            .style("text-align", text_align)
            .style("vertical-align", vertical_align)
            .style("color", color)
            .style("display", "table-cell")
        }

        // Update Postioning of the Text
        updateTextPosition(blobDOM, x, y, width, height) {
            d3.select(blobDOM.node().parentNode).select("foreignObject")
            .attr("x", x)
            .attr("y", y)
            .attr('width', width)
            .attr("height", height)
        }

        // Text Align - "left", "center", "right"
        alignTextBlob(blobDOM, newTextAlign) {
            d3.select(blobDOM.node().parentNode).select("foreignObject")
            .selectAll("p").style("text-align", newTextAlign)
        }

        // Remove all text from the Blob DOM element
        removeTextFromBlob(blob) {
            d3.select(blob.html.node().parentNode).select("foreignObject").select("div")
            .selectAll("div").remove()
        }

        // Add hyperlink to the Blob DOM element
        setLinktoBlob(blobDOM, link) {
            const group = blobDOM.node().parentNode
            const root_node = group.parentNode
            d3.select(root_node).append("a")
            .attr("xlink:href", link)
            .append(function() { return group})
        }

        // Set to a new hyperlink
        changeLinktoBlob(blobDOM, link) {
            const a = blobDOM.node().parentNode.parentNode
            d3.select(a).attr("xlink:href", link)
        }

        // Remove the hyperlink from the Blob element
        clearLinktoBlob(blobDOM) {
            const group = blobDOM.node().parentNode
            const a = group.parentNode
            const root_node = a.parentNode
            d3.select(root_node).append(function() {return group})
            a.remove()
        }

        // Update X and Y coordinates of the Edge DOM element based on the Edge element
        updateEdgePositions(edge) {
            edge.html
            .attr("x1", edge.x1)
            .attr("y1", edge.y1)
            .attr("x2", edge.x2)
            .attr("y2", edge.y2)
        }

        // Update Label positioning and rotation based on the Edge element
        updateEdgeLabel(edge) {
            // Center position of the edge
            const x = (edge.x2+edge.x1)/ 2
            const y = (edge.y2+edge.y1)/2
            // Rotation value of the Label in Radians
            const rotateValueRadians = Math.atan(Math.abs((edge.y2-edge.y1))/Math.abs((edge.x2-edge.x1)))
            // Set to right-hand rotation or left-hand rotation based on the endpoints of the Edge
            let rotateValue;
            if (edge.x2 > edge.x1) {
                if (edge.y2 > edge.y1) {
                    rotateValue = rotateValueRadians * (180/Math.PI)
                }
                else {
                    rotateValue = (rotateValueRadians * (180/Math.PI))*-1
                }
            }
            else {
                if (edge.y2 > edge.y1) {
                    rotateValue = rotateValueRadians * (180/Math.PI)*-1
                }
                else {
                    rotateValue = (rotateValueRadians * (180/Math.PI))
                }
            }
            // Set the DOM's attributes
            const rotatelabel = "rotate(" + rotateValue + ", " + x + "," + y + ") "
            d3.select(edge.html.node().parentElement).select("text")
            .attr("x", (edge.x2+edge.x1)/ 2 - 5*edge.label.length)
            .attr("y", (edge.y2+edge.y1 - edge.stroke_width)/2)
            .attr("transform", rotatelabel)
        }

        // Change Style Properties
        changeBlobColor(blobDOM, newColor) {
            blobDOM.attr("fill", newColor)
        }

        changeBlobBorderColor(blobDOM, newColor) {
            blobDOM.attr("stroke", newColor)
        }

        // Set the Blob's DOM element's positioning based on the Blob element
        setBlobPosition(blob, newX, newY) {
            if (blob.shape === "rectangle") {
                blob.html.attr("x", newX).attr("y", newY);
            }
            else {
                blob.html.attr("cx", newX).attr("cy", newY);
            }
        }

        // Change Blob DOM's element to be hidden or unhidden
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

        // Hide/Unhide the Edge's DOM element
        toggleEdgeHide(edgeDOM) {
            if (edgeDOM.attr("visibility") === "hidden") {
                edgeDOM.attr("visibility", "visible")
            }
            else {
                edgeDOM.attr("visibility", "hidden")
            }
        }

        // Add event listener to the DOM element
        addEventToBlob(blobDOM, eventListener, func) {
            const foreignObject = d3.select(blobDOM.node().parentNode).select("foreignObject")
            foreignObject.on(eventListener, func);
        }
        
        // Remove the event listener (set to NULL)
        removeEventFromBlob(blobDOM, eventListener) {
            const foreignObject = d3.select(blobDOM.node().parentNode).select("foreignObject")
            foreignObject.on(eventListener, null)
        }
    }

    // Circle Element - Extends the Blob Superclass
    class CircleBlob extends Blob {
        constructor(cgram, name, shape, color, borderColor, x, y, radius) {
            super(cgram, name, shape, color, borderColor, x, y);
            this.radius = radius
        }

        // Get coordinates and dimensions
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

        // Set to a new Radius
        changeRadius(newRadius=this.radius) {
            this.radius = newRadius;
            this.changeBlobRadius(this.html, newRadius);
            // Update Edges and Text positioning
            this.updateEdges()
            super.updateTextPosition(this.html, this.x - this.radius/1.4, this.y - this.radius/1.4, this.radius*1.4, this.radius*1.4);
        }

        /* DOM functions using d3.js */
        changeBlobRadius(blobDOM, newRadius) {
            blobDOM.attr("r", newRadius)
        }
    }

    // Rectangle Element - Extends the Blob Class
    class RectBlob extends Blob {
        constructor(cgram, name, shape, color, borderColor, x, y, height, width) {
            super(cgram, name, shape, color, borderColor, x, y);
            this.height = height
            this.width = width
        }

        // Get coordinates and dimensions
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

        // Change Dimensions
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

        /* DOM Functions using d3.js*/

        changeBlobWidth(blobDOM, newWidth) {
            blobDOM.attr("width", newWidth);
        }

        changeBlobHeight(blobDOM, newHeight) {
            blobDOM.attr("height", newHeight);
        }
    }

    // Ellipse element - Extends the Blob Class
    class EllipseBlob extends Blob {
        constructor(cgram, name, shape, color, borderColor, x, y, radiusx, radiusy) {
            super(cgram, name, shape, color, borderColor, x, y);
            this.radiusx = radiusx;
            this.radiusy = radiusy;
        }

        // Get dimensions and coordinates
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

        // Change dimensions
        changeRadius(newRadiusx=this.radiusx, newRadiusy=this.radiusy) {
            this.radiusx = newRadiusx;
            this.radiusy = newRadiusy;
            this.changeBlobRadiusxy(this.html, newRadiusx, newRadiusy)
            this.updateEdges()
            super.updateTextPosition(this.html, this.x - this.radiusx/1.4, this.y - this.radiusy/1.4, this.radiusx*1.4, this.radiusy*1.4);
        }
        
        /* DOM Functions using d3.js*/
        changeBlobRadiusxy(blobDOM, newRadiusx, newRadiusy) {
            blobDOM.attr("rx", newRadiusx).attr("ry", newRadiusy);
        }
    }

    // Edge Class - Connects between two Blobs
    class Edge {
        constructor(root_html, type, from, to, color, stroke_width) {
            this.type = type;
            this.from = from;
            this.to = to;
            this.color = color;
            this.stroke_width = stroke_width;
            this.label = "";
            this.x1 = 0;
            this.y1 = 0;
            this.x2 = 0;
            this.y2 = 0;
            this.calculatePositions()
            this.html = this.addEdgetoDOM(root_html, this)
        }

        // Attaches to the center of each Blob element
        calculatePositions() {
            this.x1 = this.from.getCenterX()
            this.y1 = this.from.getCenterY()
            this.x2 = this.to.getCenterX()
            this.y2 = this.to.getCenterY()
        }

        // Unused Method - Maybe for Intersections later?
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

        /* DOM Functions using d3.js */
        // Add Edge to the DOM
        addEdgetoDOM(root_html, edge) {
            let edgeStroke = null
            if (edge.type === "dotted") {
                edgeStroke = "5, 5"
            } 
            else if (edge.type === "dashed") {
                edgeStroke = "10,10"
            }
            else {
                edgeStroke = ""
            }
            return root_html.insert("g", ":first-child").append("line")
            .attr("x1", edge.x1)
            .attr("y1", edge.y1)
            .attr("x2", edge.x2)
            .attr("y2", edge.y2)
            .style("stroke", edge.color)
            .attr("stroke-width", edge.stroke_width)
            .attr("stroke-dasharray", edgeStroke)
        }

        // Adds a label to the center of the Edge
        addLabel(label, font_family, font_size, color="black") {
            if (this.label === "") {
                this.label = label
                this.addLabeltoEdge(this, label, font_family, font_size, color)
            } else {
                this.label = this.label + " " + label
                this.addToLabel(this, this.label, font_family, font_size, color)
            }
        }

        // Appends a new Text element to the edge and calculates rotation/positoning
        addLabeltoEdge(edge, label, font_family, font_size, color) {
            // Center coordinates of the Edge
            const x = (edge.x2+edge.x1)/ 2
            const y = (edge.y2+edge.y1)/2
            // Some Math to calculate rotations
            const rotateValueRadians = Math.atan(Math.abs((edge.y2-edge.y1))/Math.abs((edge.x2-edge.x1)))
            // Set to postive or negative based on Blob coordinates (righthand/lefthand rotations)
            let rotateValue;
            if (edge.x2 > edge.x1) {
                if (edge.y2 > edge.y1) {
                    rotateValue = rotateValueRadians * (180/Math.PI)
                }
                else {
                    rotateValue = (rotateValueRadians * (180/Math.PI))*-1
                }
            }
            else {
                if (edge.y2 > edge.y1) {
                    rotateValue = rotateValueRadians * (180/Math.PI)*-1
                }
                else {
                    rotateValue = (rotateValueRadians * (180/Math.PI))
                }
            }
            // Add the Label to the DOM
            const rotatelabel = "rotate(" + rotateValue + ", " + x + "," + y + ") "
            d3.select(edge.html.node().parentElement).append("text")
            .attr("x", (edge.x2+edge.x1)/ 2 - 5*label.length)
            .attr("y", (edge.y2+edge.y1 )/2 - edge.stroke_width)
            .attr("transform", rotatelabel)
            .style("font-family", font_family)
            .style("font-size", font_size)
            .attr("fill", color)
            .text(label)
        }

        // Same as addLabeltoEdge() method, but adds to already existing Label
        addToLabel(edge, label, font_family, font_size, color) {
            const x = (edge.x2+edge.x1)/ 2
            const y = (edge.y2+edge.y1)/2
            const rotateValueRadians = Math.atan(Math.abs((edge.y2-edge.y1))/Math.abs((edge.x2-edge.x1)))
            let rotateValue;
            if (edge.x2 > edge.x1) {
                if (edge.y2 > edge.y1) {
                    rotateValue = rotateValueRadians * (180/Math.PI)
                }
                else {
                    rotateValue = (rotateValueRadians * (180/Math.PI))*-1
                }
            }
            else {
                if (edge.y2 > edge.y1) {
                    rotateValue = rotateValueRadians * (180/Math.PI)*-1
                }
                else {
                    rotateValue = (rotateValueRadians * (180/Math.PI))
                }
            }
            const rotatelabel = "rotate(" + rotateValue + ", " + x + "," + y + ") "
            d3.select(edge.html.node().parentElement).select("text")
            .attr("x", (edge.x2+edge.x1)/ 2 - 5*label.length)
            .attr("y", (edge.y2+edge.y1 - edge.stroke_width)/2)
            .attr("transform", rotatelabel)
            .style("font-family", font_family)
            .style("font-size", font_size)
            .attr("fill", color)
            .text(label)
        }
    }

    global.Connectogram = global.Connectogram || Connectogram

})(window);