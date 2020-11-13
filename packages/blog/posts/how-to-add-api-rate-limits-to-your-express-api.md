---
title: "How to Add Api Rate Limits to Your Express Api"
date: "2019-11-23"
draft: false
tags: ["express", "api", "rate-limit"]
menu: "express"
description: "Enforcing API rate limit"
slug: "how-to-add-api-rate-limits-to-your-express-api"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854494/blog/Rate-Limit-Express.png"
author:
  twitter: "wachira_dev"
  name: "Erick Wachira"
---

I had an idea of building a public API, sort of similar to the Marvel API, where you get to fetch all Marvel characters.

![Screenshot at 2019-11-23 01-09-57.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1574460679657/_auRB9sV9.png)

When I was brainstorming on how I would build the API, I thought about three key things:

- It should be public and everyone should access (take note)
- An admin account to allow me to update the API's content.

The problem with making it public as it would be quite risky especially when someone runs a bot that results in DDoS attack happens and well the API will be free and I will be paying for the server costs. Luckily there is a way to prevent these issues by setting a fixed number of API calls per IP. This means each user is tied to a limit and if they exceed, they have to wait a specified period for their rate limit to be renewed.

After tinkering around with API rate limits, I thought of writing this article, hoping it would help someone in my shoes or maybe future me. (Also it's been a while since I've written)

# Introduction

We are going to create a simple express API project and enforce an API rate limit.

## Let's get started

### Prequisites

- Basic knowledge of Javascript ES5
- Basic concepts of express

### Project Setup

The usual, create a new project

```bash
$ mkdir express_rate_limit_api && cd $_
```

Create a `package.json` file to track our dependencies.

```bash
$ yarn init -y # Creates a default package.json file
```

I prefer Yarn, I sort of feel its npm but on steroids

Next, we need to install `express` to have an API to work with.

```bash
$ yarn install express
```

To enforce an API rate limit we need a library unless you want to reinvent the wheel, go for it but this blog does not serve you. I found `express-rate-limit` which is much easier and better(my opinion).

```bash
yarn add express-rate-limit
```

### Let's Code

We will first have to create a simple express server to enforce the rate limit.

```javascript
const express = require("express");

const app = express();

const port = process.env.PORT || 2300;

app.get("/api/hello-world", (req, res) => {
  res.status(200).json({
    message: "Hello world! climate change is real",
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(`Server error due to ${err.message}`);
  }
  console.log(`Server running on port ${port}`);
});
```

Next, we will enforce the API rate limit

```javascript
const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

const port = process.env.PORT || 2300;

// API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes,
  max: 10, // Maximum number of API calls to be made by an IP,
  message: "Limit reached, try again after a couple of minutes",
  statusCode: 429, // Status to be returned Too many requests
});

// Enforse the rate limit middleware
app.use(apiLimiter);

app.get("/api/hello-world", (req, res) => {
  res.status(200).json({
    message: "Hello world! climate change is real",
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(`Server error due to ${err.message}`);
  }
  console.log(`Server running on port ${port}`);
});
```

If you try to access the endpoint 10 times you should receive this error.
![Screenshot at 2019-11-23 02-07-09.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1574464110272/kbNKtKWCE.png)

If you want the response to be of JSON format. You will have to add a new line.

```javascript
// ...
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message:
      "Exceeded your allocated API calls, try again after a couple of minutes",
    api_calls_limit: 10,
    api_calls_renewal_time: "15 minutes",
  },
  statusCode: 429,
});
// ...
```

API rate limit can also help in limiting a number of accounts created by a single IP.

**Note**: By default, the rate limits are stored in memory, this means if you stop your server from running, everything is gone. Not to worry, I am planning on writing the second part of this tutorial where I will outline in depth so many ways you can store the rate limits, this includes:

- Store on a MongoDB
- Store on MemoryCache
- Store on Redis

# Outro

Repo link: [link](https://github.com/werickblog/express_api_rate_limit_tutorial)
