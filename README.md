<a name="custom_anchor_name"></a>

# jobster API :briefcase:

## Concepts applied but not limited too

- ### node js
- ### express router
- ### routes and controllers
- ### rest API
- ### mongodb atlas
- ### nosql
- ### mongoose
- ### schema & model
- ### heroku hosting
- ### jwt auth
- ### render

---

### _goals_

- working with actual frontend
- create a server that sends back proper responses
- server that powers the frontend application

---

### _notes_

- spring cleaning
  - remove swagger
  - remove limiter
    - we will use a more specific limiter for unique routes
  - remove cors
    - originally we wanted external apps to access api, we just built a server
    - for this project we only this frontend to be able to access this server
    - no need for cors
  - change engines
    - to latest stable version, package json
- client folder
  - our frontend application
- setup up client folder as our static
- api routes will be used in frontend
- grab index.html from client and serve it for all the routes, that are not part of the api routes
- register login controller
  - adjust response object based on frontend
- update user
  - authenticated for security and only user can change their info
  - create a new jwt token
  - when using save(), it triggers pre save hooks
    - which will hash the password again when it updates doc on db
    - as a result our original password will be be different
    - remove all existing users first
    - solution, check for the path that is modified
      - this.modifiedPaths().....this references the model
- Add job page
  - tied to user location, by default
  - add new fields in jobs model
  - job type
  - location
  - test the routes
- mockaroo
  - can add jobs manually one by one
  - or use mockaroo to programmatically create jobs for demo user
  - add it to test user
  - great resource to create fake data
  - use the sme exact field names in the models
  - date time
    - use two years
    - format iso 8601 utc
  - uncheck, include null values
  - rows to 75
  - generate
- add file to database to populate data
  - make a separate file
  - stop server, then run specific file
- all jobs page search feature
  - grab req.query
  - get all the jobs where in the position there is a search values ex. Da
  - status and job type
- pagination
  - you can setup pagination on frontend but that does not change the amount of data over the wire
    - so if you have a 1000 users with 1000 jobs each, handling this on the frontend is not the best choices
    - it can be done, but should it be
    - request all the jobs and let the frontend handle it
    - will make frontend slower and it will add up quickly
  - server is much better equipped to handle that
  - so instead of sending back all the data of specific user we will limit it
  - and then is user request page two then they will get it
  - by using limit and skip to return pages
  - limit can be added on frontend to allow user to pick or have a default of 10
  - send total jobs and number of pages, because there is a pagination setup on frontend.
    - its looking for total jobs and number of pages
    - countDocument() method
  - each button click will send a request for specific page
- restrict certain actions for demo user
  - demo user cannot perform any crud operations
  - multiple ways to stop this
    - we can use email or userId of test user from mongo db
  - another middleware between auth and controller
    - import it where ever you want restriction for test user
- api limiter
  - limit the amount of time the user can login or register
  - avoid someone who might try to spam application
  - instead of adding it entire app, it wil only be two request
  - grab the package express rate limit
    - set up rate limiter function
    - pass in object with desired values
  - inject it before register and login routes only
  - app.set('trust proxy',1)
    - add before all middleware, since we're pushing to render
- stats page
  - mongodb aggregation
  - idea is, we want to group our data based on something
    - status, interview, jobs declined
  - also we want to send out how many applications filled out in last 6 months
  - aggregation pipeline consists of one or more stages that processes documents(jobs or user)
    - each stage performs and operation on input documents
      - filter, group, or calculate values
    - the documents that are output from a stage are passed to the next stage
    - can return results for groups of docs, like total, average, maximum, and minimum values
  - let stats
    - JobModel.aggregate
  - stage 1
    - match based on userID
  - stage 2
    - group, ids by status
  - refactor result based on what front end is expecting
    - reduce method
  - setup default stats incase user has no jobs
    - unless theres check on frontend, but should be checks on both sides
  - install and import moment & mongoose library in jobs controller

[Back to Top](#custom_anchor_name)
