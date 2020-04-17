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
* When an item is created, GET `/webhook` to see all items that has been registered since the prenumeration.

To improve my api: I would like to have more validation and error handling when it comes to wrong inputs and unauthorized users. Also I would like to get rid of the redudancy in the code. 

However I'm quite satisfied how the API works and I think it is quite easy to understand it, thanks a lot to the HATEOAS links. 

## Extra functionalities? 
No

## Getting Started
* `npm i`
* `node server`
* Import the collection to Postman. 
* Go to request `Login`
* Copy the token. 
* Go to Authorization, choose `Bearer Token` and paste the token in the token table.
* Go to  --> GET `/api/all` and click twice to populate data in the database.

## Test API
Tests are availble and provided in the Postman collection.
