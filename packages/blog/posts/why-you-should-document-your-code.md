---
title: "Why You Should Document Your Code"
date: "2019-06-23"
draft: false
description: "Reasons why you should document your code"
tags: ["documentation"]
menu: "coding"
slug: "why-you-should-document-your-code"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854495/blog/Document-code.png"
author: 
    twitter: "wachira_dev"
    name: "Erick Wachira"
---

## Brief History
A year ago I built an e-commerce API with Flask and consumed it with React on the frontend. It was the first time I built a web app like that where the frontend and backend were very separate because before I would use templating engines like `Jinja` for Flask and `Handlebars` for Express. Those were the times when I just started programming, I was so full of energy and very ignorant sometimes. I remember seeing a meme or statement like this: 

![comments.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561277377793/xZ28rZnzi.png)

Back then I used to follow this statement to the core. If someone had asked me later then what a specific line of code did then I would totally utter out the logic in an instance, as the code was still fresh and flowing through my brain cell networks. 

## Aftermath
Later about 8 months I started to gain interest in building APIs with express so the first thing I did was well try to build a similar `e-commerce` `API` with `express` and not `Flask`. I opened two editors side by side. One with Flask the other an empty express API. The idea behind this was to sharpen my express API skills, if I can translate a Flask API to express then I am golden.

An hour through the Flask API code, I was like **what kind of sorcery is this**:

![WTF is this](https://media.giphy.com/media/B0RIXzGCT32Xm/giphy.gif)

So I took a break, and then I thought I probably wrote something about these endpoints on `Postman`. This was definitely the expression I had on my face:

![Shocked](https://media.giphy.com/media/oYtVHSxngR3lC/giphy.gif)

I used to save a Postman collection with just plain endpoints nothing to say what they do or need. I did not know which endpoints needed authentication and going through the Flask API was a mess, from variable names to class names. There was a variable I named `c` What was I doing? I quickly closed the Flask API editor and Postman.

![Ummh will come back later](https://media.giphy.com/media/R6qJk6EilMJUI/giphy.gif)

I never opened the API again and the reason was due to lack of documentation.

## How can you document your code?

It's actually simple, you can document your code in various ways:
* _Write comments_: I definitely changed my mantra from *Real Programmers do not comment their code* to *A quick description won't hurt*. Commenting your code will not only make your development faster and easier but will also keep the logic of the code fresh in your mind.
```javascript
// @route: Gets all profiles
route.get("/profiles", (req, res, next) => {
// ...
}
```

* _Descriptive variable, function and class names_: If you ever name anything in your code make it descriptive, even if you lack a comment the name might still give you an idea of what is going on
 ```javascript
 let c; // ❌This is wrong as we don't know what is c. Is it the cart, checkout

 let cart; // ✅Now this is more descriptive

 const fetchData = () => {} // ❌ This function name does not say anything at all

 const fetchProfileData = () => {} // ✅ This function here tells as that this method fetches profile data
 ```

* _Document your API_: If you have an API and maybe you are using a tool like `Postman` or `Insomnia` to test our your endpoints, giving it descriptive documentation might not hurt you in any way.
    ##### How to document your code with Postman
    * Always create a collection to house all your API endpoints
      
      ![Screenshot 2019-06-23 at 11.52.40 AM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561280120457/DOQdu6_87.png)

     ![Screenshot 2019-06-23 at 11.54.09 AM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561280128881/7hRFGFcyz.png)

    ![Screenshot 2019-06-23 at 11.54.24 AM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561280134599/1sc8zxa-X.png)
     * Always document each request you add to your collection
       
       ![Screenshot 2019-06-23 at 11.57.16 AM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561280531716/93Xg0hqr4.png)

      ![Screenshot 2019-06-23 at 12.01.42 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561280537187/d8fiF7gaZ.png)

## Advantages of Documenting your code
* _Faster Development_: Documenting your code and API endpoint will save you a ton of time to work on updates, populate and fix bugs easily and also allow you to meet your girlfriend or boyfriend or chill with the family😁.
* _Easier collaboration_: Let's say you open source your project and you want the developer community to help you in building and shipping your project,  you do not want to scare them off with unreadable code.
* _Get feedback fast_: If you use a tool like Postman you can share your documentation online so that people can test it out and give you feedback instantly.
    ##### How to share Postman documentation
    * You have to first sign up/sign in to postman on your computer
    * Visit their official website, sign in
    * Click on your workspace
    
    ![Screenshot 2019-06-23 at 12.21.04 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561281710079/z15ceu2Rk.png)
    * Click on the collections tabs
    ![Screenshot 2019-06-23 at 12.21.29 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561281747972/zUN7Oca-f.png)
    * Click on your collection, and if you might notice there is a collection description which explains what it contains.
    ![Screenshot 2019-06-23 at 12.23.06 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561281864460/kNLXB4vpS.png)
    * You will be redirected to a page with all your endpoints where you can test out your functionality.
    ![Screenshot 2019-06-23 at 12.24.49 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561281936431/DkjHRwdEq.png)
    * From there you can choose to publish your documentation or invite users to your workspace. If you click `Publish`, you will be provided with a public link in which you can share with your friends to test it out. If you choose `Share` you will give access to all your collections even those that you might want to remain private.
    
    ![Screenshot 2019-06-23 at 12.29.38 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561282219679/cDLJsEo7q.png)
   ![Screenshot 2019-06-23 at 12.29.48 PM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1561282224995/uF3jYo6-5.png)
   Here is the [link](https://documenter.getpostman.com/view/6195680/S1a1bUgX) to the collection we just created. 

Postman is not the only tool that you can use to document your API, there is:
* [Swagger](https://swagger.io/)
* [Apiary](https://apiary.io/)
* [ApiBlueprint](https://apiblueprint.org/) and many more.

## Summary

In this article, we were able to:
* See why documentation is important
* List tips on how you can document your code
* List tips on how you can document your API endpoints with tools like Postman.

## Next

On the next article,  I will focus on Github documentation from PR to commits.