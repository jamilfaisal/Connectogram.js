# Connectogram

Landing Page: https://connectogram.herokuapp.com/

Documentation: https://connectogram.herokuapp.com/API

## Getting Started

- [d3.js](https://d3js.org/) is required (preferably the latest version). Here is the CDN hosted by [d3.js](https://d3js.org/d3.v5.min.js).
- Download the latest versions of "connectogram.js" and "cgram-styles.css" files from [GitHub](https://github.com/csc309-summer-2020/js-library-jamilfa1).

### Load Connectogram into your website like this (order matters):
```
<head>
  <link rel="stylesheet" href="cgram-styles.css">
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
  <script defer type="text/javascript" src='js/connectogram.js'></script>
</head>
```

### Basic Usage

- Add a ```<div>``` element anywhere on your website.
- Retrieve the <div> element like ```const div = document.querySelector('div')```
- Instantiate an empty Connectogram and give it a name: ```const cg = new Connectogram(div, "myDiagram")```
  - You can use CSS to modify the width and height properties of the Connectogram using ```cgram- + <Connectogram Name>``` as its class name
  - Example:
    ```
      .cgram-myDiagram {
          width: 1000px;
          height: 550px;
      }
    ```
- Add any basic shape like ```const blobRect = cg.addBlob("blobRect1", "rectangle", {height: 250, width: 175}) ```
- That's it! Check out the [documentation](https://connectogram.herokuapp.com/API) for more information.
