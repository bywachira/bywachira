---
title: "Create API with Gin in Golang Part 3"
description: "Create a RESTful API with Golang"
slug: "create-golang-api-with-gin-and-mongo-3"
date: "2020-08-12"
draft: false
menu: "golang"
tags: ["golang", "scrapper", "mongo", "env", "mgo.v2"]
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854496/blog/Create-API-with-Gin-Part-1.png"
author:
  twitter: "wachira_dev"
  name: "Erick Wachira"
series_label: "Create Golang API with Gin and Mongo"
series: true
---

The third part of this series is here, its actually an interesting one because we dabble with a bit of web scrapping and Gin middlewares. In the last part, I mentioned we are going to create a bookmark API instead of TODO, I figured there are way too many out there.

By the end of this article you will have a number of endpoints that perform certain CRUD operations, these are:

- Create a bookmark
  The link is scrapped to collect the meta tag details for Twitter and Facebook if we ever want to show **Rich link previews** on the client side.
- Delete a bookmark
- Protect the endpoints with the help of the middleware
- Fetch all bookmarks they saved.

# Introduction

## Prerequisites

The basics of Golang and you read the previous articles in this series.

## Getting Started

### Goals

- A logged in user is able to create a bookmark
- A logged in user is able to fetch their own bookmarks
- A logged in user is able to delete a bookmark they created
- Protect bookmark endpoints with middleware to confirm that

### Setup

Go through the last articles for the project setup

### Let's hack it

#### Authentication Middleware

We will need to create a middleware to check if users have logged in order to perform certain actions which are `creating`, `fetching` and `deleting` bookmarks.

First we will create a new file under `middlewares` folder, called `authenticate.go`

```go
// Define the package
package middlewares

import (
    // Import Gin to abort on any errors
    "github.com/gin-gonic/gin"
    // To retrieve certain methods and User model
    "github.com/tesh254/golang_todo_api/models"
    // Services to enable use to handle decoding jwt tokens
	"github.com/tesh254/golang_todo_api/services"
)

// This will help in handling error response
func responseWithError(c *gin.Context, code int, message interface{}) {
	c.AbortWithStatusJSON(code, gin.H{"message": message})
}

// Authenticate is a middleware that fetches user details from token
func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {

        // Fetch token from the headers
		requiredToken := c.Request.Header["Authorization"]

        // Check if the token is provided
		if len(requiredToken) == 0 {
            // Abort with error
			responseWithError(c, 403, "Please login to your account")
		}

        // Get email from encoded token
		userID, _ := services.DecodeToken(requiredToken[0])

        // Fetch user based on email retrieved from token
		result, err := new(models.UserModel).GetUserByEmail(userID)

        // Check if an account was not found
		if result.Email == "" {
            // Respond with a 404 when resource is not found
			responseWithError(c, 404, "User account not found")
			return
		}

        // Check if an error occured while fetching a user
		if err != nil {
            // Respond with an Internal Server Error
			responseWithError(c, 500, "Something went wrong giving you access")
			return
		}

        // Set the User variable so that we can easily retrieve from other middlewares
		c.Set("User", result)

        // Call the next middlware
		c.Next()
	}
}
```

### Scrapping a website

While making this API, having it all plain CRUD did seem fun and felt lazy so I decided to make a scrapper to check the `meta` tags for the save bookmark.

I was able to achieve this with the help of `goquery` and `net` library

The `meta` tags that we are interested in are `twitter:` and `og:` which help Twitter and Facebook respectively show rich link previews when you share links, like the one below

An example of a `Twitter` meta tag is shown below

```html
<meta property="twitter:site" content="Dev Community" />
```

All Facebook meta tags have `og` guess it means Open Graph like their API.

![](/post_images/twitter.png)

So lets install `goquery`

```bash
go get github.com/PuerkitoBio/goquery
```

Next lets write the scrapper

```go
// Define the package
package services

import (
    // will allow us to make calls to the website
    "net/http"
    // help in defining a timeout for the request
    "time"

    // Help in finding tags and attributes in the html loaded
    "github.com/PuerkitoBio/goquery"
    // To handle failed responses
	"github.com/gin-gonic/gin"
)

// Scrapper holds methods to scrape a site
type Scrapper struct{}

// Meta define meta data type
type Meta struct {
	Image, Description, URL, Title, Site string
}

// CallWebsite make an http request to a website
func (scrapper *Scrapper) CallWebsite(websiteURL string, c *gin.Context) Meta {
    // Define variable to hold the attributes srapped
	var meta Meta = Meta{
		Image:       "",
		Description: "",
		URL:         "",
		Title:       "",
		Site:        "",
	}

    // Define the client timeout
	client := &http.Client{
		// Set timeout to abort if the request takes too long
		Timeout: 30 * time.Second,
	}

    // Define the request obviously it is a GET one
	request, err := http.NewRequest("GET", websiteURL, nil)

    // Check if we get an error
	if err != nil {
        // Respond with a 500 status code
		c.AbortWithStatusJSON(500, gin.H{"message": err})
	}

    // Set headers
	request.Header.Set("pragma", "no-cache")

	request.Header.Set("cache-control", "no-cache")

	request.Header.Set("dnt", "1")

	request.Header.Set("upgrade-insecure-requests", "1")

	request.Header.Set("referer", websiteURL)

	// Make website request call
	resp, err := client.Do(request)

	// If we have a successful request
	if resp.StatusCode == 200 {
		doc, err := goquery.NewDocumentFromReader(resp.Body)

		if err != nil {
			c.AbortWithStatusJSON(400, gin.H{"message": err})
		}

		// Map through all meta tags fetched
		doc.Find("meta").Each(func(i int, s *goquery.Selection) {
            // Specify the meta tags we want and assign the variables as the doc.Find
            // loops through all of them
			metaProperty, _ := s.Attr("property")
			metaContent, _ := s.Attr("content")

            // If we happen to get any of the two then assign the Site attribute for Meta
			if metaProperty == "og:site_name" || metaProperty == "twitter:site" {
				meta.Site = metaContent
			}

            // If we happen to get any of the two then assign the URL attribute for Meta
			if metaProperty == "og:url" {
				meta.URL = metaContent
			}
            // If we happen to get any of the two then assign the Image attribute for Meta
			if metaProperty == "og:image" || metaProperty == "twitter:image" {
				meta.Image = metaContent
            }

            // If we happen to get any of the two then assign the Title attribute for Meta
			if metaProperty == "og:title" || metaProperty == "twitter:title" {
				meta.Title = metaContent
			}

            // If we happen to get any of the two then assign the Description attribute for Meta
			if metaProperty == "og:description" || metaProperty == "twitter:description" {
				meta.Description = metaContent
			}
		})
    }

    // Return the meta variable with updated fields
	return meta
}

```

### Create a bookmark model

Create a file in the `models` folder called `bookmark.go` and lets jump into some code, there is nothing new about this file just defining the methods we are going to use to perform **Read and Write** operations to the database

```go
// Define the package
package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

// Link defines user object structure
type Link struct {
	ID              bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Name            string        `json:"name" bson:"name"`
	MetaImage       string        `json:"meta_image" bson:"meta_image"`
	MetaDescription string        `json:"meta_description" bson:"meta_description"`
	MetaSite        string        `json:"meta_site" bson:"meta_site"`
	MetaURL         string        `json:"meta_url" bson:"meta_url"`
	MetaTitle       string        `json:"meta_title" bson:"meta_title"`
	Link            string        `json:"link" bson:"link"`
	Owner           bson.ObjectId `json:"owner" bson:"owner"`
	CreateAt        time.Time     `json:"created_at" bson:"created_at"`
}

// BookmarkModel defines the model structure
type BookmarkModel struct{}

// CreateBookmark handles creating a bookmark by the user
func (l *BookmarkModel) CreateBookmark(data Link) error {
	// Connect to the bookmark collection
	collection := dbConnect.Use(databaseName, "bookmark")
	// Assign result to error object while saving bookmark
	err := collection.Insert(bson.M{
		"name":             data.Name,
		"meta_image":       data.MetaImage,
		"meta_description": data.MetaDescription,
		"meta_site":        data.MetaSite,
		"meta_url":         data.MetaURL,
		"meta_title":       data.MetaTitle,
		"link":             data.Link,
		"owner":            data.Owner,
		"created_at":       data.CreateAt,
	})

	return err
}

// FetchBookmarks handles fetching bookmarks by a user
func (l *BookmarkModel) FetchBookmarks(id bson.ObjectId) (bookmarks []Link, err error) {
	collection := dbConnect.Use(databaseName, "bookmark")

	err = collection.Find(bson.M{"owner": id}).Sort("-$natural").All(&bookmarks)

	return bookmarks, err
}

// DeleteBookmark handles deleting a bookmark
func (l *BookmarkModel) DeleteBookmark(id string) error {
	collection := dbConnect.Use(databaseName, "bookmark")

	err := collection.RemoveId(id)

	return err
}

```

### Create the bookmark controllers

Go ahead and create a file on the `controllers` folder called `bookmark.go`

```go
package controllers

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tesh254/golang_todo_api/forms"
	"github.com/tesh254/golang_todo_api/helpers"
	"github.com/tesh254/golang_todo_api/models"
	"github.com/tesh254/golang_todo_api/services"
)

// Import bookmark model from the models file
var bookmarkModel = new(models.BookmarkModel)

// BookmarkController defines the bookmark controller
type BookmarkController struct{}

func responseWithError(c *gin.Context, code int, message interface{}) {
	c.AbortWithStatusJSON(code, gin.H{"message": message})
}

// FetchBookmarks controller handles fetching all bookmarks of a specific user
func (b *BookmarkController) FetchBookmarks(c *gin.Context) {
    // Get the user we set in the Authenticate middleware
	user := c.MustGet("User").(models.User)

    // Check if we have user and respond if not
	if user.Email == "" {
		responseWithError(c, 404, "Please login")
		return
	}

    // Define a variable to hold the model methods
	var linkModel models.BookmarkModel

    // Fetch own bookmarks based on ID of the user
	results, err := linkModel.FetchBookmarks(user.ID)

    // Check if we have an error performing the database operation
	if err != nil {
		responseWithError(c, 500, "Problem fetching your articles")
		return
	}

    // Return results if none an empty array
	if results != nil {
		c.JSON(200, gin.H{"bookmarks": results})
	} else {
		c.JSON(200, gin.H{"bookmarks": []string{}})
	}

}

// DeleteBookmark controller handles deleting a single bookmark
func (b *BookmarkController) DeleteBookmark(c *gin.Context) {
	 // Get the user we set in the Authenticate middleware
	user := c.MustGet("User").(models.User)

    // Check if we have user and respond if not
	if user.Email == "" {
		responseWithError(c, 404, "Please login")
		return
	}

    // Get query parameter value that holds the bookmakr id
	bookmarkID, found := c.GetQuery("bookmark_id")

    // Check if the query parameter `bookmark_id` is provided, respond if not
	if !found {
		responseWithError(c, 400, "Please provide bookmark id")
		return
	}

    // Define variable to hold the model methods
	var linkModel models.BookmarkModel

    // Delete record
	err := linkModel.DeleteBookmark(bookmarkID)

    // Check if we got an error while deleting the file
	if err != nil {
		responseWithError(c, 500, "Problem deleting bookmark")
		return
	}

    // Respond with a 204 No Content on successful delete
	c.JSON(204, gin.H{"message": "Deleted bookmark successfully"})
}

// CreateBookmak controller handles creating a bookmark of a specifi user
func (b *BookmarkController) CreateBookmak(c *gin.Context) {
	 // Get the user we set in the Authenticate middleware
	user := c.MustGet("User").(models.User)

    // Check if we have user and respond if not
	if user.Email == "" {
		responseWithError(c, 404, "Please login")
		return
	}

    // Define variable to hold the payload structure
	var data forms.BookmarkPayload

	// Check if required fields are provided
	if c.BindJSON(&data) != nil {
		log.Fatal(c.BindJSON(&data))
		responseWithError(c, 406, "Please provide link, and name")
		return
	}

    // Define variable to hold the model methods
	var linkModel models.BookmarkModel

    // Check if the url is valid and respond if its not
	if !helpers.IsValidURL(data.Link) {
		responseWithError(c, 400, "Link is invalid")
	}

    // Define a variable to hold out scrapper methods
	var scrapper services.Scrapper

    // Make a website request based on the link provided on the request body
	var meta services.Meta = scrapper.CallWebsite(data.Link, c)

    // Define the data to be save to the database
	var bookmarkPayload models.Link = models.Link{
		Name:            data.Name,
		MetaImage:       meta.Image,
		MetaDescription: meta.Description,
		MetaSite:        meta.Site,
		MetaURL:         meta.URL,
		Link:            data.Link,
		Owner:           user.ID,
		CreateAt:        time.Now(),
	}

    // Save the bookmakr
	err := linkModel.CreateBookmark(bookmarkPayload)

    // Check if we got an error while saving and respond if we do
	if err != nil {
		responseWithError(c, 500, "Problem saving your bookmark")
		log.Fatal(err)
		return
	}

    // Return a 201 Created on successful creation with the bookmark saved
	c.JSON(201, gin.H{"message": "Bookmark saved", "bookmark": bookmarkPayload})
}
```

### Some things that I shouldn't leave out

1. The URL validator

```go
// Define the package
package helpers

// Import the URL
import "net/url"

// IsValidURL checks validity of URL
func IsValidURL(link string) bool {
    // Parse the URL with the net library
    _, err := url.ParseRequestURI(link)

    // Check if we got an error while parsing the url
	if err != nil {
		return false
	}

	u, err := url.Parse(link)

    // Check if we had an error while parsing
    // Check if the scheme is provided https:// http://
    // Check if a host exists google.com, bywachira.com
	if err != nil || u.Scheme == "" || u.Host == "" {
		return false
	}

	return true
}
```

2. Bookmark request body structure

```go
package forms

// BookmarkPayload defines the payload sent by the user
type BookmarkPayload struct {
	Name string `json:"name" binding:"required"`
	Link string `json:"link" binding:"required"`
}

```

This will belong in the `forms/bookmark.go` file.

And that's it

### Define the endpoints

Finally we need to define the endpoints for the bookmark endpoints for us to make calls and make use of the blocks of code we created

```go
// v1 group...

// Define a group to hold the bookmarks
bookmarks := v1.Group("/bookmarks")

// Use the Authenticate middleware
bookmarks.Use(middlewares.Authenticate())

{
    // Create GET request for the bookmakrs
    bookmarks.GET("/all", link.FetchBookmarks)
    // Create POST request to create a bookmark
    bookmarks.POST("/create", link.CreateBookmak)
    // Create DELETE request to delete a bookmark
    bookmarks.DELETE("/delete", link.DeleteBookmark)
}
// ...
```

## Summary

- Created endpoints to handle creating, fetching and deleting bookmark(s).
- Create a middleware to check if user is authenticated.

## Extras

- Repo link [here](https://github.com/werickblog/golang_todo_api)
- Follow me on twitter [here](https://twitter.com/wachira_dev)
- Join Discord server for any questions [here](https://discord.gg/uCxDKD8)

![](https://media.giphy.com/media/PhNyx0KawRIGq29UlQ/giphy.gif)
