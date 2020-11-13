---
title: "Compress images in React: Browser Image Compression Libary"
slug: "how-to-compress-images-in-react-series"
date: "2020-07-27"
draft: false
tags: ["react", "compression", "images"]
menu: "reactjs"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854496/blog/Compress-React.png"
description: "How to compress images in React(Javascript) series"
author:
  twitter: "wachira_dev"
  name: "Erick Wachira"
prev: false
series: true
series_label: "Compression on the Client; IK"
---

I recently got interested in compressing images on the client side for a couple of reasons:

- Reduce my cloudinary bandwidth and storage usage
- Users were complaining on long waits while uploading images

So I ventured to look for a library that will help me solve this fast and easy, maybe in future I might build my own from scratch.

So I came by a couple of libraries that will help in compressing images on the client side.

# Browser Image Compression

1. Install it with your favorite package manager

   ```bash
   npm install browser-image-compression --save
   ```

   or

   ```bash
   yarn add browser-image-compression
   ```

2. Create your react component

   ```javascript
   import React from "react";

   class App extends React.Component {
     onChange = async (e) => {
       // Some onchange event calls
     };

     render() {
       return (
         <input name="file" id="file" onChange={this.onChange} type="files" />
       );
     }
   }
   ```

3. Start compressing

   ```javascript
   ...
   import Compress from "browser-image-compression";

   ...
   onChange = (e) => {
       // Get the files selected from the input tag
       // On select files always come in an array even
       // if you choose one its the first index
       // if you selected a couple then loop through the array
       const file = e.target.files[0]

       // Compression config
       const options = {
           // As the key specify the maximum size
           // Leave blank for infinity
           maxSizeMB: 1.5,
           // Use webworker for faster compression with
           // the help of threads
           useWebWorker: true
       }

       // Initialize compression
       // First argument is the file object from the input
       // Second argument is the options object with the
       // config
       Compress(file, options)
           .then(compressedBlob => {
               // Compressed file is of Blob type
               // You can drop off here if you want to work with a Blob file
               console.log(compressedBlob)

               // If you want to work with the File
               // Let's convert it here, by adding a couple of attributes
               compressedBlob.lastModifiedDate = new Date()

               // Conver the blob to file
               const convertedBlobFile = new File([compressedBlob], file.name, { type: file.type, lastModified: Date.now()})

               // Here you are free to call any method you are gonna use to upload your file example uploadToCloudinaryUsingPreset(convertedBlobFile)
           })
           .catch(e => {
               // Show the user a toast message or notification that something went wrong while compressing file
           })
   }
   ```

# Next

Next we will cover using `react-image-file-resizer` library
