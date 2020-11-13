---
title: "How to Create a Node App Within a Docker Container"
date: "2019-04-22"
draft: false
slug: "how-to-create-a-node-app-withing-a-docker-container"
description: "Easily get started with Node in containers"
tags: [
    "docker",
    "node",
    "heroku",
    "mongodb"
]
menu: "docker"
meta_img: "img/docker.jpeg"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854495/blog/Docker.png"
author: 
    twitter: "wachira_dev"
    name: "Erick Wachira"
---

# Setup

## Requirements

Before you go through this fun tutorial ensure:
* You at least have an understanding of *javascript* and *terminal* commands.
* You should know what `Docker` is and in theory how it works.
* You have should `node` and `npm` installed on your computer. You can do this by typing this in your terminal. 
```bash
$ node --version && node --version
```

* Also,  since we talking containers well you need `docker` installed.
```bash
$ docker --version
```

## Create a new project

Create our project folder, where our codebase will be housed

```bash
$ mkdir docker_nodejs_app
```

Let's change the directory to our app folder.

```
$ cd docker_nodejs_app
```

Since this is a `node` project, we need a `package.json` file to track our project dependencies.

To create one pretty fast type this in your terminal.

```bash
$ npm init -y
```

We will be using `express` as our default `node` web framework.

```bash
$ npm install express --save # Introduce the save flag to track it in the package.json file
```

```json
{
  "name": "docker_node_app",
  "version": "1.0.0",
  "description": "nodejs image demo",
  "author": "your name",
  "license": "MIT",
  "main": "app.js",
  "keywords": [],
  "scripts": {
      "start":"node app.js"
  },
  "dependencies": {
    "express": "^4.16.4"
  }
}
```

## Create and run our server

We will create a simple `express` server. Let's create the file that will hold our server code. 

You can use the _terminal_ to create the file 
```bash
$ touch app.js # Creates the file from the terminal
```
Or your locally installed code editor.

Let us write our _server code_.

```javascript
"use strict"; // Ensures our code is compiled in strict mode

// Lets import our web framework
var express = require("express");

// Initialise our app
const app = express();

// Lets set our port
/**
 * The default port number is `3000`
 * Take note on that as we will come to that.
 */
app.set("port", 3000);

/**
 * To ensure works as it should we will create a
 * simple endpoint to return a json response
 */

// Define our json response
const data = {
  blog_name: "docker_nodejs_app",
  blog_author: "wachira (tesh254)",
  blog_author_twitter: "@wachira_dev"
};

// Define out GET request endpoint
app.get("/", (req, res) => {
  res.status(200).json(data);
});

// Initialize our server
app.listen(app.get("port"), () => {
  console.log(`Server listening on port ${app.get("port")}`);
});

```

Let's *run* it, it's a simple server meaning its `bug-free`.

```bash
$ node app.js
```

You should see the same text on your terminal.


![Screenshot 2019-05-22 at 4.07.38 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1558530469391/FeZtCTI77.png)

Let's test our endpoint on our browser.


![Screenshot 2019-05-22 at 5.27.21 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1558535254616/q95_Lw9Mv.png)

## Finally what the blog is about.....DOCKER

For you to run your server within a container you a couple of things:

* Dockerfile: _defines what goes on in the environment inside your container._
* `docker-compose.yml`: _Not a must but comes in handy if you plan to add services like a `database`_
* Dependency file: _Contains the packages needed to run your application successfully e.g. `package.json` file for node or `requirements.txt` for python._
* `.dockerignore`: _Not a must but it allows you to exclude files from the context like a `.gitignore` file allows you to exclude files from your git repository._

Let's create and write our `Dockerfile`

```bash
$ touch Dockerfile
```

You can copy and paste the configurations to your Dockerfile.

```Dockerfile
# Define the image we will use and version
# latest just means we need the latest nodejs image available
FROM node:8

# Create an app directory to hold the application code
WORKDIR /usr/docker_nodejs_app/src/app

# Duplicate the dependency file to the container's project root directory.
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source inside the docker image
COPY . .

# Expose our app port inside the app and 
EXPOSE 3000:3000

# Define commands that will run the app
CMD ["npm", "start"]

```
 Turn to your terminal and build your container.

```bash
$ docker build -t docker_nodejs_app .
```

You should see something like this on your terminal when your build is done.


![Screenshot 2019-05-22 at 5.30.55 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1558535472185/Zrw0EPn7g.png)

Let's run our app from docker

```bash
$ docker run -it docker_nodejs_app
```

If you did everything in this tutorial right then you should see something similar to the screenshot below.


![Screenshot 2019-05-22 at 5.42.09 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1558536144722/vat0_Qvcj.png)

Test it out on a browser, the same results expected.

This tutorial will be a series, this being the first part. The parts will be as follow:
* Introducing services to our app, *spoiler alert*, `MongoDB`.
* Hosting our docker container on `Heroku`.  
* Push our repo to the Docker repository.
* Other commands with Docker that make your experience worthwhile.

## Extras
* Link to repo [https://github.com/werickblog/docker_nodejs_app](https://github.com/werickblog/docker_nodejs_app)

* Link to download NodeJS [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

* Link to download Docker [https://www.docker.com/get-started](https://www.docker.com/get-started)

* Understanding what docker is [https://docs.docker.com/engine/docker-overview/](https://docs.docker.com/engine/docker-overview/)


