# Career_Crusader

# Career_Crusader

## Description 

Career Crusader is a job listing platform that allows users to post, update, delete, and search for jobs. The application is built with Express.js, a fast, unopinionated, and minimalist web framework for Node.js. It uses MySQL for its database, Handlebars as its templating engine, and Express-Session for session management. 

## User Story

As a job seeker <br>
I want to be able to search and apply for job listings on an online platform <br>
That also allows me to view and interact with user-submitted job listings <br>

## Acceptance Criteria

AS A USER, I can sign up and log in to my account using my email and password <br>
AS A USER, I can create, update, and delete my job listings <br>
AS A USER, I can search for job listings based on keywords, location, or categories <br>
AS A USER, I can view the details of a job listing, including its title, company name, location, description, requirements, and application instructions <br>
AS A USER, I can view and interact with user-submitted job listings, such as commenting or upvoting/downvoting <br>
AS A USER, I can submit job listings with information such as job title, company name, location, description, requirements, and application instructions <br>
As a user, I can manage my submitted job listings, including creating, updating, and deleting them <br>
As a user, I can view my past job applications and their status <br>
As an employer, I can view all job applications received for a particular job listing <br>
As a user, I can receive email notifications regarding the status of my job application <br>
As a user, I can access the online platform from any device, and the platform should be responsive and user-friendly <br>
As a user, I expect the online platform to be secure and protect my personal information <br>


## Deployed URL

https://career-crusaders-mvp.herokuapp.com/


## Github Repository

https://github.com/bragceo/Career_Crusader


## Updated Portfolio 

https://bragceo.github.io/portfolio---challenge---2/


## Google Slides Presentation

Career_Crusader_presentation_Final


## Overview of Code structure and its components:


app.js: This is the main application file. It initializes the application, sets up middleware, connects to the database, registers routes, and starts the server. The 'dotenv' package is used to load environment variables from a .env file into process.env.

career_crusader.sql: This file sets up the 'jobs' table in the MySQL database. The table has fields for job details like title, company, location, description, requirements, and upvotes, along with timestamps and the user who posted the job.

Handlebar engine: Handlebars.js is a popular templating engine that lets you build semantic templates. The app is configured to use .hbs template files, and partials like 'header' are registered to be reused across different views.

Express-session: Express-session is a middleware for handling sessions in Express.js. In this app, it's used to log in users and authenticate their commands.

routes/index.js: This file defines routes for the homepage, login, register, and logout functionalities. It uses the userController for handling login, registration, and logout operations, and fetches jobs from the database to be displayed on the homepage.

routes/jobs.js: This file defines routes related to job listings. It handles routes for creating, updating, deleting, and searching jobs, and for displaying jobs posted by the logged-in user. It uses the jobController for handling these operations.

controllers/userController.js: This file defines the application logic for handling user registration, login, and logout operations. It uses bcryptjs for hashing passwords, and jsonwebtoken for creating a JSON Web Token (JWT) when a user logs in.

controllers/jobController.js: This file defines the application logic for handling job-related operations. It handles job creation, updating, deletion, fetching jobs posted by a user, and searching for jobs.

Models: The models for 'Job' and 'User' are stored in the 'models' folder. These models define the structure of the 'Job' and 'User' objects and their relations. They are used by Sequelize, an Object-Relational Mapping (ORM) library, to interact with the database.

Views: The 'views' folder contains Handlebars templates for the various pages of the application. The app is configured to use these templates to generate HTML for client-side rendering. The templates use the '.hbs' extension and can include variables and other dynamic content.
 


## How to run the application
 
Running the application locally:

Environment setup: This application requires Node.js and npm (Node Package Manager) to run. Node.js can be downloaded from the official Node.js website.

Install dependencies: Navigate to the directory via the terminal and run the command npm install. This installs all the packages and libraries the application depends on, as specified in the package.json file.

Configure your environment variables: The application uses environment variables for important settings. These are often stored in a .env file. You will need to set at least the following environment variables: PORT, SESSION_SECRET, JWT_SECRET. Further, because the application is configured to use a database, you'll also need to provide the database connection details as environment variables. Make sure to set PORT=3000 if you want the application to run on port 3000.

Database setup: Install MySQL and then create a database named career_crusader. After creating the database, run the provided SQL script to create the jobs table and configure its structure.

Run the application: Finally, run the command npm start or node app.js to start the application. If everything is set up correctly, you should see a message stating that the server is running on port 3000.

View the application: Open your web browser and navigate to http://localhost:3000. You should be able to see the application running.

Deploying the application with Heroku:

Heroku is a cloud platform that lets you deploy, run, and manage applications. To deploy your app on Heroku, you need to:

Create a Heroku account: If you don't have a Heroku account, create one on the Heroku website.

Install the Heroku CLI: The Heroku Command Line Interface (CLI) makes it easy to create and manage your Heroku apps directly from the terminal. It's available for Windows, macOS, and Ubuntu.

Log in to Heroku: After installing the CLI, open your terminal and log in to your Heroku account using the command heroku login.

Create a new Heroku app: Navigate to your project's directory in the terminal and create a new Heroku app using the command heroku create.

Set environment variables: Use the command heroku config:set VARNAME=value to set each of your environment variables. Remember to replace VARNAME and value with your actual variable names and values.

Provision a database: If your app requires a database, you can provision a new one using Heroku's add-ons. For a MySQL database, you can use the ClearDB add-on with the command heroku addons:create cleardb:ignite.

Deploy your app: Commit your changes using Git, and then push your app to Heroku using the command git push heroku master.

Open your app: Use the command heroku open to view your deployed app in the browser. You can also visit the app directly by going to https://your-app-name.herokuapp.com, replacing your-app-name with the name of your Heroku app.



## Special Thanks 

Shout out to the awesome Instructors and TAs who worked with me through numerous challenges. These individuals include: Diego, Enrique Gomes, and Erik Hoverstein. 

Additional resources:

In addition to the above, we reviewed various parts from this Udemy tutorial: 

https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080918#overview




## Authors 

Lavell Juan <br>
Erin Matts <br>
Khuzema Aslam <br>




## Credits 

N/a

## License 

Please refer to license in repo 
