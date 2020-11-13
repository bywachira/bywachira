---
title: "Create API with Gin in Golang Part 2"
description: "Create a RESTful API with Golang"
slug: "create-golang-api-with-gin-and-mongo-2"
date: "2020-05-29"
draft: false
menu: "golang"
tags: ["golang", "gin", "mongo", "env", "sendgrid", "mgo.v2"]
hero_image: "https://res.cloudinary.com/duoxba7n1/image/upload/v1597854496/blog/Create-API-with-Gin-Part-1.png"
author:
  twitter: "wachira_dev"
  name: "Erick Wachira"
series_label: "Create Golang API with Gin and Mongo"
series: true
---

Well it has been a while since I last wrote an article, so you know what I did to get motivated I revamped my blog or should I say I just added a dark theme.

This blog is the continuation of the [first part](https://blog.bywachira.com/post/create-golang-api-with-gin-and-mongo-1) where we create a working Golang API powered with a Mongo database. Before you get started on this article ensure you read [it](https://blog.bywachira.com/post/create-golang-api-with-gin-and-mongo-1), if not here is the

# TL;DR

- We handle basic user authentication nothing more nothing less

In this part we will focus on this:

- User account verification through email
- Password reset and request through email
- Refresh Token endpoint

I plan on having 3 other parts which will focus on key things as higlighted below:

- Part 3

  - Create the bookmarker endpoints
    > I wanted to build a TODO API but I think it's kind off cliche so I decided to work on a bookmarker API, will allow users to save links to websites they liked and even save metadata by preloading them and saving meta tag details.
        - Ability to create a bookmark
        - Preload link meta details and save them to the collection
        - Ability to fetch all bookmarks
        - Ability to delete a bookmark

- Part 4
  - Testing the authentication endpoints
  - Adding session blacklisting(stop users from reusing )
  - Host the project to heroku

- Part 5
  - Outline how you can improve on this API
  - How many products you can build from this API

# Introduction


## Prerequisites

You must a know the basics of Golang and a tiny bit of Gin

# Getting started

![Let's go](https://media.giphy.com/media/S5yqNNTQlEZfqQ7InC/giphy.gif)

## Goals

- A user should be able to verify their account
- A user should be able to reset their account password
- A user should be able to refresh token

## Setup

Clone the project

```bash
# SSH
$ git clone git@github.com:werickblog/golang_todo_api.git

# HTTP
$ git clone https://github.com/werickblog/golang_todo_api.git
```

Ensure the project lies in your set `$GOPATH/src` directory

Next, open the project with your favorite editor and run the app

```bash
$ go run app.go
```

This will automatically install all packages missing.

## Let's hack

![lets hack](https://media.giphy.com/media/YQitE4YNQNahy/giphy.gif)

### Password Reset and Request

We are going to start of with the password request and reset controller.

So open the `controllers/user.go` and create a `ResetLink` method of the `UserController` struct.

```go

// ...
// ResetLink handles resending email to user to reset link
func (u *UserController) ResetLink(c *gin.Context) {
    // Defined schema for the request body
	var data forms.ResendCommand

    // Ensure the user provides all values from the request.body
	if (c.BindJSON(&data)) != nil {
        // Return 400 status if they don't provide the email
		c.JSON(400, gin.H{"message": "Provided all fields"})
		c.Abort()
		return
	}

    // Fetch the account from the database based on the email
    // provided
	result, err := userModel.GetUserByEmail(data.Email)

    // Return 404 status if an account was not found
	if result.Email == "" {
		c.JSON(404, gin.H{"message": "User account was not found"})
		c.Abort()
		return
    }

    // Return 500 status if something went wrong while fetching
    // account
	if err != nil {
		c.JSON(500, gin.H{"message": "Something wrong happened, try again later"})
		c.Abort()
		return
	}

    // Generate the token that will be used to reset the password
	resetToken, _ := services.GenerateNonAuthToken(result.Email)

    // The link to be clicked in order to perform a password reset
    link := "http://localhost:5000/api/v1/password-reset?reset_token=" + resetToken
    // Define the body of the email
	body := "Here is your reset <a href='" + link + "'>link</a>"
	html := "<strong>" + body + "</strong>"

    // Initialize email sendout
	email := services.SendMail("Reset Password", body, result.Email, html, result.Name)

    // If email was sent, return 200 status code
	if email == true {
		c.JSON(200, gin.H{"messsage": "Check mail"})
		c.Abort()
        return
    // Return 500 status when something wrong happened
	} else {
		c.JSON(500, gin.H{"message": "An issue occured sending you an email"})
		c.Abort()
		return
	}
}
// ...
```

The above is the password reset link request, if you run your app, it will fail because we haven't defined certain methods/variables/struct. These are:

- The request body defined schema in the `forms`
- Generate token for password request
- Send email out

So let's touch on defining the request body schema, first

#### Password Reset Request Schema

Open `forms/user.go` file and add the lines below

```go
// ..
// ResendCommand defines resend email payload
type ResendCommand struct {
    // We only need the email to initialize an email sendout
	Email string `json:"email" binding:"required"`
}
// ...
```

On to the next one

#### Generation of the Token

We don't want our users to use the token they get from logging in, to initialize a reset password due to security reasons, so we will have to create a new method to create non auth tokens and one to decode them. Let's jump into it

![jump](https://media.giphy.com/media/3bzBs5iaHaOPKx8NmM/giphy.gif)

Open `services/jwt.go` and add the following the methods

```go
// ...

// Define its own secret key
var anotherJwtKey = []byte(os.Getenv("ANOTHER_SECRET_KEY"))

// GenerateNonAuthToken handles generation of a jwt code
// @returns string -> token and error -> err
func GenerateNonAuthToken(userID string) (string, error) {
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
	tokenString, err := token.SignedString(anotherJwtKey)

	return tokenString, err
}

// DecodeNonAuthToken handles decoding a jwt token
func DecodeNonAuthToken(tkStr string) (string, error) {
	claims := &Claims{}

    // Decode token based on parameters provided, if it fails throw err
	tkn, err := jwt.ParseWithClaims(tkStr, claims, func(token *jwt.Token) (interface{}, error) {
		return anotherJwtKey, nil
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

    // Return encoded email
	return claims.UserID, nil
}
// ...
```

#### Handle Email sendout

I chose the **Sendgrid** email service because it is easier to create an account(😂 no credit card required) also setting up your own custom email domain is optional (means you can use your Gmail account).

Thank you Sendgrid

Create a [Sendgrid](https://app.sendgrid.com/) account and generate an API key with permissions to send out emails.

Next we will install a Sendgrid's Go SDK that will ease the process of sending out emails

```bash
$ go get github.com/sendgrid/sendgrid-go
```

Create a new file to hold our method to send emails. We will also make it reusable, (DRY code, )

Add the following lines of code

```go
// Define the package
package services

// Import relevant dependecy
import (
	"fmt"
	"os"

    // Import Sendgrid Go library
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// EmailObject defines email payload data
type EmailObject struct {
	To      string
	Body    string
	Subject string
}


// SendMail method to send email to user
func SendMail(subject string, body string, to string, html string, name string) bool {
	fmt.Println(os.Getenv("SENDGRID_API_KEY"))

    // The first parameter is how your email name will be
	from := mail.NewEmail("Just Open it", os.Getenv("SENDGRID_FROM_MAIL"))
	// The recipient
	_to := mail.NewEmail(name, to)
	// Body in plain text
	plainTextContent := body
	// Body in html form(You can style a html document convert to string and make it look like the morning brew newsletter)
	htmlContent := html
	// Create message
	message := mail.NewSingleEmail(from, subject, _to, plainTextContent, htmlContent)
	// initialize client
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
	_, err := client.Send(message)
	if err != nil {
		return false
	} else {
		return true
	}
}
```

#### Password reset request

Head over to `controllers/user.go` and let's add the password reset request.

Define the password reset controller method

```go
// ResetLink handles resending email to user to reset link
func (u *UserController) ResetLink(c *gin.Context) {
	var data forms.ResendCommand

	// Ensure they provide all request body values
	if (c.BindJSON(&data)) != nil {
		c.JSON(400, gin.H{"message": "Provided all fields"})
		c.Abort()
		return
	}

	// Fetch the user in the database
	result, err := userModel.GetUserByEmail(data.Email)

	// If the user doesn't exist return 404 status code
	if result.Email == "" {
		c.JSON(404, gin.H{"message": "User account was not found"})
		c.Abort()
		return
	}

	// Something went wrong while fetching
	if err != nil {
		c.JSON(500, gin.H{"message": "Something wrong happened, try again later"})
		c.Abort()
		return
	}

	// Generate reset token to be used
	resetToken, _ := services.GenerateNonAuthToken(result.Email)

	// Define the email body
	link := "http://localhost:5000/api/v1/password-reset?reset_token=" + resetToken
	body := "Here is your reset <a href='" + link + "'>link</a>"
	html := "<strong>" + body + "</strong>"

	// Send the email
	email := services.SendMail("Reset Password", body, result.Email, html, result.Name)

	// If email is sent then return 200 HTTP status code
	if email == true {
		c.JSON(200, gin.H{"messsage": "Check mail"})
		c.Abort()
		return
	} else {
		// Else tell them something went down
		c.JSON(500, gin.H{"message": "An issue occured sending you an email"})
		c.Abort()
		return
	}
}
```

Next we need to define the endpoint that will initialize the request.

Head over to `app.go` and add this lines

```go
// Send reset link
v1.PUT("/reset-link", user.ResetLink)
```

#### Password reset change

Next we have to add new controller to handle password change based on the user gotten from decoding the token from the url.

Let's jump into it

Head over to the `controllers/user.go` and lets add out controllers.

```go
// PasswordReset handles user password request
func (u *UserController) PasswordReset(c *gin.Context) {
	var data forms.PasswordResetCommand

	// Ensure they provide data based on the schema
	if c.BindJSON(&data) != nil {
		c.JSON(406, gin.H{"message": "Provide relevant fields"})
		c.Abort()
		return
	}

	// Ensures that the password provided matches the confirm
	if data.Password != data.Confirm {
		c.JSON(400, gin.H{"message": "Passwords do not match"})
		c.Abort()
		return
	}

	// Get token from link query sent to your email
	resetToken, _ := c.GetQuery("reset_token")

	// Decode the token
	userID, _ := services.DecodeNonAuthToken(resetToken)

	// Fetch the user
	result, err := userModel.GetUserByEmail(userID)

	if err != nil {
		// Return response when we get an error while fetching user
		c.JSON(500, gin.H{"message": "Something wrong happened, try again later"})
		c.Abort()
		return
	}
	// Check if account exists
	if result.Email == "" {
		c.JSON(404, gin.H{"message": "User accoun was not found"})
		c.Abort()
		return
	}

	// Hash the new password
	newHashedPassword := helpers.GeneratePasswordHash([]byte(data.Password))

	// Update user account
	_err := userModel.UpdateUserPass(userID, newHashedPassword)

	if _err != nil {
		// Return response if we are not able to update user password
		c.JSON(500, gin.H{"message": "Somehting happened while updating your password try again"})
		c.Abort()
		return
	}

	c.JSON(201, gin.H{"message": "Password has been updated, log in"})
	c.Abort()
	return
}
```

Next lets add a new endpoint to initialize the controller above

Head over to `app.go` file and the following lines

```go
// Password reset
v1.PUT("/password-reset", user.PasswordReset)
```

We have successfully handle password reseting for a user account, next we will look into verify an account.

### Account verification

Account verification allows the developer to verify the user of a specific account thus reducing creation of dummy with non-existence emails.

We are going to update the `Signup` controller to handle sending a verification email and add a new controller to handle resending emails and finally a controller to verify a user account.

Head over to `controllers/user.go` and let's edit the `Signup` controller.

```go
// ...

// Generate token to hold users details
resetToken, _ := services.GenerateNonAuthToken(data.Email)

// link to be verify account
link := "http://localhost:5000/api/v1/verify-account?verify_token=" + resetToken
// Define email body
body := "Here is your reset <a href='" + link + "'>link</a>"
html := "<strong>" + body + "</strong>"

// initialize email send out
email := services.SendMail("Verify Account", body, data.Email, html, data.Name)

// If email fails while sending
if !email {
	c.JSON(500, gin.H{"message": "An issue occured sending you an email"})
	c.Abort()
	return
}
// ...
```

Next let's create a resend verification email controller. Still on the same file, add this method

```go
// VerifyLink handles resending email to user to reset link
func (u *UserController) VerifyLink(c *gin.Context) {
	var data forms.ResendCommand

	// Ensure they provide all relevant fields in the request body
	if (c.BindJSON(&data)) != nil {
		c.JSON(400, gin.H{"message": "Provided all fields"})
		c.Abort()
		return
	}

	// Fetch account from database
	result, err := userModel.GetUserByEmail(data.Email)

	// Check if account exist return 404 if not
	if result.Email == "" {
		c.JSON(404, gin.H{"message": "User account was not found"})
		c.Abort()
		return
	}

	if err != nil {
		c.JSON(500, gin.H{"message": "Something wrong happened, try again later"})
		c.Abort()
		return
	}

	// Generate token to hold user details
	resetToken, _ := services.GenerateNonAuthToken(result.Email)

	// Define email body
	link := "http://localhost:5000/api/v1/verify-account?verify_token=" + resetToken
	body := "Here is your reset <a href='" + link + "'>link</a>"
	html := "<strong>" + body + "</strong>"

	// Initialize email sendout
	email := services.SendMail("Verify Account", body, result.Email, html, result.Name)

	// If email send 200 status code
	if email == true {
		c.JSON(200, gin.H{"messsage": "Check mail"})
		c.Abort()
		return
	} else {
		c.JSON(500, gin.H{"message": "An issue occured sending you an email"})
		c.Abort()
		return
	}
}
```

Lets add an endpoint to initialize the above controller, head over to `app.go` and add the following lines.

```go
// Send verify link
v1.PUT("/verify-link", user.VerifyLink)
```

We now have to handle the verification of account controller, let's hope on that. Head over to `controllers/user.go` and add the verify account controller.

```go
// VerifyAccount handles user password request
func (u *UserController) VerifyAccount(c *gin.Context) {
	// Get token from link query
	verifyToken, _ := c.GetQuery("verify_token")

	// Decode verify token
	userID, _ := services.DecodeNonAuthToken(verifyToken)

	// Fetch user based on details from decoded token
	result, err := userModel.GetUserByEmail(userID)

	if err != nil {
		// Return response when we get an error while fetching user
		c.JSON(500, gin.H{"message": "Something wrong happened, try again later"})
		c.Abort()
		return
	}

	if result.Email == "" {
		c.JSON(404, gin.H{"message": "User account was not found"})
		c.Abort()
		return
	}

	// Update user account
	_err := userModel.VerifyAccount(userID)

	if _err != nil {
		// Return response if we are not able to update user password
		c.JSON(500, gin.H{"message": "Something happened while verifying you account, try again"})
		c.Abort()
		return
	}

	c.JSON(201, gin.H{"message": "Account verified, log in"})
}
```

Let's add an endpoint to verify an account

```go
// Verify account
v1.PUT("/verify-account", user.VerifyAccount)
```

We are almost done

![](https://media.giphy.com/media/Jn3fqI2I0m5cB2L8g6/giphy.gif)

We are left with refresh token. A refresh token is basically a token used to refresh user sessions if the access token happens to expire. Read more about it [here](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)

Head over to `controllers/user.go` and lets add our refresh token controller

```go
// RefreshToken handles refresh token
func (u *UserController) RefreshToken(c *gin.Context) {
	// Get refresh token from header
	refreshToken := c.Request.Header["Refreshtoken"]

	// Check if refresh token was provided
	if refreshToken == nil {
		c.JSON(403, gin.H{"message": "No refresh token provided"})
		c.Abort()
		return
	}

	// Decode token to get data
	email, err := services.DecodeRefreshToken(refreshToken[0])

	if err != nil {
		c.JSON(500, gin.H{"message": "Problem refreshing your session"})
		c.Abort()
		return
	}

	// Create new token
	accessToken, _refreshToken, _err := services.GenerateToken(email)

	if _err != nil {
		c.JSON(500, gin.H{"message": "Problem creating new session"})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"message": "Log in success", "token": accessToken, "refresh_token": _refreshToken})
}
```

Now lets add an endpoint in `app.go`

```go
// Refresh token
v1.GET("/refresh", user.RefreshToken)
```

And that's it,

## Summary

- We handled password reset request and change
- We handled account verification
- We handle refresh token

## Extras

- Repo link [here](https://github.com/werickblog/golang_todo_api)
- Follow me on twitter [here](https://twitter.com/wachira_dev)
- Join Discord server for any questions [here](https://discord.gg/uCxDKD8)

![](https://media.giphy.com/media/PhNyx0KawRIGq29UlQ/giphy.gif)
