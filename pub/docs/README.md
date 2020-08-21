# Connectogram

Main Page: https://connectogram.herokuapp.com/

## What is it?
Connectogram.js is a JS front-end library that displays linked information onto a webpage in the form of Blobs.

### Blobs

Blobs display bundles of data represented by specific shapes: 
- Rectangle
- Circle
- Ellipse

#### Properties & Functionality
Blobs can be instantiated with several options such as color, border-color, size, and position.

Blobs can trigger callback functions with event handlers of your choice.

Text (with varying options) can be inserted into the Blob in any position.

When displayed on screen, the Blobs can either be fixed in-place or moveable using the mouse cursor.

Each Blob can be connected to other Blobs using connective lines called Edges. 

### Edges
Edges create associations between any two Blobs in the Connectogram.

Edges have visual customization options such as color, type (“dotted”, “dashed”), and can be attached with a label.

### Uses
Check out the examples page [here!](https://connectogram.herokuapp.com/examples)

# Getting Started

- [d3.js](https://d3js.org/) is required (preferably the latest version). Here is the CDN hosted by [d3.js](https://d3js.org/d3.v5.min.js).
- Download the latest versions of "connectogram.js" and "cgram-styles.css" files from [GitHub](https://github.com/csc309-summer-2020/js-library-jamilfa1).

## Loading Connectogram.js
Load Connectogram into your website like this (order matters):
```
<head>
  <link rel="stylesheet" href="cgram-styles.css">
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
  <script defer type="text/javascript" src='js/connectogram.js'></script>
</head>
```

## Basic Usage

1. Add a ```<div>``` element anywhere on your website.
2. Retrieve the <div> element like ```const div = document.querySelector('div')```
3. Instantiate an empty Connectogram and give it a name: ```const cg = new Connectogram(div, "myDiagram")```
  - You can use CSS to modify the width and height properties of the Connectogram using ```cgram- + <Connectogram Name>``` as its class name
  - Example:
    ```
      .cgram-myDiagram {
          width: 1000px;
          height: 550px;
      }
    ```
4. Add any basic Blob like ```const blobRect = cg.addBlob("blobRect1", "rectangle", {height: 250, width: 175}) ```

That's it! For more information on Blobs, Edges, and other objects, check out the API section.

# API

## Connectogram

### Instantiation
```
const cg = new Connectogram(html, name)
```
html: Connectogram is appended to this html element

name: Uniquely identifies the Connectogram. Connectogram CSS class is ```"cgram-" + name```

### Properties

| Attribute     | Type         |     Description   | 
| -----------   | -----------  | ----------- |
| name          | String             |Unique Identifier        |
| className     | String             |CSS Class Name         |
| blobs         | Array\<Blob\>             |A dynamic array of all Blobs in the Connectogram        |
| edges          | Array\<Edge\>             |A dynamic array of all connected Edges in the Connectogram        |
| anchors          | Array\<Anchor\>             |A dynamic array of all Anchors in the Connectogram        |


### Methods

| Method Name     | Parameters         |     Return   |             Description         |
| -----------   | -----------          | ----------- |             -----------            |
| addBlob          | <ul><li>name: \<Unique Blob Name\></li><li>shape: \<"rectangle", "circle", or "ellipse"\></li><li>size: Object{height: Number, width: Number, radius: Number, radiusx: Number, radiusy: Number}</li><li>x: \<x Coordinate\></li><li>y: \<y Coordinate\></li><li>color: \<Fill Color of Blob\></li><li>borderColor: \<Border Color of Blob\></li></ul>            |     Reference to Blob Element        |     Adds a new Blob to the Connectogram                              |
| addAnchor     | <ul><li>name: \<Unique Anchor Name\></li><li>radius: \<Number\></li><li>x: \<x Coordinate\></li><li>y: \<y Coordinate\></li><li>color: \<Fill Color of Anchor\></li></ul>             |      Reference to Anchor Element         |    Adds a new Anchor to the Connectogram                            |
| removeBlob         | name: \<Name of the Blob\>      |       none        |        Removes the Blob with the associated name                           |
| removeAnchor         | name: \<Name of the Anchor\>     |       none         |    Removes the Anchor with the associated name                              |
| getBlob        | name: \<Name of the Blob\>   |      Reference to Blob Element          |    Return a reference to the Blob by its unique name
| getAnchor        | name: \<Name of the Anchor\>  |    Reference to Anchor Element           |       Return a reference to the Anchor by its Unique name                          |
| connect        | <ul><li>obj1: \<Reference to Anchor or Blob\> </li><li>obj2: \<Reference to another Anchor or Blob \> </li><li>type: \<"default", "dotted" or "dashed"\></li><li>color: \<Color of Edge\></li><li>stroke_width: \<Width of Edge\></li></ul>   |     Reference to Edge Element          |        Adds an Edge between two Anchors or Blobs                        |
| disconnect        | <ul><li>obj1: \<Reference to Anchor or Blob\> </li><li>obj2: \<Reference to another Anchor or Blob\></li></ul>   |    none           |              Removes the Edge between two Blobs or Anchors                   |
| getEdge        | <ul><li>obj1: \<Reference to Anchor or Blob\> </li><li>obj2: \<Reference to another Anchor or Blob\></li></ul>   |     Reference to Edge Element          |               Gets the Edge between two Blobs or Anchors                  |
| displayAll        | none   |    none           |      Outputs information on all Blobs, Anchors, and Edges in the Connectogram                           |
| displayBlob        | blob: \<Reference to Blob>   |    none           |        Outputs information on a specific Blob                         |


## Blob

### Instantiation
```
const blob = cg.addBlob("BlobName", 
                        <"rectangle","circle", or "ellipse">, 
                        {height: Number, width: Number, radius: Number, radiusx: Number, radiusy: Number}, 
                        <x-coordinate>, 
                        <y-coordinate>, 
                        <Fill Color>, 
                        <Border Color>
                        )

```

### Properties

| Attribute     | Type         |     Description   | 
| -----------   | -----------  | ----------- |
| cgram          | \<Connectogram Reference\>             |A pointer to the Blob's Connectogram        |
| name     | \<String\>             |Blob's Unique Identifier         |
| shape         | \<String\>             | "Rectangle", "Circle", or "Ellipse"     |
| x          | \<Number\>             |Blob's x-coordinate        |
| y          | \<Number\>             |Blob's y-coordinate        |
| color          | \<String\>             |Blob's Fill Color        |
| borderColor          | \<String\>             |Blob's Border Color        |
| text          | \<String\>             |Contains all text inside the Blob        |
| link          | \<String\>             |The hyperlink associated with the Blob        |
| func          | \<Function\>             |The callback function associated with the Blob        |
| draggable          | \<Boolean\>            |True if the Blob is draggable, False otherwise        |

### Methods
| Method Name     | Parameters         |     Return   |             Description         |
| -----------   | -----------          | ----------- |             -----------            |
| addText     | <ul><li>text: \<String containing text\> <li><li>font_family: \<Text Font-Family \> \<Number\></li><li>font_size: \<Size in Pixels\></li><li>text_align: \<"left", "center", or "right"\></li><li>vertical_align: \<"top", "middle", or "bottom"\></li><li>color: \<Text Color\></li></ul>         |     none   |             Adds Text to the Blob in a row         |
| textAlign     | \<"top", "middle", or "bottom"\>         |     none   |             Realigns all text         |
| clearText     | none         |     none   |             Removes all text from the Blob         |
| setLink     | \<String containing hyperlink\>         |     none   |             Adds anchor tag to Blob with hyperlink         |
| clearLink     | none         |     none   |             Removes any hyperlinks from the Blob         |
| changeName     | \<String containing new Blob name\>         |     <\Reference to the Blob\>   |             Changes the Blob's Unique Name         |
| changeColor     | \<New Color\>         |     none   |             Modifies the Blob's Color         |
| changeBorderColor     | \<New Border Color>         |     none   |             Modifies the Blob's Border Color         |
| setPosition     | <ul><li>x: \<New x-Coordinate\> </li><li>y: \<New y-Coordinate\> </li></ul>         |     none   |             Sets the Blob's new position         |
| toggleHide     | none         |     none   |             Hides/Unhides the Blob         |
| addEvent     | <ul><li>eventListener: \<Event\> </li><li>func: \<Callback Function\> </li></ul>         |     none   |             Adds a new event listener to the Blob         |
| removeEvent     | <Event>         |     none   |             Removes the event listener associated with the Blob         |
| toggleDraggable     | none         |     none   |             Sets the Blob to be Draggable/Fixed         |


## Anchor

### Instantiation
```
const anchor = cg.addAnchor(<Anchor Name>, <Radius>, <x-coordinate>, <y-coordinate>,<Anchor Color>)
```

### Properties

| Attribute     | Type         |     Description   | 
| -----------   | -----------  | ----------- |
| cgram          | \<Connectogram Reference\>             |A pointer to the Anchor's Connectogram        |
| name     | \<String\>             |Anchor's Unique Identifier         |
| radius         | \<Number\>             | Anchor's Radius Size     |
| x          | \<Number\>             |Anchor's x-coordinate        |
| y          | \<Number\>             |Anchor's y-coordinate        |
| color          | \<String\>             |Anchor's Fill Color        |
| draggable          | \<Boolean\>            |True if the Anchor is draggable, False otherwise        |

### Methods
| Method Name     | Parameters         |     Return   |             Description         |
| -----------   | -----------          | ----------- |             -----------            |
| changeName     | \<String containing new Anchor name\>         |     <\Reference to the Anchor\>   |             Changes the Anchor's Unique Name         |
| changeRadius     | <\Number containing new Radius\>         |     none   |             Changes the Anchor's Radius         |
| changeColor     | \<New Color\>         |     none   |             Modifies the Anchor's Color         |
| setPosition     | <ul><li>x: \<New x-Coordinate\> </li><li>y: \<New y-Coordinate\> </li></ul>         |     none   |             Sets the Anchor's new position         |
| toggleHide     | none         |     none   |             Hides/Unhides the Anchor         |


## Edge

### Instantiation
```
const edge = cg.connect(Blob1, Blob2, <"default", "dashed", or "dotted">, <Edge Color>, <Edge Width>)
```

### Properties

| Attribute     | Type         |     Description   | 
| -----------   | -----------  | ----------- |
| type          | \<"default", "dashed", or "dotted"\>             | Edge's visual type        |
| from     | \<Blob/Anchor Reference\>             | A reference to the Edge's origin endpoint         |
| to     | \<Blob/Anchor Reference\>             | A reference to the Edge's tail endpoint         |
| color          | \<String\>             |Edge's Color        |
| stroke_width         | \<Number\>             | Edge's width     |
| x1          | \<Number\>             |Edge's origin endpoint x-coordinate        |
| y1          | \<Number\>             |Edge's origin endpoint y-coordinate        |
| x2          | \<Number\>             |Edge's tail endpoint x-coordinate        |
| y2          | \<Number\>             |Edge's tail endpoint y-coordinate        |

### Methods

| Method Name     | Parameters         |     Return   |             Description         |
| -----------   | -----------          | ----------- |             -----------            |
| toggleEdgeHide     | none         |     none   |             Hides/Unhides the Edge from the DOM         |
| addLabel     | <ul><li>label: \<String containing the Edge's label\> <li><li>font_family: \<Label's Font-Family \> \<Number\></li><li>font_size: \<Size in Pixels\></li><li>color: \<Label Color\></li></ul>         |     none   |             Adds a label to the center of the Edge         |
