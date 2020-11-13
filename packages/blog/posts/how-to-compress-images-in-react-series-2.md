---
title: "Compress images in React: React Image File Resizer"
slug: "how-to-compress-images-in-react-series-2"
date: "2020-07-30"
draft: false
tags: ["react", "compression", "images"]
menu: "reactjs"
description: "How to compress images in React(Javascript) series"
author:
  twitter: "wachira_dev"
  name: "Erick Wachira"
prev: "how-to-compress-images-in-react-series"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854496/blog/Compress-React.png"
series: true
series_label: "Compression on the Client; IK"
---

Okay for this one I highly recommend, the speeds is just amazing. I loved it. I am gonna do a comparison real quick, between `browser-image-compression` and `react-image-file-resizer`.

| `browser-image-compression`               | `react-image-file-resizer`                       |
| ----------------------------------------- | ------------------------------------------------ |
| Really fast                               | Compressed the same took a while                 |
| Quality option on the config              | Only offers size limit                           |
| Return `base64` or `Blob`                 | Returns `Blob` only do the conversion yourself   |
| No need to handle Promise                 | Must handle Promise                              |
| Specify compress format (png, webp, jpeg) | The compress format provided is the one returned |

Below is an image I was able to compress with the following config

```text
width -> 480px
height -> 480px
file format -> Set to JPEG
quality -> 50
rotation -> 0
```

### Actual size: 1.6mb

[<span style="color: blue">(Click here)</span>](https://res.cloudinary.com/duoxba7n1/image/upload/v1596140171/actual.jpg)
Click on the link its a huge image and I just want the load time for this blog to be faster.

### Compressed size: 16.3kb

![](/post_images/compressed.jpeg)

Let's jump into how you can plug it into your React app

## React Image File Resizer

1. Install the package

   ```bash
   yarn add react-image-file-resizer
   ```

2. Create your react component

   ```javascript
   import React from "react";

   // ...

   class App extends React {
     // ...
     render() {
       return (
         <div className="App">
           // ...
           <h3>React Image File Resizer</h3>
           <br />
           <input
             type="file"
             id="file"
             accept="image/*"
             onChange={this.onFileResize}
           />
         </div>
       );
     }
   }
   ```

3. Start compressing

   ```javascript
   ...
   import Compress from "react-image-file-resizer";

   ...
   onFileResize = e => {
       const file = e.target.files[0];

   Resizer.imageFileResizer(
     file, // the file from input
     480, // width
     480, // height
     "JPEG", // compress format WEBP, JPEG, PNG
     70, // quality
     0, // rotation
     (uri) => {
       console.log(uri);
       // You upload logic goes here
     },
     "base64" // blob or base64 default base64
   );
   }
   ```

Again I highly recommend this library especially because it supports compressing to `WEBP`(file of this format are really fast).

> **Note**: Set quality to 100 if you want to compress to PNG/WEBP(Lossless) else set the compress format to JPEG(Lossy)

## Next

We will cover understanding **Lossy** and **Lossless** compression.
