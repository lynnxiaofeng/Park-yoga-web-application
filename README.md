# Yoga Course API (Express App)

Written by Xiaofeng Lin for Assignment02 of unit IFN666 Web and Mobile Application Development. This App is developed to post yoga courses in park for users to join who are interested in joining closeby their location. 

Please check out the demo vdo for the fron end demonstration
## Purpose

The **Yoga Course API** is a backend service built using **Express.js** that enables users to manage yoga courses, authenticate users, and book courses. It supports creating, updating, deleting, and retrieving yoga courses by amdin, as well as creating, updating bookings for available courses. This API is designed to provide a secure and efficient backend for a course management application.

## To run my server
because the project is put in start up, so to avoid the token issues, please run 
sudo systemctl stop ifn666-startup@yogacourse
then run
node server.js

## API Endpoints

### **User Management**
- `POST /users/register` – Register a new user.
- `POST /users/login` – Login an existing user.
- `GET /users` – Retrieve all users.                (restricted by amdin only)
- `GET /users/:id` – Retrieve a user by ID.         (only logined user can read their own profile)
- `PUT /users/:id` – Update a user by ID.           (only logined user can udpate their own profile)
- `DELETE /users/:id` – Delete a user by ID.        (only logined user can delete their own profile)

### **Course Management**
- `POST /courses` – Create a new course.            (restricted by amdin only)
- `GET /courses` – Retrieve all courses.            
- `GET /courses/:id` – Retrieve a course by ID.     
- `PUT /courses/:id`– Update a course by ID.        (restricted by amdin only)
- `DELETE /courses/:id` – Delete a course by ID.​    (restricted by amdin only)   

### **Booking Management**
- `POST /bookings` – Create a new booking.                  (only logined user)
- `GET /bookings` – Retrieve all bookings.                  (restricted by amdin only)
- `GET /bookings/:id` – Retrieve a booking by *Course ID*.  (logined user can only get their own bookings)
- `PUT /bookings/:id` – Update a booking by ID.             (logined user can only update their own bookings)
- `DELETE /bookings/:id` – Delete a booking by ID.          (restricted by amdin only)

without restriction remarks, it indicates that all users are able to access. 

## How to Contribute
We welcome contributions to the development of the Task Manager API. Here's how you can contribute:

1. **Fork** the repository and clone it to your local machine.
2. **Create a new branch** for your feature or bug fix.
3. Make your changes and **commit** them with clear, descriptive commit messages.
4. **Push** your changes to your forked repository.
5. Submit a **Pull Request (PR)** to the main repository.

Please ensure that your contributions follow the existing code style, include appropriate tests, and are well-documented.


## Features
- **User Authentication:** Allows users to register, log in, and authenticate using JWT tokens.
- **Admins course Management:** Supports admin CRUD operations (Create, Read, Update, Delete) for courses.
- **Admins booking Management:**  Supports admin Read all bookings.
- **User booking Management:** Support users to Create, Update for their course bookings.
- **User course Reading:** Support users to retrieve all courses. 
- **Role access control:** Admins and public users are authorized differently on course and booking operations. Admins mostly manage the courses, and users are mostly making their own bookings. 
- **Rate Limiting:** Protects the API from abuse by limiting the number of requests. It's applied in user making new bookings and update their booking status. They are restricted make 3 booking requests(creating or updating) per 15minutes. (number 3 can be more reasonable in reality as this application, 3 is just for demonstration)
- **Error Handling:** Provides clear error messages for invalid requests.
- **Input Validation:** It's applied in creating the courses and bookings. Where the courseValidator and bookingValidator are defined to restrict the input validation. 
- **Query filtering:** Apply in listing all courses. If users want to see courses in specific location suburb area, it helps user to precisely navigated to their suburbs.   

## Dependencies

The **Yoga Course API** has the following dependencies, listed in the `package.json` file:

- **bcryptjs**: For hashing and verifying user passwords during authentication.
- **dotenv**: For managing environment variables securely.
- **express**: The web framework used to handle HTTP requests and routing.
- **express-async-handler**: For simplifying error handling in asynchronous Express routes by automatically catching exceptions and forwarding them to Express's error-handling middleware .
- **express-rate-limit**: For rate-limiting incoming requests to prevent abuse.
- **express-validator**: For providing validation and sanitization of request data .
- **mongoose**: MongoDB Object Data Modeling (ODM) library used to interact with the database.
- **jsonwebtoken**: For creating and validating JWT tokens for user authentication.
- **mongoose**: MongoDB Object Data Modeling (ODM) library used to interact with the database.

To install these dependencies, you can simply run `npm install` in the root directory of the project(cd server). or use the command below:
`npm install bcryptjs dotenv express express-async-handler express-rate-limit express-validator mongoose jsonwebtoken`

### **Frontend (Vite + React)**
1. **React**: Frontend framework for building the UI.
2. **Vite**: Build tool and dev server for React.
3. **Mantine**: A library of components
To install these dependencies, you can simply run `npm install` in the root directory of the project
(cd client, cd yogacourse).
and install related packages in each pages if it's required. such as npm install @mantine/core @mantine/hooks

In a summary, to install dependencies:
```bash
# Backend
cd server
npm install

# Frontend
cd client
cd yogacourse
npm install
```

## Application Architecture

The **Yoga Course API** is a **RESTful backend application** developed with following architecure structures:

- **Express.js** framework handles HTTP requests, routes, and middleware to control the flow of data.
- **MongoDB** is used as the database for storing user, course and booking information, accessed through **Mongoose**.
- **JWT Authentication** is used to secure API endpoints. Users must log in to receive a JWT token, which is required to access protected routes.
- The API includes rate limiting through **express-rate-limit** to protect against brute-force attacks or excessive use.
- The application is divided into modules, such as **controllers** for managing business logic, **models** for interacting with the database, **middleware** for tasks like authentication, role based access control and limiting some numerous requests, **routes** for handling users requests and response through server efficiently.

### Folder Structure:

```
server.js        # entry point of the application, listening to port 4000
/src 

   /controllers     # Controller files handling business logic for user, course and booking management
      booking.js  course.js  user.js
   /models          # Mongoose models for the user, course, and booking
      booking.js  course.js  user.js
   /routes          # API route definitions for user and course endpoints
      booking.js  course.js  index.js  user.js
   /middleware      # Middlewares for authentication, rate limiting and role based access control
      authenticateWithJwt.js  bookingLimiter.js  isAdmin.js
API-collection.json # some pre-registered courses, users and bookings testing in hoppscotch.

```

## How to Report Issues

To report an issue with the **Yoga Course API**, follow these steps:

1. **Check the Issues page** on GitHub to see if the issue has already been reported.
2. If it hasn't been reported, create a new issue with the following information:
   - **Description of the issue**.
   - **Steps to reproduce** the issue.
   - **Expected behavior** and **actual behavior**.
   - Any relevant **error logs** or **screenshot**.
3. We will review your issue and respond as soon as possible.

