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

[Back to Top](#custom_anchor_name)
