---
title: "How to Build Electron Apps With React"
date: "2019-12-28"
draft: false
tags: ["react", "electron", "javascript", "npm", "babel", "node"]
menu: "electron"
slug: "how-to-build-electron-apps-with-react"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854495/blog/Electron-React.png"
author: 
    twitter: "wachira_dev"
    name: "Erick Wachira"
---


# Introduction
I have always had a deep interest in writing Desktop applications. What was holding me off throughout the years was, I wasn't interested in learning C++ or Java to make them. I wanted to build Desktop apps with Javascript, so I landed on Electron, a Javascript Desktop application framework, developed and maintained by Github.

Electron is such a big deal that it will allow you to create Desktop apps for all the major OS with a single codebase.  That impressed me but not so much as you can write Desktop applications with React, Angular, Vue or any javascript framework out there. They sold me on that.

In this tutorial, I will outline the initial setup to get you started.

# Prerequisites
To understand the syntax and concept of this tutorial you should have:
* Basic concepts of Javascript and React
* Written Javascript in ES5 and ES6 standard
* Used Node Package Manager(npm)
* Installed Nodejs and npm/yarn

# Get started

Let's create the folder to house the electron app and change the directory to it.

```bash
$ mkdir electron_react_app && cd $_
```

Use CRA(create-react-app) cli to generate a react codebase for us
```bash
$ npx create-react-app .
``` 
Since we working with electron then we will add relevant dependencies throughout the tutorial.
```bash
$ yarn add electron electron-builder wait-on concurrently -D
``` 
* `electron` - allows us to use the electron framework.
* `electron-builder` - allows us to build the electron app to executable.
* `wait-on` - lets u wait on react to compile during development so as to render it with electron.
* `concurrently` - allows us to run both react and electron concurrently.

```bash
$ yarn add electron-is-dev
```
* `electron-is-dev` - tells electron the current environment we are working to decide either serve the build or render the react app running on `dev` environment.

Create an `electron.js` file in the public folder to house our electron logic.

```javascript
// public/electron.js
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  // Define the applications dimension
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  // Determine what to render based on environment
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  
  // Show chrome developer tools when in dev environment
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  // Create event to close window on close
  mainWindow.on("closed", () => (mainWindow = null));
}

// On launch create app window
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    // Based on which operating system you are using
  if (process.platform !== "linux") {
      // If os not linux, close the app
      // you can add darwin(mac os), win64 and so many more
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow !== null) {
    createWindow();
  }
});
```

Next, we will add a command to the `package.json` script tag to run both react and electron concurrently.

```json
"electron-dev": "concurrently \"BROWSER=none yarn start\" \"wait-on http://localhost:3000 && electron .\""
```

The script will wait until CRA compiles the react app then starts the electron app.

Also for you to start the electron app you will have to point where the electron logic code lies. We will do so inside the `package.json` by adding the `main` value.

```json
"main": "public/electron.js"
```

Let's run our app.

```bash
$ yarn electron-dev
```

You should see this.

![Screenshot at 2019-12-28 10-04-16.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1577516828425/q7o4qv42l.png)

For a person who has used react before, you should be wondering why a new tab on your browser wasn't opened, this is because of the environment we defined while running `electron-dev`, `BROWSER=none`.

Now, if you need to access the fs module as I did, you'll quickly hit the Module not found error. More info [here](https://stackoverflow.com/questions/35428639/how-can-i-use-fs-in-react-with-electron).

Fortunately, it can be solved with the use of `electron-renderer` as the Webpack target. You will not have to change anything else in your React code rather we will use a third-party library called [`Rescripts`](https://github.com/harrysolovay/rescripts)

Let's install the library
```bash
$ yarn add @rescripts/cli  @rescripts/rescript-env -D
```

We will also have to change the script tags in the `package.json` file

**From**
```json
"start": "react-scripts start",
"build": "react-scripts build",
"test": "react-scripts test",
```

**To**
```json
"start": "rescripts start",
"build": "rescripts build",
"test": "rescripts test",
```

Next, add the `.rescriptsrc.js` file in your root folder, and add the line below
```javascript
module.exports = [require.resolve('./.webpack.config.js')]
```

We definitely need to create the `.webpack.config.js` file to avoid import errors.

```javascript
module.exports = config => {
  config.target = 'electron-renderer';
  return config;
}
```

Now your `fs` worries are over.

# Packaging the app

To package our app, we will need a couple of dependencies.

```bash
yarn add electron-builder typescript -D
```
* `electron-builder` - to package the app with all of its dependencies.
* `typescript` - `electron-builder` is dependent on typescript
> **Note**: You will not write any typescript, and I won't pressure you to use it.

We need to define the homepage route because when react builds it uses absolute paths, and electron doesn't do absolute path. You can change this inside the `package.json` file by adding a `homepage` property.
```json
"homepage": "./",
```

Next, add an `electron-pack` command, which will package our builds.

Add the following to your `scripts` tag in `package.json`

```json
"postinstall": "electron-builder",
"preelectron-pack": "yarn build",
"electron-pack": "build -mw"
``` 

* `postinstall` - will ensure that your dependencies always match the electron version
* `preelectron-pack` - will build the react app
* `electron-pack` - package the app for your operating system of choice.

Before we can do run anything we will have to configure Electron builder.

Add the following to your `package.json` file.

```json
"author": {
  "name": "Your Name",
  "email": "your.email@domain.com",
  "url": "https://your-website.com"
},
"build": {
  "appId": "com.my-website.my-app",
  "productName": "MyApp",
  "copyright": "Copyright © 2019 ${author}",
  "mac": {
    "category": "public.app-category.utilities"
  },
  "files": [
    "build/**/*",
    "node_modules/**/*"
  ],
  "directories": {
    "buildResources": "assets"
  }
}
```

Your `package.json` file should look like this.
```json
{
  "name": "my-app",
  "description": "Electron + Create React App + Electron Builder",
  "version": "0.1.0",
  "private": true,
  "author": {
    "name": "Your Name",
    "email": "your.email@domain.com",
    "url": "https://your-website.com"
  },
  "build": {
    "appId": "com.my-website.my-app",
    "productName": "MyApp",
    "copyright": "Copyright © 2019 ${author}",
    "mac": {
      "category": "public.app-category.utilities"
    },
    "files": [
      "build/**/*",
      "node_modules/**/*"
    ],
    "directories": {
      "buildResources": "assets"
    }
  },
  "dependencies": {
    "electron-is-dev": "^1.0.1",
    "react": "^16.8.3",
    "react-dom": "^16.8.3",
    "react-scripts": "2.1.5"
  },
  "homepage": "./",
  "main": "public/electron.js",
  "scripts": {
    "start": "rescripts start",
    "build": "rescripts build",
    "test": "rescripts test",
    "eject": "react-scripts eject",
    "electron-dev": "concurrently \"BROWSER=none yarn start\" \"wait-on http://localhost:3000 && electron .\"",
    "postinstall": "electron-builder",
    "preelectron-pack": "yarn build",
    "electron-pack": "build -mw"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ],
  "devDependencies": {
    "@rescripts/cli": "^0.0.10",
    "@rescripts/rescript-env": "^0.0.5",
    "concurrently": "^4.1.0",
    "electron": "^4.0.6",
    "electron-builder": "^20.38.5",
    "typescript": "^3.3.3333",
    "wait-on": "^3.2.0"
  }
}
```

You will also want to create a directory called `assets` where you will add your app icons. Check [here](https://www.electron.build/icons) to see the formats for these icons.

Now you can package your app

```bash
$ yarn electron-pack
```
# Background context

If you happen to encounter an error like this on linux.
```bash
[2720:0425/142001.775056:FATAL:setuid_sandbox_host.cc(157)] The SUID sandbox helper binary was found, but is not configured correctly. Rather than run without sandboxing I'm aborting now. You need to make sure that /home/<name>/src/ssbc/patchwork/node_modules/electron/dist/chrome-sandbox is owned by root and has mode 4755.
```

You can fix that like that by adding with this command.

> Ensure you are in the project directory

```bash
$ sudo chown root node_modules/electron/dist/chrome-sandbox
```
Then

```bash
$ sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
```
Your Linux package app won't work automatically because it has the `.Appimage` extension by default. You will have to make it executable.

> Ensure you are in the dist folder

You can do so by:
```bash
$ chmod a+x '<You app>.AppImage'
```
Then run it
```bash
$ ./<You app>.AppImage
```

If experience the 4755 error again then use this command:
```bash
$ sudo chown root '<Your appname>.AppImage' 
```
Then

```bash
$ sudo chmod 4755 '<Your appname>.AppImage'   
```

Then try running it again.

You can also build a Linux app to your preferred type e.g. Debian.
* Debian [here](https://github.com/electron-userland/electron-installer-debian)

# Follow up

* Comment if any questions
* Follow me on twitter [@wachira_dev](https://twitter.com/wachira_dev)
* Repo [here](https://github.com/werickblog/electron_react_app)
