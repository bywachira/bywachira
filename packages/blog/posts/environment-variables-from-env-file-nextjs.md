---
title: "Environment varibles from env file in Nextjs"
date: "2019-07-31"
slug: "environment-variables-from-env-file-nextjs"
draft: false
tags: ["nextjs", "reactjs", "env"]
menu: "nextjs"
description: "How to access .env variables in Next"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854495/blog/ENV-Next.png"
author:
    twitter: "wachira_dev"
    name: "Erick Wachira"
---

If you started building your application with `next` and you want it to access environment variables in your `.env` file here is away.

## Why you need a `.env` file

There are a number of reasons why you should have a `.env` file when working on an application, they are:
* **Security**: A `.env` file can be used to store critical and sensitive credentials such as `access_tokens`, `secret_keys` or `api_keys` thus ensuring they are not exploited by a hacker prying on your repo.
* **Varying Configs**: Having a `.env` file will you help in sorting out varying app configurations in different deploys(development, production or staging) such as:
    * Resource handles such as Databases
    * Local, production, development, and staging URL.

## Getting started

Normally accessing environment variables with Node you use `process.env` and in your terminal, you will have to export your environment variable to be accessed by Node. Example:

```bash
$ export PRODUCTION_URL="https://werick.codes/"
```

I can now access the environment variable with Node 
```js
 process.env.PRODUCTION_URL
```

Also for a Node application to get all variables in the `.env` file automatically without the `export` command in the terminal you will need to install a `dotenv` library.

### Lets get into it

Install `dotenv`
```bash
$ npm install dotenv 
//or 
$ yarn add dotenv
```

Open the `next.config.js`, type this in your editor

```js
const webpack = require("webpack");
// Initialize doteenv library
require("dotenv").config();

module.exports = {
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }
    /**
     * Returns environment variables as an object
     */
    const env = Object.keys(process.env).reduce((acc, curr) => {
             acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
             return acc;
   }, {});

    /** Allows you to create global constants which can be configured
    * at compile time, which in our case is our environment variables
    */
    config.plugins.push(new webpack.DefinePlugin(env));
    return config
  }
}
```
Thats all you need for `next` to environment variables without exporting them on the terminal. 

You can read more about `reduce()` method [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) and about the `DefinePlugin()` method [here](https://webpack.js.org/plugins/define-plugin/)

## Extras
* Repo link [here](https://github.com/werickblog/next_with_environment_variables)
* Demo link [here](https://nextwithenvironmentvariables.ewachira254.now.sh/)