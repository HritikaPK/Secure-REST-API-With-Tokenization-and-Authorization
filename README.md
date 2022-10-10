# Secure-REST-API-With-Tokenization-and-Authorization

Hello there! 

In this repo, I have created a SECURE AUTHORIZED REST API.
Technologies used:
1.	Node JS with Express 
2.	POSTMAN (desktop )
3.	MongoDB ( Local) 
4.	JWT Tokens

The following are the outcomes:
1.	JWT token-based authorization and authentication to use any of the APIs. This is sent in all calls through the header of a request as AUTH_TOKEN.
2.	Token required to fetch, update and delete client information. 
3.	Proper storage of all data in MongoDB locally, where all records are connected using a common id number for smooth referencing. 
4.	Hashed passwords are stored in our database using bcrypt and salts. The database also stores the plain passwords for the demo. 
5.	API to add a new client to the database only if you are an admin or have a referral code (POST)
6.	API to search for the client’s loan status (or any type of status which you could set as per your use case) (GET)
7.	APIs to update the client’s user log or information, only if you are an admin or have a referral code. (PUT)
8.	APIs to delete any client’s data from the database or just their record (Loan status in this case), only if you are an admin or have a referral code. (DELETE)
9.	All HTTP requests are successfully sent through the body of the request using POSTMAN.
