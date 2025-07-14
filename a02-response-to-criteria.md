# IFN666_25se1 Assessment 02 Submission
**Student name:** Xiaofeng Lin
**Student ID:** n11724668

## how to start my server (read before)
    because the project is put in start up, so to avoid the token issues, please run 
    sudo systemctl stop ifn666-startup@yogacourse
    then run
    node server.js

# Response to marking criteria

## (API) Core: Application architecture (1 mark)

- **One line description:** I used a layered architecture of models, routes, controllers, middleware for server. 
- **Video timestamp:** 4:20-5:00
- **Relevant files**
    - server/src
                /controllers
                    booking.js  course.js  user.js
                /middleware
                    authenticateWithJwt.js  bookingLimiter.js  isAdmin.js
                /models
                    booking.js  course.js  user.js
                /routes
                    booking.js  course.js  index.js  user.js
            server.js
    -client/src
                /components
                    /Booking
                        BookingList.jsx
                    /Courses
                        CourseCard.jsx
                        CourseForm.jsx
                /pages
                    About.jsx
                    Bookings.jsx
                    Courses.jsx
                    Home.jsx
                    Layout.jsx
                    Login.jsx
                    Register.jsx
                App.jsx
                main.jsx
            .env
            index.html
            vite.config.js

## (API) Core: Endpoints (2 marks)
- **One line description:** 3 entities (User, Course, Booking), 5 endpoints of each entities (POST, GET by id, GET all, PUT by id, DELETE by id).
- **Video timestamp:** 4:50-6:10
- **Relevant files**
    - server/src/routes
        booking.js  course.js  index.js  user.js

## (API) Core: Data model (3 marks)
- **One line description:**  3 entities (User, Course, Booking)
- **Video timestamp:** 6:10-6:53
- **Relevant files**
    - server/src/models
                    booking.js  course.js  user.js

## (API) Core: Data interface (3 marks)
- **One line description:** Controllers: booking, course, user
- **Video timestamp:** 6:50-7:25
- **Relevant files**
    - server/src/controllers
                booking.js  course.js  user.js

## (API) Core: Deployment to web server (3 marks)
- **One line description:** using Caddy for reverse-proxy and systemd for auto-start. available at n11724668.ifn666.com/assignment2(frontend) and n11724668.ifn666.com/assignment2/api (REST API); systemd launches the server.js node process
- **Video timestamp:** 7:20-7:50
- **Relevant files**
    - Caddyfile

## (API) Core: API testing with Hoppscotch (3 marks)
- **One line description:**used Hoppscotch. every endpoint has sample payloads. used environment variables as baseUrl, used the inherint token. 
- **Video timestamp:** 3:10-4:15
- **Relevant files**
    - API-collection.json

## (API) Additional: Authentication (3 marks)
- **One line description:** implemented using authenticateWithJwt. routes are protected, especially to record the user who logged in.
- **Video timestamp:** 5:15-5:40
- **Relevant files**
    - /server/src/routes/
    - /server/src/middleware/authenicateWithJwt.js
    - /server/src/controllers/user.js
    - /server/src/controllers/course.js
    - /server/src/controllers/booking.js

## (API) Additional: Input validation (3 marks)
- **One line description:** implemented using Express Validator, and applied with function courseValidator() and bookingValidator().
- **Video timestamp:** 00:30-00:45 & 2:20-2:35 & 7:06-7:10
- **Relevant files**
    - /server/src/controllers/course.js
    - /server/src/controllers/booking.js

## (API) Additional: Rate limiting (3 marks)
- **One line description:** While users making new bookings or updating booking status, they are restricted make 10 booking requests per 15minutes. 
- **Video timestamp:** 5:55-6:15
- **Relevant files**
    - /server/src/routes/
    - /server/src/middleware/bookingLimiter.js

## (API) Additional: Query filtering (3 marks)
- **One line description:** endpoint for "get all" courses has filter on "location.suburb"
- **Video timestamp:** 1:30-1:40 & 7:10-7:22
- **Relevant files**
    - /server/src/controllers/course.js

## (API) Additional: Role-based Access Control (3 marks)
- **One line description:** user who has role as admin can access more endpoints such as managing courses and retrieve all bookings.
- **Video timestamp:** 1:58-3:07 & 5:30-5:55
- **Relevant files**
    -/server/src/middleware/isAdmin.js
    -/server/src/routes/


---


## (Client) Core: Application architecture (3 marks)
- **One line description:** 2 main directories: components (courses and bookings) pages
- **Video timestamp:** 7:50-9:10
- **Relevant files**
   - /client/src/pages/ 
            it's for main pages.
   - /client/src/components/ 
            it's for bespoke yogacourses components, including the course card, course list and booking list.
   - /client/src/App.jsx
            it's app entry point
   - /client/.env
            it's connection with backend data. 

## (Client) Core: User interface design (3 marks)
- **One line description:** applied Mantine and vite as the interface framework, including some bespoke components
- **Video timestamp:** 00:00-00:30 & 1:00-3:10
- **Relevant files**
    - /client/src/pages/ for main pages
    - /client/src/components/ for bespoke courses and bookings components

## (Client) Core: React components (3 marks)
- **One line description:** courses components: coursecard, courselsit. bookings component: bookinglist
- **Video timestamp:** 00:00-00:30 & 8:10-8:29
- **Relevant files**
   - /client/src/components/course/coursecard.jsx
   - /client/src/components/course/courseform.jsx
   - /client/src/components/booking/bookinglist.jsx

## (Client) Core: State management (3 marks)
- **One line description:** Many applyings of useState, including adminview, manage bookings, manage courses etc. 
- **Video timestamp:** 9:10-9:30
- **Relevant files**
    - /client/src/pages/courses  
            such as usestate on setCourses to fetch courses, on setAdminMode to handle adminmode for entering editing mdoe, on setEditingCourse to handle editing courses interface, and so on.
    - /client/src/pages/bookings
            such as usestate on setCurrentUser to manage role access control, differetiating admin or normal users.

## (Client) Core: API integration (3 marks)
- **One line description:** applied mostly to fetch the data from REST API routes throughout pages of courses and bookings, as well as managing register and login.
- **Video timestamp:** 8:25-9:10
- **Relevant files**
    - /client/.env 
            setting up the base environment file to connect with backend server
    - /client/src/pages/courses.jsx
            integrate the route to GET courses
    - /client/src/pages/bookings.jsx
            integrate the route to GET/PUT/POST/DELETE bookings
    - /client/src/components/course/courseform.jsx
            integrate the route to PUT/POST/DELETE courses
    - /client/src/pages/register
            integrate the routes of users
    - /client/src/pages/login
            integrate the routes of users

## (Client) Additional: Authentication (3 marks)
- **One line description:** use JWT token to all users login and save user details in token especially is_admin to authenticate and role control access.
- **Video timestamp:**00:30-00:60 
- **Relevant files**
    - /client/src/pages/Login.jsx
            Use localStorage to store the token and user details when user log in to achieve the authentication. the user.is_admin props store the admin role lable for using the methods in courses and booking. It links with the backend middleware isAdmin. 
    
## (Client) Additional: Input validation (3 marks)
- **One line description:** There are multiple input validation applied, incuding Registration email format, password(not less than 3), and course location link must be a url, or else there will be a message to remind the validate input.
- **Video timestamp:** 00:30-00:45 & 2:20-2:35 
- **Relevant files**
    - /client/src/pages/register.jsx
            Validate email format and password length
    - /client/src/components/course/courseform.jsx
            Validate the course details when create or edit the course as an admin. a good example is that if the course location link is not a link, a message: 'the location link must be a valide url' message will pop out.In addition, all input are filled with placeholder texts to remind user what information and format is expected there. 
    
## (Client) Additional: Rate limiting (3 marks)
- **One line description:** Limit each user to make max 3 booking requests in 15 mins to avoid someone maliciously damage or making unshowup orders. (3 is just set for demonstrating easier, reasonable number for the applciation should be around 10).
- **Video timestamp:** 1:10-1:30 & 2:43-2:55
- **Relevant files**
    - /client/src/pages/bookings.jsx
            There will be alert to warn user 'Too many booking requests, please try again after 15 minutes' if one reaches the limit.

## (Client) Additional: Search and Sort (3 marks)
- **One line description:** User can search courses by suburb name in Courses pages, and the results are sort by time.
- **Video timestamp:** 1:30-1:40
- **Relevant files**
    - /client/src/pages/courses.jsx
            A search bar is set in courses page, user can search suburb name in search bar, the result from search is sort in ascender of course time.
            
## (Client) Additional: Responsive design (3 marks)
- **One line description:** the main courses page with course cards and search bar are responsive to different size of window.
- **Video timestamp:**1:40-1:58 & 9:30-9:50
- **Relevant files**
    - /client/src/pages/courses.jsx
            Course cards are showed in simplegrid which shows 1 card in small window, 3 cards in middle size window and 5 cards in full size window. 
            The buttons and cards content are also responsive to different size of windows.
            The search bar and its buttons are responsive in the same principle.
