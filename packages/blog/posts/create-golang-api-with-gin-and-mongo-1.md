---
title: "Create API with Gin in Golang Part 1"
slug: "create-golang-api-with-gin-and-mongo-1"
date: "2020-02-08"
draft: false
tags: ["golang", "gin", "mongo", "env", "sendgrid", "mgo.v2"]
menu: "golang"
description: "Create an API with Golang"
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854496/blog/Create-API-with-Gin-Part-1.png"
author:
  twitter: "wachira_dev"
  name: "Erick Wachira"
series_label: "Create Golang API with Gin and Mongo"
series: true
---

I just started learning to Golang recently, and I must say the Golang is not that difficult. To fully grasp the syntax as a web developer I opted to create an API.

In this blog, we are going to create an Authentication API with the help of the `gin` web framework and use a MongoDB database with the help of `mgo.v2`

This blog will be a two-part series covering all authentication endpoints:

- The first part focuses on basic Signup and Login of a user.
- The second part will focus on using Account verification via email with the help of SendGrid, Token blacklisting, and Password reset request.

# Introduction

## Prerequisites

To be able to grasp the contents and syntax of this blog you should have used golang before and setup the directory for development.

# Getting started

## Goals

By the end of this article we should be able to:

- Use the API to sign up
- Use the API to log in

## Setup

Create the folder to hold the Golang project inside the set `$GOPATH` directory

```bash
$ mkdir golang_api_with_gin && cd $_
```

Our project directory setup will look something similar to this:

```bash
|-- db # hold files interacting with db connection
|-- controllers # holds files that handle controllers
|-- models # holds functions that interact with the database
|-- helpers # holds helper functions such as token generation
|-- forms # holds files with request body struct
|-- app.go # Will hold the app routes and server
```

Let's run `go mod init` on the terminal to track the libraries we are using. This will create a `go.mod` file.

We need to install the `gin` framework library, `godotenv` for tracking variables in our .env file and `mgo.v2` to interact with mongo

```bash
$ go get github.com/gin-gonic/gin # the web framework

$ go get github.com/joho/godotenv # environment variables

$ go get gopkg.in/mgo.v2 # mongo driver
```

### Write some code

Let's create a controller to return a JSON response with a message attribute of value "Hello world"

Go into the controller's folders and create hello.go file

```bash
$ cd controllers && touch hello.go
```

Let's write our hello world controller code

```go
package controllers

import (
	// Import the Gin library
	"github.com/gin-gonic/gin"
)

// HelloWorldController will hold the methods to the
type HelloWorldController struct{}

// Default controller handles returning the hello world JSON response
func (h *HelloWorldController) Default(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Hello world, climate change is real"})
}

```

Let's add some code to our `app.go` file

```go
package main

import (
	// Log items to the terminal
	"log"

	// Import gin for route definition
	"github.com/gin-gonic/gin"
	// Import godotenv for .env variables
	"github.com/joho/godotenv"
	// Import our app controllers
	"github.com/tesh254/golang_todo_api/controllers"
)

// init gets called before the main function
func init() {
	// Log error if .env file does not exist
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found")
	}
}

func main() {
	// Init gin router
	router := gin.Default()

	// Its great to version your API's
	v1 := router.Group("/api/v1")
	{
		// Define the hello controller
		hello := new(controllers.HelloWorldController)
		// Define a GET request to call the Default
		// method in controllers/hello.go
		v1.GET("/hello", hello.Default)
	}

	// Handle error response when a route is not defined
	router.NoRoute(func(c *gin.Context) {
		// In gin this is how you return a JSON response
		c.JSON(404, gin.H{"message": "Not found"})
	})

	// Init our server
	router.Run(":5000")
}

```

If you run your app

```bash
$ go run app.go
```

You should see something similar to this on your terminal

```bash
2020/02/07 20:17:24 No .env file found
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:	export GIN_MODE=release
 - using code:	gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /api/v1/hello             --> github.com/tesh254/golang_todo_api/controllers.(*HelloWorldController).Default-fm (3 handlers)
[GIN-debug] Listening and serving HTTP on :5000

```

Send a `GET` request to our defined `hello` endpoint.

```bash
$ curl http://localhost:5000/api/v1/hello
```

The response should be this

```json
{ "message": "Hello world, climate change is real" }
```

That's one of the so many ways to create an endpoint, its a bit long, you might just write your whole API in one file, but splitting your code into files makes your code:

- readable
- maintainable

## Database connection

Next, we are going to handle database connection in the `db` folder inside the `db.go` file

```go
// Define the package interacting with the database
package db

import (
	"os"
	"time"

	"gopkg.in/mgo.v2"
)

// DBConnection defines the connection structure
type DBConnection struct {
	session *mgo.Session
}

// NewConnection handles connecting to a mongo database
func NewConnection(host string, dbName string) (conn *DBConnection) {
	info := &mgo.DialInfo{
		// Address if its a local db then the value host=localhost
		Addrs: []string{host},
		// Timeout when a failure to connect to db
		Timeout: 60 * time.Second,
		// Database name
		Database: dbName,
		// Database credentials if your db is protected
		Username: os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PWD"),
	}

	session, err := mgo.DialWithInfo(info)

	if err != nil {
		panic(err)
	}

	session.SetMode(mgo.Monotonic, true)
	conn = &DBConnection{session}
	return conn
}

// Use handles connect to a certain collection
func (conn *DBConnection) Use(dbName, tableName string) (collection *mgo.Collection) {
	// This returns method that interacts with a specific collection and table
	return conn.session.DB(dbName).C(tableName)
}

// Close handles closing a database connection
func (conn *DBConnection) Close() {
	// This closes the connection
	conn.session.Close()
	return
}
```

### Create our Models

First of all, we will create a file in the `models` folder containing methods to perform CRUD(Create Read Update Delete) interactions with the database.

We will create `config.go` file to hold a couple of db global variables

```bash
$ cd models && touch config.go
```

Add this into the file

```go
package models

import (
	"os"

	"github.com/tesh254/golang_todo_api/db"
)

// Mongo server ip -> localhost -> 127.0.0.1 -> 0.0.0.0
var server = os.Getenv("DATABASE")

// Database name
var databaseName = os.Getenv("DATABASE_NAME")

// Create a connection
var dbConnect = db.NewConnection(server, databaseName)
```

Since we are creating an Authentication API we will create a `models/user.go` file.

Let's create the file

```bash
$ cd models && touch user.go
```

Now we add some lines of code into it.

```go
package models

import (
	"gopkg.in/mgo.v2/bson"
)

// User defines user object structure
type User struct {
	ID         bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Name       string        `json:"name" bson:"name"`
	Email      string        `json:"email" bson:"email"`
	Password   string        `json:"password" bson:"password"`
	IsVerified bool          `json:"is_verified" bson:"is_verified"`
}

// UserModel defines the model structure
type UserModel struct{}

// Signup handles registering a user
func (u *UserModel) Signup(data forms.SignupUserCommand) error {
	// Connect to the user collection
	collection := dbConnect.Use(databaseName, "user")
	// Assign result to error object while saving user
	err := collection.Insert(bson.M{
		"name":        data.Name,
		"email":       data.Email,
		"password":    data.Password,
		// This will come later when adding verification
		"is_verified": false,
	})

	return err
}
```

You might have noticed the `forms.SignupUserCommand` that defines the type of data retrieved from the controller. We we have to define the `struct` with the types.

## User Sign up

Let's go ahead and create a file to hold authentication body structs.

```bash
$ cd forms && touch user.go
```

Next we add the `SignupUserCommand` struct

```go
package forms

// SignupUserCommand defines user form struct
type SignupUserCommand struct {
    // binding:"required" ensures that the field is provided
	Name string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
```

We will have to create the user controller to interact with the database via the API requests.

We will do so by creating a new file to hold User authentication controllers `controllers/user.go`.

```bash
$ cd controllers && touch user.go
```

Let's add some code inside the file

```go
package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/tesh254/golang_todo_api/forms"
	"github.com/tesh254/golang_todo_api/models"
)

// Import the userModel from the models
var userModel = new(models.UserModel)

// UserController defines the user controller methods
type UserController struct{}

// Signup controller handles registering a user
func (u *UserController) Signup(c *gin.Context) {
	var data forms.SignupUserCommand

	// Bind the data from the request body to the SignupUserCommand Struct
	// Also check if all fields are provided
	if c.BindJSON(&data) != nil {
		// specified response
		c.JSON(406, gin.H{"message": "Provide relevant fields"})
		// abort the request
		c.Abort()
		// return nothing
		return
	}

	/*
		You can add your validation logic
		here such as email

		if regexMethodChecker(data.Email) {
			c.JSON(400, gin.H{"message": "Email is invalid"})
			c.Abort()
			return
		}
	*/

	err := userModel.Signup(data)

	// Check if there was an error when saving user
	if err != nil {
		c.JSON(400, gin.H{"message": "Problem creating an account"})
		c.Abort()
		return
	}

	c.JSON(201, gin.H{"message": "New user account registered"})
}
```

Now that we have a signup controller let's tie it to an endpoint. Go back to `app.go` and add a signup controller.

```go
...

// Define the user controller
user := new(controllers.UserController)
// Create the signup endpoint
v1.POST("/signup", user.Signup)

```

Let's create a `.env` file to hold our environment variables

```bash
$ touch .env
```

Add this to the file

```text
export DATABASE=localhost
export DATABASE_NAME=golangtodoapi
```

If `godotenv` library does not work with the .env file create a `Makefile` to export your variables and run your app. This will make it easier to run your app instead of type two commands each time while you could with one.

```makefile
run:
	@echo ":::: App is startin up ::::"
	@echo "CONFIG::  😁 Exporting environemnt variables"
	# This might vary depending on your unix os
    # some might use source by default
	/bin/sh .env
	@echo "SUCCESS:  ✔ Environment variables exported"
	@echo "INIT::::  ⚡ Running server"
	go run app.go
```

Before you run the server ensure you have a MongoDB instance running. Follow this [link](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/) to install MongoDB community version on your computer based on your operating system.

Run your server

```bash
$ go run app.go
```

Let's try to add a new user

```bash
$ curl -d '{"name": "Erick Wachira", "email": "ewachira254@gmail.com", "password": "Wachira254"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/v1/signup
```

Your response should be something similar

```json
{ "message": "New user account registered" }
```

If you go and check the user's collection contents using a GUI/Mongo cli. The document we just saved has the password saved in plain text. Well we both know that is not secure. We can fix that by using the `bcrypt` library.

We need to first install it before we start coding.

```bash
$ go get golang.org/x/crypto/bcrypt
```

After installing the library we need to create a helpers package to house helping functions for our API, this will include our password hasher and compare.

```bash
$ cd helpers && touch bcrypt.go
```

Let us add a few lines to the file.

```go
package helpers

// Allows us to hash and compare passwords
import "golang.org/x/crypto/bcrypt"

// GeneratePasswordHash handles generating password hash
// bcrypt hashes password of type byte
func GeneratePasswordHash(password []byte) string {
	// default cost is 10
	hashedPassword, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)

	// If there was an error panic
	if err != nil {
		panic(err)
	}

	// return stringified password
	return string(hashedPassword)
}

// PasswordCompare handles password hash compare
func PasswordCompare(password []byte, hashedPassword []byte) error {
	err := bcrypt.CompareHashAndPassword(hashedPassword, password)

	return err
}

```

Let's update the user model function to save a hashed password.

```go
...
err := collection.Insert(bson.M{
    "name":     data.Name,
    "email":    data.Email,
    "password": helpers.GeneratePasswordHash([]byte(data.Password)),
    // This will come later when adding verification
    "is_verified": false,
})
...
```

Let's try that again, kill and then run your server, then send a signup request again.

Now with our Makefile defined your will running your app with this command

```bash
$ make run
```

Account will be created with a hashed password, you can confirm by checking the document saved.

Now we have another problem, an account is being created with the same this will cause conflicts if the app will ever be deployed to production. We will have to fix that.

We can do so by introducing a method that finds a user with an email. We will use the result to validate if the user exists or not. Let's jump into that.

Go to the `models/user.go` file to add the method.

```go
...
// GetUserByEmail handles fetching user by email
func (u *UserModel) GetUserByEmail(email string) (user User, err error) {
	// Connect to the user collection
	collection := dbConnect.Use(databaseName, "user")
	// Assign result to error object while saving user
	err = collection.Find(bson.M{"email": email}).One(&user)
	return user, err
}
...
```

Let's modify the Signup controller to add a new condition

```go
...
result, _ := userModel.GetUserByEmail(data.Email)

// If there happens to be a result respond with a
// descriptive mesage
if result.Email != "" {
    c.JSON(403, gin.H{"message": "Email is already in use"})
    c.Abort()
    return
}
...
```

You user's controller file should look like this

```go
package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/tesh254/golang_todo_api/forms"
	"github.com/tesh254/golang_todo_api/models"
)

// Import the userModel from the models
var userModel = new(models.UserModel)

// UserController defines the user controller methods
type UserController struct{}

// Signup controller handles registering a user
func (u *UserController) Signup(c *gin.Context) {
	var data forms.SignupUserCommand

	// Bind the data from the request body to the SignupUserCommand Struct
	// Also check if all fields are provided
	if c.BindJSON(&data) != nil {
		// specified response
		c.JSON(406, gin.H{"message": "Provide relevant fields"})
		// abort the request
		c.Abort()
		// return nothing
		return
	}

	/*
		You can add your validation logic
		here such as email

		if regexMethodChecker(data.Email) {
			c.JSON(400, gin.H{"message": "Email is invalid"})
			c.Abort()
			return
		}
	*/
	result, _ := userModel.GetUserByEmail(data.Email)

	// If there happens to be a result respond with a
	// descriptive mesage
	if result.Email != "" {
		c.JSON(403, gin.H{"message": "Email is already in use"})
		c.Abort()
		return
	}

	err := userModel.Signup(data)

	// Check if there was an error when saving user
	if err != nil {
		c.JSON(400, gin.H{"message": "Problem creating an account"})
		c.Abort()
		return
	}

	c.JSON(201, gin.H{"message": "New user account registered"})
}
```

Without deleting any document from the user's collection, try the request again.

You should get this response

```json
{ "message": "Email is already in use" }
```

<br>

## User Login

We have gotten this far and have a solid user sign up endpoint we can now create a login endpoint. There are different ways to authenticate a user this include:

- Sessions
- JWT way

We are going to use the JWT(JSON Web Token) way. It has its advantages over sessions, these are:

- No Session to Manage (stateless): The JWT is a self-contained token that has authentication information, expire time information, and other user-defined claims digitally signed.

- Portable: A single token can be used with multiple backends.

- No Cookies Required, So It's Very Mobile Friendly

- Good Performance: It reduces the network round trip time.

- Decoupled/Decentralized: The token can be generated anywhere. Authentication can happen on the resource server or easily separated into its own server.

To achieve JWT authentication we need to install a JWT library to generate, and verify our tokens.

```bash
$ go get github.com/dgrijalva/jwt-go
```

`jwt-go` library is a great and simple library that will help us achieve this.

Let's create a file inside the `services` folder with the `jwt.go` file to hold our jwt methods.

```go
package services

import (
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte(os.Getenv("SECRET_KEY"))

// Claims defines jwt claims
type Claims struct {
	UserID string `json:"email"`
	jwt.StandardClaims
}

// GenerateToken handles generation of a jwt code
// @returns string -> token and error -> err
func GenerateToken(userID string) (string, error) {
	// Define token expiration time
	expirationTime := time.Now().Add(1440 * time.Minute)
	// Define the payload and exp time
	claims := &Claims{
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// Generate token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign token with secret key encoding
	tokenString, err := token.SignedString(jwtKey)

	return tokenString, err
}

// DecodeToken handles decoding a jwt token
func DecodeToken(tkStr string) (string, error) {
	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(tkStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			return "", err
		}
		return "", err
	}

	if !tkn.Valid {
		return "", err
	}

	return claims.UserID, nil
}
```

We won't have to create a `Login` user model method we can utilize the `GetUserByEmail`, following the DRY(Don't Repeat Yourself) rule. We need to add a `LoginUserCommand` to define the request body types. Go to `forms/user.go` file and add these lines of code

```go
...
// LoginUserCommand defines user login form struct
type LoginUserCommand struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
...
```

Your `forms/user.go` file should look like the code below

```go
package forms

// SignupUserCommand defines user form struct
type SignupUserCommand struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginUserCommand defines user login form struct
type LoginUserCommand struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
```

Next we create the `Login` method controller.

```go
...
// Login allows a user to login a user and get
// access token
func (u *UserController) Login(c *gin.Context) {
	var data forms.LoginUserCommand

	// Bind the request body data to var data and check if all details are provided
	if c.BindJSON(&data) != nil {
		c.JSON(406, gin.H{"message": "Provide required details"})
		c.Abort()
		return
	}

	result, err := userModel.GetUserByEmail(data.Email)

	if result.Email == "" {
		c.JSON(404, gin.H{"message": "User account was not found"})
		c.Abort()
		return
	}

	if err != nil {
		c.JSON(400, gin.H{"message": "Problem logging into your account"})
		c.Abort()
		return
	}

	// Get the hashed password from the saved document
	hashedPassword := []byte(result.Password)
	// Get the password provided in the request.body
	password := []byte(data.Password)

	err = helpers.PasswordCompare(password, hashedPassword)

	if err != nil {
		c.JSON(403, gin.H{"message": "Invalid user credentials"})
		c.Abort()
		return
	}

	jwtToken, err2 := services.GenerateToken(data.Email)

	// If we fail to generate token for access
	if err2 != nil {
		c.JSON(403, gin.H{"message": "There was a problem logging you in, try again later"})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"message": "Log in success", "token": jwtToken})
}
...
```

Your `controllers/user.go` should look something similar to this

```go
package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/tesh254/golang_todo_api/forms"
	"github.com/tesh254/golang_todo_api/helpers"
	"github.com/tesh254/golang_todo_api/models"
	"github.com/tesh254/golang_todo_api/services"
)

// Import the userModel from the models
var userModel = new(models.UserModel)

// UserController defines the user controller methods
type UserController struct{}

// Signup controller handles registering a user
func (u *UserController) Signup(c *gin.Context) {
	var data forms.SignupUserCommand

	// Bind the data from the request body to the SignupUserCommand Struct
	// Also check if all fields are provided
	if c.BindJSON(&data) != nil {
		// specified response
		c.JSON(406, gin.H{"message": "Provide relevant fields"})
		// abort the request
		c.Abort()
		// return nothing
		return
	}

	/*
		You can add your validation logic
		here such as email

		if regexMethodChecker(data.Email) {
			c.JSON(400, gin.H{"message": "Email is invalid"})
			c.Abort()
			return
		}
	*/
	result, _ := userModel.GetUserByEmail(data.Email)

	// If there happens to be a result respond with a
	// descriptive mesage
	if result.Email != "" {
		c.JSON(403, gin.H{"message": "Email is already in use"})
		c.Abort()
		return
	}

	err := userModel.Signup(data)

	// Check if there was an error when saving user
	if err != nil {
		c.JSON(400, gin.H{"message": "Problem creating an account"})
		c.Abort()
		return
	}

	c.JSON(201, gin.H{"message": "New user account registered"})
}

// Login allows a user to login a user and get
// access token
func (u *UserController) Login(c *gin.Context) {
	var data forms.LoginUserCommand

	// Bind the request body data to var data and check if all details are provided
	if c.BindJSON(&data) != nil {
		c.JSON(406, gin.H{"message": "Provide required details"})
		c.Abort()
		return
	}

	result, err := userModel.GetUserByEmail(data.Email)

	if result.Email == "" {
		c.JSON(404, gin.H{"message": "User account was not found"})
		c.Abort()
		return
	}

	if err != nil {
		c.JSON(400, gin.H{"message": "Problem logging into your account"})
		c.Abort()
		return
	}

	// Get the hashed password from the saved document
	hashedPassword := []byte(result.Password)
	// Get the password provided in the request.body
	password := []byte(data.Password)

	err = helpers.PasswordCompare(password, hashedPassword)

	if err != nil {
		c.JSON(403, gin.H{"message": "Invalid user credentials"})
		c.Abort()
		return
	}

	jwtToken, err2 := services.GenerateToken(data.Email)

	// If we fail to generate token for access
	if err2 != nil {
		c.JSON(403, gin.H{"message": "There was a problem logging you in, try again later"})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"message": "Log in success", "token": jwtToken})
}
```

Next, we will have to create a login endpoint to call the `Login` method controller.

```go
...
// Create the login endpoint
v1.POST("/login", user.Login)
...
```

We will have to add a new variable to the `.env` file, the `SECRET_KEY`that will be used to protect our JWT tokens.

```bash
...
export const SECRET_KEY=#53cR3Tk3y
...

```

Let's run our app and test out our endpoint

```bash
$ make run
```

```sh
curl -d '{"email": "ewachira254@gmail.com", "password": "Wachira254"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/v1/login
```

Your response should be something similar

```json
{
  "message": "Log in success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV3YWNoaXJhMjU0QGdtYWlsLmNvbSIsImV4cCI6MTU4MTIwNzE2Nn0.XXaDB0R9UJ7aKLQxyDDjIdj1WMNN_bP5Ez9um6_T-SU"
}
```

## Extras

- Repo [link](https://github.com/werickblog/golang_todo_api)

- Join Discord Server for any questions [link](https://discord.gg/nVQJRma)
- Follow me on Twitter [link](https://twitter.com/wachira_dev)

## Next

In the next part of this series, we will be able to send out password reset and verification emails. We will also deploy the API to Heroku on the final part of the series. I just started learning to Golang recently, and I must say the Golang is not that difficult. To fully grasp the syntax as a web developer I opted to create an API.

In this blog, we are going to create an Authentication API with the help of the `gin` web framework and use a MongoDB database with the help of `mgo.v2`

This blog will be a two-part series covering all authentication endpoints:

- The first part focuses on basic Signup and Login of a user.
- The second part will focus on using Account verification via email with the help of SendGrid, Token blacklisting, and Password reset request.

# Introduction

## Prerequisites

To be able to grasp the contents and syntax of this blog you should have used golang before and setup the directory for development.

# Getting started

## Goals

By the end of this article we should be able to:

- Use the API to sign up
- Use the API to log in

## Setup

Create the folder to hold the Golang project inside the set `$GOPATH` directory

```bash
$ mkdir golang_api_with_gin && cd $_
```

Our project directory setup will look something similar to this:

```bash
|-- db # hold files interacting with db connection
|-- controllers # holds files that handle controllers
|-- models # holds functions that interact with the database
|-- helpers # holds helper functions such as token generation
|-- forms # holds files with request body struct
|-- services
|-- app.go # Will hold the app routes and server
```

Let's run `go mod init` on the terminal to track the libraries we are using. This will create a `go.mod` file.

We need to install the `gin` framework library, `godotenv` for tracking variables in our .env file and `mgo.v2` to interact with mongo

```bash
$ go get github.com/gin-gonic/gin # the web framework

$ go get github.com/joho/godotenv # environment variables

$ go get gopkg.in/mgo.v2 # mongo driver
```

### Write some code

Let's create a controller to return a JSON response with a message attribute of value "Hello world"

Go into the controllers' folders and create hello.go file

```bash
$ cd controllers && touch hello.go
```

Let's write our hello world controller code

```go
package controllers

import (
	// Import the Gin library
	"github.com/gin-gonic/gin"
)

// HelloWorldController will hold the methods to the
type HelloWorldController struct{}

// Default controller handles returning the hello world JSON response
func (h *HelloWorldController) Default(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Hello world, climate change is real"})
}

```

Let's add some code to our `app.go` file

```go
package main

import (
	// Log items to the terminal
	"log"

	// Import gin for route definition
	"github.com/gin-gonic/gin"
	// Import godotenv for .env variables
	"github.com/joho/godotenv"
	// Import our app controllers
	"github.com/tesh254/golang_todo_api/controllers"
)

// init gets called before the main function
func init() {
	// Log error if .env file does not exist
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found")
	}
}

func main() {
	// Init gin router
	router := gin.Default()

	// Its great to version your API's
	v1 := router.Group("/api/v1")
	{
		// Define the hello controller
		hello := new(controllers.HelloWorldController)
		// Define a GET request to call the Default
		// method in controllers/hello.go
		v1.GET("/hello", hello.Default)
	}

	// Handle error response when a route is not defined
	router.NoRoute(func(c *gin.Context) {
		// In gin this is how you return a JSON response
		c.JSON(404, gin.H{"message": "Not found"})
	})

	// Init our server
	router.Run(":5000")
}

```

If you run your app

```bash
$ go run app.go
```

You should see something similar to this on your terminal

```bash
2020/02/07 20:17:24 No .env file found
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:	export GIN_MODE=release
 - using code:	gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /api/v1/hello             --> github.com/tesh254/golang_todo_api/controllers.(*HelloWorldController).Default-fm (3 handlers)
[GIN-debug] Listening and serving HTTP on :5000

```

Send a `GET` request to our defined `hello` endpoint.

```bash
$ curl http://localhost:5000/api/v1/hello
```

The response should be this

```json
{ "message": "Hello world, climate change is real" }
```

That's one of the so many ways to create an endpoint, its a bit long, you might just write your whole API in one file, but splitting your code into files makes your code:

- readable
- maintainable

## Database connection

Next, we are going to handle database connection in the `db` folder inside the `db.go` file

```go
// Define the package interacting with the database
package db

import (
	"os"
	"time"

	"gopkg.in/mgo.v2"
)

// DBConnection defines the connection structure
type DBConnection struct {
	session *mgo.Session
}

// NewConnection handles connecting to a mongo database
func NewConnection(host string, dbName string) (conn *DBConnection) {
	info := &mgo.DialInfo{
		// Address if its a local db then the value host=localhost
		Addrs: []string{host},
		// Timeout when a failure to connect to db
		Timeout: 60 * time.Second,
		// Database name
		Database: dbName,
		// Database credentials if your db is protected
		Username: os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PWD"),
	}

	session, err := mgo.DialWithInfo(info)

	if err != nil {
		panic(err)
	}

	session.SetMode(mgo.Monotonic, true)
	conn = &DBConnection{session}
	return conn
}

// Use handles connect to a certain collection
func (conn *DBConnection) Use(dbName, tableName string) (collection *mgo.Collection) {
	// This returns method that interacts with a specific collection and table
	return conn.session.DB(dbName).C(tableName)
}

// Close handles closing a database connection
func (conn *DBConnection) Close() {
	// This closes the connection
	conn.session.Close()
	return
}
```

### Create our Models

First of all, we will create a file in the `models` folder containing methods to perform CRUD(Create Read Update Delete) interactions with the database.

We will create `config.go` file to hold a couple of DB global variables

```bash
$ cd models && touch config.go
```

Add this into the file

```go
package models

import (
	"os"

	"github.com/tesh254/golang_todo_api/db"
)

// Mongo server ip -> localhost -> 127.0.0.1 -> 0.0.0.0
var server = os.Getenv("DATABASE")

// Database name
var databaseName = os.Getenv("DATABASE_NAME")

// Create a connection
var dbConnect = db.NewConnection(server, databaseName)
```

Since we are creating an Authentication API we will create a `models/user.go` file.

Let's create the file

```bash
$ cd models && touch user.go
```

Now we add some lines of code into it.

```go
package models

import (
	"gopkg.in/mgo.v2/bson"
)

// User defines user object structure
type User struct {
	ID         bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	Name       string        `json:"name" bson:"name"`
	Email      string        `json:"email" bson:"email"`
	Password   string        `json:"password" bson:"password"`
	IsVerified bool          `json:"is_verified" bson:"is_verified"`
}

// UserModel defines the model structure
type UserModel struct{}

// Signup handles registering a user
func (u *UserModel) Signup(data forms.SignupUserCommand) error {
	// Connect to the user collection
	collection := dbConnect.Use(databaseName, "user")
	// Assign result to error object while saving user
	err := collection.Insert(bson.M{
		"name":        data.Name,
		"email":       data.Email,
		"password":    data.Password,
		// This will come later when adding verification
		"is_verified": false,
	})

	return err
}
```

You might have noticed the `forms.SignupUserCommand` that defines the type of data retrieved from the controller. We have to define the `struct` with the types.

## User Sign up

Let's go ahead and create a file to hold authentication body structs.

```bash
$ cd forms && touch user.go
```

Next we add the `SignupUserCommand` struct

```go
package forms

// SignupUserCommand defines user form struct
type SignupUserCommand struct {
    // binding:"required" ensures that the field is provided
	Name string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
```

We will have to create the user controller to interact with the database via the API requests.

We will do so by creating a new file to hold User authentication controllers `controllers/user.go`.

```bash
$ cd controllers && touch user.go
```

Let's add some code inside the file

```go
package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/tesh254/golang_todo_api/forms"
	"github.com/tesh254/golang_todo_api/models"
)

// Import the userModel from the models
var userModel = new(models.UserModel)

// UserController defines the user controller methods
type UserController struct{}

// Signup controller handles registering a user
func (u *UserController) Signup(c *gin.Context) {
	var data forms.SignupUserCommand

	// Bind the data from the request body to the SignupUserCommand Struct
	// Also check if all fields are provided
	if c.BindJSON(&data) != nil {
		// specified response
		c.JSON(406, gin.H{"message": "Provide relevant fields"})
		// abort the request
		c.Abort()
		// return nothing
		return
	}

	/*
		You can add your validation logic
		here such as email

		if regexMethodChecker(data.Email) {
			c.JSON(400, gin.H{"message": "Email is invalid"})
			c.Abort()
			return
		}
	*/

	err := userModel.Signup(data)

	// Check if there was an error when saving user
	if err != nil {
		c.JSON(400, gin.H{"message": "Problem creating an account"})
		c.Abort()
		return
	}

	c.JSON(201, gin.H{"message": "New user account registered"})
}
```

Now that we have a signup controller let's tie it to an endpoint. Go back to `app.go` and add a signup controller.

```go
...

// Define the user controller
user := new(controllers.UserController)
// Create the signup endpoint
v1.POST("/signup", user.Signup)

```

Let's create a `.env` file to hold our environment variables

```bash
$ touch .env
```

Add this to the file

```text
export DATABASE=localhost
export DATABASE_NAME=golangtodoapi
```

If `godotenv` library does not work with the .env file create a `Makefile` to export your variables and run your app. This will make it easier to run your app instead of type two commands each time while you could with one.

```makefile
run:
	@echo ":::: App is startin up ::::"
	@echo "CONFIG::  😁 Exporting environemnt variables"
	# This might vary depending on your unix os
    # some might use source by default
	/bin/sh .env
	@echo "SUCCESS:  ✔ Environment variables exported"
	@echo "INIT::::  ⚡ Running server"
	go run app.go
```

Before you run the server ensure you have a MongoDB instance running. Follow this [link](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/) to install the MongoDB community version on your computer based on your operating system.

Run your server

```bash
$ go run app.go
```

Let's try to add a new user

```bash
$ curl -d '{"name": "Erick Wachira", "email": "ewachira254@gmail.com", "password": "Wachira254"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/v1/signup
```

Your response should be something similar

```json
{ "message": "New user account registered" }
```

If you go and check the user's collection contents using a GUI/Mongo cli. The document we just saved has the password saved in plain text. Well, we both know that it is not secure. We can fix that by using the `bcrypt` library.

We need to first install it before we start coding.

```bash
$ go get golang.org/x/crypto/bcrypt
```

After installing the library we need to create a helpers package to house helping functions for our API, this will include our password hasher and compare.

```bash
$ cd helpers && touch bcrypt.go
```

Let us add a few lines to the file.

```go
package helpers

// Allows us to hash and compare passwords
import "golang.org/x/crypto/bcrypt"

// GeneratePasswordHash handles generating password hash
// bcrypt hashes password of type byte
func GeneratePasswordHash(password []byte) string {
	// default cost is 10
	hashedPassword, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)

	// If there was an error panic
	if err != nil {
		panic(err)
	}

	// return stringified password
	return string(hashedPassword)
}

// PasswordCompare handles password hash compare
func PasswordCompare(password []byte, hashedPassword []byte) error {
	err := bcrypt.CompareHashAndPassword(hashedPassword, password)

	return err
}

```

Let's update the user model function to save a hashed password.

```go
...
err := collection.Insert(bson.M{
    "name":     data.Name,
    "email":    data.Email,
    "password": helpers.GeneratePasswordHash([]byte(data.Password)),
    // This will come later when adding verification
    "is_verified": false,
})
...
```

Let's try that again, kill and then run your server, then send a signup request again.

Now with our Makefile defined your will running your app with this command

```bash
$ make run
```

The account will be created with a hashed password, you can confirm by checking the document saved.

Now we have another problem, an account is being created with the same this will cause conflicts if the app will ever be deployed to production. We will have to fix that.

We can do so by introducing a method that finds a user with an email. We will use the result to validate if the user exists or not. Let's jump into that.

Go to the `models/user.go` file to add the method.

```go
...
// GetUserByEmail handles fetching user by email
func (u *UserModel) GetUserByEmail(email string) (user User, err error) {
	// Connect to the user collection
	collection := dbConnect.Use(databaseName, "user")
	// Assign result to error object while saving user
	err = collection.Find(bson.M{"email": email}).One(&user)
	return user, err
}
...
```

Let's modify the Signup controller to add a new condition

```go
...
result, _ := userModel.GetUserByEmail(data.Email)

// If there happens to be a result respond with a
// descriptive mesage
if result.Email != "" {
    c.JSON(403, gin.H{"message": "Email is already in use"})
    c.Abort()
    return
}
...
```

You user's controller file should look like this

```go
package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/tesh254/golang_todo_api/forms"
	"github.com/tesh254/golang_todo_api/models"
)

// Import the userModel from the models
var userModel = new(models.UserModel)

// UserController defines the user controller methods
type UserController struct{}

// Signup controller handles registering a user
func (u *UserController) Signup(c *gin.Context) {
	var data forms.SignupUserCommand

	// Bind the data from the request body to the SignupUserCommand Struct
	// Also check if all fields are provided
	if c.BindJSON(&data) != nil {
		// specified response
		c.JSON(406, gin.H{"message": "Provide relevant fields"})
		// abort the request
		c.Abort()
		// return nothing
		return
	}

	/*
		You can add your validation logic
		here such as email

		if regexMethodChecker(data.Email) {
			c.JSON(400, gin.H{"message": "Email is invalid"})
			c.Abort()
			return
		}
	*/
	result, _ := userModel.GetUserByEmail(data.Email)

	// If there happens to be a result respond with a
	// descriptive mesage
	if result.Email != "" {
		c.JSON(403, gin.H{"message": "Email is already in use"})
		c.Abort()
		return
	}

	err := userModel.Signup(data)

	// Check if there was an error when saving user
	if err != nil {
		c.JSON(400, gin.H{"message": "Problem creating an account"})
		c.Abort()
		return
	}

	c.JSON(201, gin.H{"message": "New user account registered"})
}
```

Without deleting any document from the user's collection, try the request again.

You should get this response

```json
{ "message": "Email is already in use" }
```

<br>

## User Login

We have gotten this far and have a solid user sign up endpoint we can now create a login endpoint. There are different ways to authenticate a user this include:

- Sessions
- JWT way

We are going to use the JWT(JSON Web Token) way. It has its advantages over sessions, these are:

- No Session to Manage (stateless): The JWT is a self-contained token that has authentication information, expire time information, and other user-defined claims digitally signed.

- Portable: A single token can be used with multiple backends.

- No Cookies Required, So It's Very Mobile Friendly

- Good Performance: It reduces the network round trip time.

- Decoupled/Decentralized: The token can be generated anywhere. Authentication can happen on the resource server or easily separated into its own server.

To achieve JWT authentication we need to install a JWT library to generate and verify our tokens.

```bash
$ go get github.com/dgrijalva/jwt-go
```

`jwt-go` library is a great and simple library that will help us achieve this.

Let's create a file inside the `services` folder with the `jwt.go` file to hold our jwt methods.

```go
package services

import (
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte(os.Getenv("SECRET_KEY"))

// Claims defines jwt claims
type Claims struct {
	UserID string `json:"email"`
	jwt.StandardClaims
}

// GenerateToken handles generation of a jwt code
// @returns string -> token and error -> err
func GenerateToken(userID string) (string, error) {
	// Define token expiration time
	expirationTime := time.Now().Add(1440 * time.Minute)
	// Define the payload and exp time
	claims := &Claims{
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// Generate token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign token with secret key encoding
	tokenString, err := token.SignedString(jwtKey)

	return tokenString, err
}

// DecodeToken handles decoding a jwt token
func DecodeToken(tkStr string) (string, error) {
	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(tkStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			return "", err
		}
		return "", err
	}

	if !tkn.Valid {
		return "", err
	}

	return claims.UserID, nil
}
```

We won't have to create a `Login` user model method we can utilize the `GetUserByEmail`, following the DRY(Don't Repeat Yourself) rule. We need to add a `LoginUserCommand` to define the request body types. Go to `forms/user.go` file and add these lines of code

```go
...
// LoginUserCommand defines user login form struct
type LoginUserCommand struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
...
```

Your `forms/user.go` file should look like the code below

```go
package forms

// SignupUserCommand defines user form struct
type SignupUserCommand struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginUserCommand defines user login form struct
type LoginUserCommand struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
```

Next, we create a `Login` method controller.

```go
...
// Login allows a user to login a user and get
// access token
func (u *UserController) Login(c *gin.Context) {
	var data forms.LoginUserCommand

	// Bind the request body data to var data and check if all details are provided
	if c.BindJSON(&data) != nil {
		c.JSON(406, gin.H{"message": "Provide required details"})
		c.Abort()
		return
	}

	result, err := userModel.GetUserByEmail(data.Email)

	if result.Email == "" {
		c.JSON(404, gin.H{"message": "User account was not found"})
		c.Abort()
		return
	}

	if err != nil {
		c.JSON(400, gin.H{"message": "Problem logging into your account"})
		c.Abort()
		return
	}

	// Get the hashed password from the saved document
	hashedPassword := []byte(result.Password)
	// Get the password provided in the request.body
	password := []byte(data.Password)

	err = helpers.PasswordCompare(password, hashedPassword)

	if err != nil {
		c.JSON(403, gin.H{"message": "Invalid user credentials"})
		c.Abort()
		return
	}

	jwtToken, err2 := services.GenerateToken(data.Email)

	// If we fail to generate token for access
	if err2 != nil {
		c.JSON(403, gin.H{"message": "There was a problem logging you in, try again later"})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"message": "Log in success", "token": jwtToken})
}
...
```

Your `controllers/user.go` should look something similar to this

```go
package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/tesh254/golang_todo_api/forms"
	"github.com/tesh254/golang_todo_api/helpers"
	"github.com/tesh254/golang_todo_api/models"
	"github.com/tesh254/golang_todo_api/services"
)

// Import the userModel from the models
var userModel = new(models.UserModel)

// UserController defines the user controller methods
type UserController struct{}

// Signup controller handles registering a user
func (u *UserController) Signup(c *gin.Context) {
	var data forms.SignupUserCommand

	// Bind the data from the request body to the SignupUserCommand Struct
	// Also check if all fields are provided
	if c.BindJSON(&data) != nil {
		// specified response
		c.JSON(406, gin.H{"message": "Provide relevant fields"})
		// abort the request
		c.Abort()
		// return nothing
		return
	}

	/*
		You can add your validation logic
		here such as email

		if regexMethodChecker(data.Email) {
			c.JSON(400, gin.H{"message": "Email is invalid"})
			c.Abort()
			return
		}
	*/
	result, _ := userModel.GetUserByEmail(data.Email)

	// If there happens to be a result respond with a
	// descriptive mesage
	if result.Email != "" {
		c.JSON(403, gin.H{"message": "Email is already in use"})
		c.Abort()
		return
	}

	err := userModel.Signup(data)

	// Check if there was an error when saving user
	if err != nil {
		c.JSON(400, gin.H{"message": "Problem creating an account"})
		c.Abort()
		return
	}

	c.JSON(201, gin.H{"message": "New user account registered"})
}

// Login allows a user to login a user and get
// access token
func (u *UserController) Login(c *gin.Context) {
	var data forms.LoginUserCommand

	// Bind the request body data to var data and check if all details are provided
	if c.BindJSON(&data) != nil {
		c.JSON(406, gin.H{"message": "Provide required details"})
		c.Abort()
		return
	}

	result, err := userModel.GetUserByEmail(data.Email)

	if result.Email == "" {
		c.JSON(404, gin.H{"message": "User account was not found"})
		c.Abort()
		return
	}

	if err != nil {
		c.JSON(400, gin.H{"message": "Problem logging into your account"})
		c.Abort()
		return
	}

	// Get the hashed password from the saved document
	hashedPassword := []byte(result.Password)
	// Get the password provided in the request.body
	password := []byte(data.Password)

	err = helpers.PasswordCompare(password, hashedPassword)

	if err != nil {
		c.JSON(403, gin.H{"message": "Invalid user credentials"})
		c.Abort()
		return
	}

	jwtToken, err2 := services.GenerateToken(data.Email)

	// If we fail to generate token for access
	if err2 != nil {
		c.JSON(403, gin.H{"message": "There was a problem logging you in, try again later"})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"message": "Log in success", "token": jwtToken})
}
```

Next, we will have to create a login endpoint to call the `Login` method controller.

```go
...
// Create the login endpoint
v1.POST("/login", user.Login)
...
```

We will have to add a new variable to the `.env` file, the `SECRET_KEY`that will be used to protect our JWT tokens.

```bash
...
export const SECRET_KEY=#53cR3Tk3y
...

```

Let's run our app and test out our endpoint

```bash
$ make run
```

```sh
curl -d '{"email": "ewachira254@gmail.com", "password": "Wachira254"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/v1/login
```

Your response should be something similar

```json
{
  "message": "Log in success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV3YWNoaXJhMjU0QGdtYWlsLmNvbSIsImV4cCI6MTU4MTIwNzE2Nn0.XXaDB0R9UJ7aKLQxyDDjIdj1WMNN_bP5Ez9um6_T-SU"
}
```

## Extras

- Repo [link](https://github.com/werickblog/golang_todo_api)

- Join Discord Server for any questions [link](https://discord.gg/nVQJRma)
- Follow me on Twitter [link](https://twitter.com/wachira_dev)

## Next

In the next part of this series, we will be able to send out password reset and verification emails. We will also deploy the API to Heroku on the final part of the series.
