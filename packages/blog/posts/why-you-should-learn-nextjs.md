---
title: "Why You Should Learn Nextjs"
date: "2019-07-02"
draft: false
description: "Reasons to learn next"
tags: ["next", "react", "ssr", "css-in-js"]
menu: "nextjs"
slug: "why-you-should-learn-nextjs"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854494/blog/learn-Next.png"
author:
  twitter: "wachira_dev"
  name: "Erick Wachira"
---

Next.JS is a javascript framework that allows developers to create server-rendered react web apps also comes with other perks that make frontend development swift.

## How I encountered Next.JS?

I am currently reworking on my own personal blog with React and Next.JS on the frontend and Express powering the backend.

So why am I redoing my blog from scratch? Before I could launch an MVP of the blog, I had to work on the SEO and also make it easier for web crawlers, which in turn helps with a great search engine score and indexing. I had two options:

- Write my own express server to serve my React app
- Use libraries like `prerender` and `react-snap`

So I tried them all and the journey was not that fine:

- When creating my own express server, I suffered from a `Babel` and `webpack` version inconsistency problem. This took me like forever, I was deleting the `yarn.lock` file and also the node_modules over and over, I also tried the `npm` suggestions but nothing.

  ![bummer](https://media.giphy.com/media/l0MYv7rC7HeZeuuWI/giphy.gif)

- When working with `prerender` and `react-snap`, it worked perfectly locally on my laptop but kept on failing my `Netlify` build.

  ![bummer](https://media.giphy.com/media/40OlZsaF8UheU/giphy.gif)

After all the hard work and almost a months time wasted on SSR, I kinda gave up and just launched my blog. On a particular day, I was listening to the [**Full Stack Radio** Episode 99](https://castbox.fm/episode/99%3A-Tim-Neutkens-Building-React-Apps-with-Next.js-id491638-id95523685?country=us) where he was interviewing [Tim Neutkens](https://twitter.com/timneutkens) about `next`, I took note of four words about `next`,
`...server rendered client applications...`. I quickly opened a new tab, visited [`next`](https://nextjs.org) website, that was my _eureka moment_.

![eureka](https://media.giphy.com/media/5z0cCCGooBQUtejM4v/giphy.gif)

## Advantages of using Next

- Server Side Rendering out of the box
  Next handles SSR in such an easy way. Install, run your app, open your browser, you got SSR. Some advantages of SSR are _rich link previews_.

![Screenshot 2019-07-02 at 6.51.58 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1562082737259/OovYycULi.png)

- Static Exporting

  Next also handles serving of static files. No need of extra libraries.

- CSS in JS

  Writing `CSS in JS` comes in built in `next`, there is no need to install other
  packages such as `emotion`, `JSS` and such.

- Fully customisable

  It handles most parts automatically such as the SSR functionality but `next` still allows customization over `Babel`, `webpack`, `routing` and `next-plugins`.

- Progressive Web Apps

  Creating a PWA is way too easy with `next`...Stat tuned as we will look into
  [`next features`](ttps://nextjs.org/features/)

- Ready for production

  Next is super fast and it's optimised for smaller build size making your web
  app size realy small and faster.

- Zero Setup

  Next also handles most of your setup process such as _file system_, _routing_, _hot code reloading_ and _universal rendering_.

- Used by most known companies

  Among the reasons why [Stackshare](https://stackshare.io/) is successful is
  because developers like to know which stacks companies like **Netflix** use
  to scale their application, so that we learn them, put them on our resumes and
  maybe make a score on the interview.

- Handles static and dynamic sites

  Next handles static and dynamic sites seamlessly no need to add extra
  configarations.

- Smaller learning curve
  You will still write React, you will not experience the `Angular 1` and `Angular 4` effect. Next handles somethings that will save you a lot of time such as _routing_ but I will get more into details on the next article, Stay tuned

## Disadvantages of Next

How is this framework so perfect? Well its not, it has its own flaws such as:

- Redux

  Implementing Redux might be a hustle, especially during setup.

- Handles way too much
  Next handles a lot of functionality that you might take for granted, if you do you might ignore looking into them while.
  > _Note_: If you are looking into using `next`, use `react-scripts` for a while until you have grasped important concepts especially `routing`

So far those are the disadvantages I know, if you happen to know or face a couple more, please share so that I add them to this post. You can do so via comments or a twitter mention.

## Summary

TL;DR;

In this post we were able to:

- Look into why I started to look into `next`
- Advantages of `next`
- Disadvantages of `next`

## Next

On the next part of the [`Next meets React`](https://hashnode.com/series/next-meets-react-cjxisouyu00169as14ijyu22j) series we will work on a simple web app to grasp each and every `next` features.

## Disclaimer

> _Note_(_no bad blood_): Why you should choose `next` is just my opinion, I have no problem with you handling SSR on your own nor do I have trouble with devs using `react-scripts`.

## Feedback

Providing feedback about this article will be highly appreciated. Reach out on twitter [wachira_dev](https://twitter.com/wachira_dev) or on this platform through chat.

# Stay Tuned 😁
