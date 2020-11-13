---
title: "How to Create and Run Cron Jobs in Node"
date: "2019-07-31"
draft: false
slug: "how-to-create-and-run-cron-jobs-in-node"
tags: ["node", "crons", "jobs", "schedule"]
menu: "nodejs"
description: "Get started with crons in Node"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854496/blog/Cron-Node.png"
author: 
    twitter: "wachira_dev"
    name: "Erick Wachira"
---

You ever want to automate certain tasks on your app, saving you the hustle of doing them manually such as deletion of log files, automated emails or maybe doing a backup of your database data into a MongoDB/SQL dump file, well say no more `cron jobs` are here to help.

## What is a cronjob?

A cron job is a task that automatically runs on a set schedule, example at 0000h you might have a cron job clear site cache on your CDN(Content Delivery Network).

By the end of this tutorial, you should be able to create a simple Node cron job.

# Prerequisites

To get started with this tutorial you must have:
* NodeJS installed on your development computer
* Yarn or NPM installed
* Knowledge in writing es5 Javascript

# Getting Started 

## Setup

To have our cron job running we need to set up our Node project.

```bash
// Create our folder and change our directory to where it is created
$ mkdir cron_jobs_with_nodejs && cd cron_jobs_with_nodejs
// Initialize our package.json file
$ yarn init -y or npm init -y
```

We are going to create a simple cron job that deletes a file after a minute. Let's create a file to house our code

```bash
$ touch index.js
```

We need to install certain packages that will ensure we have a cron job
```bash
$ npm install express node-cron fs
```

* `express`: For our cron job to run after a set time we need to initialize a keep-alive connection, which `express` library will offer when we initialize a `HTTP` server. You can still use Node inbuilt `HTTP` library.
> _Note_: We need to have a running program so that our cron job runs, thus the need for a HTTP connection.
* `node-cron`: This is the library that will enable us to run our cron job successfully.
* `fs`: Helps us access the `file-system` quite well. It comes built-in Node, so there is no need to install it.

## Code

The boring but important step is over, now to the good stuff, code. Open `index.js` with your local editor. 

First, we will have to set up our whole express server

```js
// Import needed libraries
const express = require("express");
const Cron = require("node-cron");
const fs = require("fs");

// Initialize express
const app = express();

// Set  our default port
app.set("port", process.env.PORT || 3456);

// Initialize our server
app.listen(app.get("port"), err => {
  // If something goes wrong when initializing the server
  if (err) console.log(`Server failure due to ${err.message}`);
  console.log(`Server running on port ${app.get("port")}`);
});
```

Run our server.

```bash
$ node src/index.js
```
If successful you will see a similar message printed on your console/terminal.

```bash
Server running on port 3456
```

Secondly, we will write a simple cron job that console logs a statement after every minute.

```js
// Import needed libraries
const express = require("express");
const Cron = require("node-cron");
const fs = require("fs");

// Initialize express
const app = express();

// Set  our default port
app.set("port", process.env.PORT || 3456);

// Schedule a cron job task
Cron.schedule("* * * * * ", () => {
  console.log("> After every minute the cron job runs");
});

// Initialize our server
app.listen(app.get("port"), err => {
  // If something goes wrong when initializing the server
  if (err) console.log(`Server failure due to ${err.message}`);
  console.log(`Server running on port ${app.get("port")}`);
});

```

You must be wondering about the weird value as the first argument for the `Cron.schedule` method. The value is how we set the intervals that the cron job should run.

## Cron Syntax

```bash
* * * * * *
| | | | | |
| | | | | day of week
| | | | month
| | | day of month
| | hour
| minute
second ( optional )
```

### Allowed values

| Field Type | Value |
| ----- | ------|
|Second| 0-59 |
|minute|0-59|
|hour|0-23|
|day of month|	1-31|
|month|1-12 or names i.e. January|
|day of week|0-7 or names i.e. Monday|

#### Using multiple values

You can use multiple values using separate commas

```js
// Import needed libraries
const express = require("express");
const Cron = require("node-cron");
const fs = require("fs");

// Initialize express
const app = express();

// Set  our default port
app.set("port", process.env.PORT || 3456);

// Schedule a cron job task
Cron.schedule("1,2,4,5 * * * *", () => {
    console.log("> After every minute 1, 2, 4 and 5 the cron job runs")
})

// Initialize our server
app.listen(app.get("port"), err => {
  // If something goes wrong when initializing the server
  if (err) console.log(`Server failure due to ${err.message}`);
  console.log(`Server running on port ${app.get("port")}`);
});
```

#### Using ranges

```js
// Import needed libraries
const express = require("express");
const Cron = require("node-cron");
const fs = require("fs");

// Initialize express
const app = express();

// Set  our default port
app.set("port", process.env.PORT || 3456);

// Schedule a cron job task
Cron.schedule("1-5 * * * *", () => {
    console.log("> After every minute to 1 from 5 the cron job runs")
})

// Initialize our server
app.listen(app.get("port"), err => {
  // If something goes wrong when initializing the server
  if (err) console.log(`Server failure due to ${err.message}`);
  console.log(`Server running on port ${app.get("port")}`);
});
```

You can use month names as multiple values in full or short format, `January, February, September` or `Jan, Feb, Sep`.

Let's create a cron job schedule that deletes a file after the first minute

```bash
$ touch tobedeletedfile.txt
```

```js
// Import needed libraries
const express = require("express");
const Cron = require("node-cron");
const fs = require("fs");

// Initialize express
const app = express();

// Set  our default port
app.set("port", process.env.PORT || 3456);

/**
 * Cron job that deletes a file after every minute
 */

const deleteFileCron = Cron.schedule("* * * * *", () => {
  console.log("Job has started");
  fs.unlink("./tobedeletedfile.txt", err => {
    if (err) {
      console.log(`Failed to delete file due to ${err.message}`);
    } else {
      console.log("File has been deleted successfully");
    }
  });
});

// Its a scheduled task method that starts a scheduled task
deleteFileCron.start()

// Initialize our server
app.listen(app.get("port"), err => {
  // If something goes wrong when initializing the server
  if (err) console.log(`Server failure due to ${err.message}`);
  console.log(`Server running on port ${app.get("port")}`);
});

```

If you run the code you should something similar in your console/terminal

```bash
Server running on port 3456
Job has started
File has been deleted successfully
Job has started
Failed to delete file due to ENOENT: no such file or directory, unlink './tobedeletedfile.txt'
```

# Simple Node Cron Job template
```js
[...]
const Cron = require("node-cron");

[...]

Cron.schedule("* * * * *", () => {
    // You can right the task to run here
});

[...]
```

# Advantages of Cron jobs over infinite loops
Some developers use infinite loops instead of cron jobs, this should not be the case because loops tend to occupy a lot of memory in your system compared to cron jobs.

**Advantages of cron jobs**
* You have control over it when it runs.
* It's easier to write the code and to manage its operation. It eliminates the looping and timing logic in the task, and you run crontab to change the timing or shut it off.
* It's not occupying memory in your system when it's not running.
* If it fails and exits for some reason, it will start up again when the proper time comes.

**Advantages of loops**
* It doesn't have the overhead of being restarted every time it's needed

# Where to use Cron jobs
You can use cron job in so many scenarios such as:
* Email automation
* Database backups
* Deletion of files such as logs

# Summary
* We set up a simple cron job with Node that lets us delete a file after every minute.
* Brief description of `cron's` syntax
* Advantages of `cron jobs`
* Where to use cron jobs

# Resources and Recommendations
Below is a list of links, you can read up on to have a deep understanding of cron jobs in Node and general info about `crons`:
* Cron job examples by CodeBeast [here](https://scotch.io/tutorials/nodejs-cron-jobs-by-examples)
* `node-cron` documentation on npm [here](https://www.npmjs.com/package/node-cron)
* Cron jobs with Node by Useful Angle [here](https://usefulangle.com/post/115/nodejs-cron-job)
* All about `crons`, `crontabs` and `cron jobs` [here](https://en.wikipedia.org/wiki/Cron)

# Extras

* Repo [link](https://github.com/werickblog/cron_jobs_with_nodejs)

Cover image made by [https://liyasthomas.github.io/banner/](https://liyasthomas.github.io/banner/)
