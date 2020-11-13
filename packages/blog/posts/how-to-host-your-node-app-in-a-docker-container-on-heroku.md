---
title: "How to Host Your Node App in a Docker Container on Heroku"
date: "2019-06-16"
draft: false
slug: "how-to-host-your-node-app-in-a-docker-container-on-heroku"
tags: ["node", "docker", "paas", "heroku"]
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854495/blog/Docker.png"
menu: "docker"
author: 
    twitter: "wachira_dev"
    name: "Erick Wachira"
---

# Introduction

This is the third part of the series for [Docker meets NodeJS](https://hashnode.com/series/docker-meets-nodejs-cjvzfbat20003j7s1gx8dk98a). 

We got to add a mongo database as a service and maybe you added a couple of endpoints to test it out, but the whole app is in runs locally and you might want to let the whole world have the opportunity to test out your Node app well not to worry, Werick is here.

In this part, we are going to host our application on Heroku.

> **Note**: Since we are introducing a new database service, by doing so this also makes our Node app also a service

> **Note**: Ensure you go through the [first part of this series](https://wwachira.hashnode.dev/how-to-create-a-node-app-within-a-docker-container-cjvzdbl7h001lc3s1k6sofdi3) and the [second part too](https://wwachira.hashnode.dev/how-to-create-a-node-app-within-a-docker-container-with-mongo-cjwjd3l4t00067rs18w7035oc).

> **Note**: Remember to clone the `docker_nodejs_app` repo [here](https://github.com/werickblog/docker_nodejs_app)

# Why Heroku?

You might ask yourself why I chose Heroku instead of Digital Ocean, Linode, GCP or AWS...🤔the reason is that Heroku allows you to get up and running quickly and deploy your code without worrying about how your infrastructure runs underneath. 

For the other platforms well you will be assigned a CPU(s) in which you will set up the whole thing including installing software, libraries, securing your server with SSH which will kinda consume most of your time and you just want to host your simple express server. 

# Getting Started

Well enough promoting let host something. First of all, you will have to create an account on Heroku

![Screenshot 2019-06-16 at 12.02.19 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1560675760755/ALCpFLWup.png)

After creating your account on Heroku, you will have to install its CLI. The Heroku CLI makes it easy to create and manage your Heroku apps directly from the terminal. It’s an essential part of using Heroku.

### Mac
To install the CLI on Mac you can do it in two ways:
* [Download Installer](https://cli-assets.heroku.com/heroku.pkg)
* Using `homebrew`:
    * ```bash
      $ brew tap heroku/brew && brew install heroku
      ```

### Windows
To install it on Windows you just need to know which type works with your computer, is it a [`32-bit`](https://cli-assets.heroku.com/heroku-x86.exe) or [`64-bit`](https://cli-assets.heroku.com/heroku-x64.exe)

### Ubuntu
For Ubuntu, you will need to install it with `snap`:
```bash
$ sudo snap install --classic heroku
```

## Let's get into deploying
To check if you successfully installed it globally, type this in your terminal

```bash
$ heroku --version
```

In your terminal `cd` into the directory where our node app is housed. Next, we have log in to Heroku through the CLI.

```bash
$ heroku login
```
Press any key to log in, this launches your default browser where you will log in successfully return to your terminal.

You will also need to log in to the container registry, basically, this is a service that Heroku offers to host our docker container.

```bash
$ heroku container:login
```

We have to create our Heroku app where our code will be held and built.

```bash
$ heroku create docker-nodejs-app
```

You should see something similar on your terminal
![Screenshot 2019-06-16 at 11.03.13 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1560715411125/6TRfqbz3V.png)

Before we build and deploy our app we need to change the port our Express server runs on. The default port was `3000` but when we build and deploy our app on Heroku we might get an error about our `PORT` already being used, so we need to create a condition whereby if Heroku does not give us a port we use our default 3000.

Change the line you set your port default to this:

```javascript
app.set("port", process.env.PORT || 3000);
```
Your `app.js` file should look like this
```javascript
"use strict"; // Ensures our code is compiled in strict mode

// Lets import our web framework
var express = require("express");
var mongoose = require("mongoose");

// Initialise our app
const app = express();

// Lets set our port
/**
 * The default port number is `3000` if Heroku does not provide us a port
 * Take note on that as we will come to that.
 */
app.set("port", process.env.PORT || 3000);


// Connect to database
mongoose.connect("mongodb://mongo:27017/docker_nodejs_app", {
  useNewUrlParser: true,
  useCreateIndex: true
});

mongoose.connection.on("open", err => {
  if (err) console.log("Error connecting to our mongo database");
  console.log("Connected to mongo database successfully");
});

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

Next, we will `build` our `image` and `push` to `Container Registry`

```bash
$ heroku container:push web
```
You should see something similar on your terminal

![Screenshot 2019-06-16 at 11.07.24 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1560715662523/VvcvksnB5.png)

**What happens in the background?**

* First, Our whole app was built according to the `Dockerfile` and the `docker-compose.yml` configuration.
* Heroku CLI pushes our `built` `image` to our **created** `app` through `git`.

Next, we need to release our app so that it can be accessible to the whole world.

```bash
$ heroku container:push web
// or
$ heroku container:push -a docker-nodejs-app web
```
This should appear in your terminal

![Screenshot 2019-06-16 at 11.24.08 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1560716666705/UW164w6ja.png)

You have successfully deployed your app on Heroku🎉🍾🎊🙌

# Summary

To summarise, in this awesome post we have:
* Successfully built and deployed our app to Heroku

# Next

In the next part:

* Push our repo to the Docker repository.
* Other commands in Docker that will make your experience worthwhile such as:
    * Clearing container cache
    * Deleting, Stopping Docker containers

# Extras

* Link to repo [https://github.com/werickblog/docker_nodejs_app](https://github.com/werickblog/docker_nodejs_app)

* Link to app [https://docker-nodejs-app.herokuapp.com/](https://docker-nodejs-app.herokuapp.com/)

* Link to download NodeJS [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

* Link to download Docker [https://www.docker.com/get-started](https://www.docker.com/get-started)

* Understanding what docker is [https://docs.docker.com/engine/docker-overview/](https://docs.docker.com/engine/docker-overview/)
