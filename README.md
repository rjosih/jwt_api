# jwt_api
api made with hateoas links and jwt authentication

## Explain and defend the implementation of HATEOAS in the solution.
I've implemented HATEOAS as in doing clickable links so the user can navigate around in the API without extra documentation. The links are displayed with the link, the type of the request and a small desciption about what's happening at the link. The HATEOAS links are represented in the GET and POST requests.

## If the solution should implement multiple representations of the resources. How would you do it?
The current solution is to add attributes in a JSON-object which won't work in the long run.
I would maybe let the user send an accept header to the API that response the representation in the accept header. 

## Motivate and defend the authentication solution.
I used json web token (jwt) as authentication because it's widely used and easy to work with since it's stateless. However it is a really good way of securely transmitting information between different parties since it can be signed. That means that the sender can prove that they are the real sender of the information / data. The structure of the jwt is able to let you verify that the content hasn't been tampered with. 

## What other authentication solutions could you implement?
* HTTP Basic Authentication
* API key authentication
* Oauth authentication
* 2nd party authentication
* etc...

## What pros/cons do this solution have?

### Pros
* Stateless
* Widely used
* JSON based 
* Relies on generated tokens with expiration date

### Cons
* Easy to decrypt 
* If the secret key is leaked out, sensitive information can be leaked

## How the webhook works.
Since this is your first own web API, there are probably things you would solve in another way, looking back at this assignment. Write your thoughts about this.

My webhook is triggered when a new item has been created. 

* Firstly, you visit the POST `/webhook`
* Then go to POST `/api/all` if you want to popylate the database or POST `/api/new`. 
* When an item is created, GET `/webhook` to see all items that has been registered.

To improve my api: I would like to have more validation and error handling when it comes to wrong inputs and unauthorized users. Also I would like to get rid of the redudancy in the code. 

However I'm quite satisfied how the API works and I think it is quite easy to understand it, thanks a lot to the HATEOAS links. 

## Extra functionalities? 
Yes hardcoded two users: 
* John - admin guy 
* Anna - member 

If you have John's credentials you'll have full access to all the endpoint while a regular member only can show all the items and getById.
### Features for this functionality
Put the members pool in the db and hash/salt/bcrypt/secure the password. 


## Getting Started
* `npm i`
* `node server`
* Import the collection to Postman. 
* Go to request `Login` --> Body --> Raw > JSON and paste either the admin's or member's credentials:
### Admin
`{
    "username": "john",
    "password": "password123admin"
}`

### Member

`{
    "username": "anna",
    "password": "password123member"
}`


![PictureOfToken](https://i.imgur.com/F5YHrec.png)
* Copy the `accessToken`. 
* Go to whatever endpoint you like --> Header, choose write `Authorization` as key and `Bearer + accessToken` in value field and hit send.
![PictureOfAcceptedToken](https://i.imgur.com/Hd80eFe.png)
* Go to  --> GET `/api/all` and to populate data in the database.
* Depending which user you are authenticated with you'll be forbidden or let through.

### Update and create 
If you don't define a new item the api will automatically generate a standard object.
` 
  name: 'standardturkey',
  category: 'standardmeat',
  price: 400
`

If you want to create an own / change an already existing item do following:
Body --> Raw --> JSON and copying following syntax and fill with whatever you want:
`{
  "name": "carrots",
	"category": "veggies",
	"price": 65
  }`

## Test API
Tests are availble and provided in the Postman collection.
`web_api_heroku.postman_collection.json` is for the public url.

## Endpoints
* POST `/login` - Login
* GET `/api/all` - Get all items 
* POST `/api/new` - Create new item
* GET `/api/:id` - Get item by id 
* DEL`/api/:id` - Delete item by id 
* PUT `/api/:id` - Update item by id 
* GET `/webhook` - Get webhook
* POST `/webhook` - Create webhook

## Features 
As earlier mentioned: secure and create a real working user-system. Also generate a new token when the old expires, therefore it's a refreshed token that isn't in use for the moment. 


