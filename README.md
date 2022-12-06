# Blog Api
An Api for a Blogging app

---

## Requirements
1. User should be able to sign up
2. User should be able to and sign in to the blog app with passport authentication strategy  token which expires after 1 hour
3. Users should have a first_name, last_name, email, password when signing up and - email and password to sign in
4. Logged in and not logged in users should be able to get a list of published blogs created
5. Logged in and not logged in users should be able to to get a published blog
6. A blog can be in two states; draft and published
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs. 
13. It should be filterable by state
14. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
15. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, 
    default it to 20 blogs per page. 
16. It is also searchable by author, title and tags.
17. It is also orderable by read_count, reading_time and timestamp
18. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1


---

## Setup
- Install NodeJS, mongodb
- pull this repo
- run `npm install`
- run `node index.js`

---```
## Base URL
- https://blogapi-d7ds.onrender.com


## Models
---

### User
| field     | datatype | constraints      |
| --------- | -------- | ---------------- |
| email     | string   | required, unique |
| firstname | string   | required         |
| lastname  | string   | required         |
| password  | string   | required         |


### Blog
| field       | datatype                | constraints                 |
| ----------- | ----------------------- | --------------------------- |
| title       | string                  | required , unique           |
| description | string                  |                             |
| author      | mongoose.Types.ObjectId | ref:'User'                  |
| state       | string                  | enum: ['Draft','Published'] |
| tags        | string                  |                             |
| body        | string                  | required                    |


## APIs
---

### Signup User

- Route: /signup
- Method: POST
- Body: 
```
{
    "email",
    "password",
    "firstname",
    "lastname"
    
}
```

---
### Login User

- Route: /login
- Method: POST
- Body: 
```
{
  "email": "bigshow@gmail.com",
  "password": "zuzu",
}
```

- Responses

Success
```
{
  "user": {
    "_id": "63667ea856c6eb4f2f960066",
    "email": "bigshow@gmail.com",
    "firstname": "Timi",
    "lastname": "Olubode",
    "password": "$2b$10$66AnHJLVgq1Op.FHYH1aG.ynG5oCZW1O6C.RLEg1lKjJvgGAzQPi6",
    "blogs": [
      {
        "_id": "63667f0d56c6eb4f2f96006a",
        "title": "The Best C++ Tips"
      },
      {
        "_id": "6366b79bf6991aff6de00fc3",
        "title": "The Best C++ Tips"
      }
    ],
    "blog_count": 2,
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzY2N2VhODU2YzZlYjRmMmY5NjAwNjYiLCJlbWFpbCI6ImJpZ3Nob3dAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkNjZBbkhKTFZncTFPcC5GSFlIMWFHLnluRzVvQ1pXMU82Qy5STEVnMWxLakp2Z0dBelFQaTYiLCJmdWxsbmFtZSI6IlRpbWkgT2x1Ym9kZSIsImlhdCI6MTY2Nzg4OTIxMiwiZXhwIjoxNjY3ODkyODEyfQ.18fyXLz-VLQbopq3w4xcgeMnJsipJHBQd8eR2FDjHxw"
}
```

### non logged-in users route

---
### Get published blog

- Route: /home/allblogs
- Method: GET
- Query params: 
    - author
    - title
    - tags
    - readCount
    - readTime
    - postTime 
  
- Responses

Success
```
{
 blog:[allblogs]
}
```

### Get published blogs for user (logged in user)

- Route: /user/myblogs
- Method: GET

- Responses

Success
```
{
  "status": true,
  "blogList": []
}
```


---
### Create a Blog (logged in user)

- Route: /user/create
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
  "title": "Json token",
  "body": "JWT is an authentication method",
  "description": "Intro to JWT",
  "tags": ["#JWT"]
}
```

- Responses

Success
```
{
  "status": true,
  "newblog": {
    "title": "Json token",
    "authorID": "63667ea856c6eb4f2f960066",
    "author": {
      "email": "bigshow@gmail.com",
      "_id": "63667ea856c6eb4f2f960066",
      "fullname": "Timi Olubode"
    },
    "state": "draft",
    "body": "JWT is an authentication method",
    "description": "Intro to JWT",
    "tags": [
      "#JWT"
    ],
    "readCount": 0,
    "readTime": "2 secs",
    "postTime": "2022-11-08T06:08:51.586Z",
    "_id": "6369faf30b0896b4b5f26292",
    "__v": 0
  }
}
```

---
### Get a blog with id  (logged in user)

- Route: /user/myblogs/:blogId
- Method: GET
- Header
    - Authorization: Bearer {token}

- Responses
Success
```
{
  "status": true,
  "blog": {
    "author": {
      "email": "bigshow@gmail.com",
      "_id": "63667ea856c6eb4f2f960066",
      "fullname": "Timi Olubode"
    },
    "_id": "6369faf30b0896b4b5f26292",
    "title": "Json token",
    "authorID": "63667ea856c6eb4f2f960066",
    "state": "draft",
    "body": "JWT is an authentication method",
    "description": "Intro to JWT",
    "tags": [
      "#JWT"
    ],
    "readCount": 1,
    "readTime": "2 secs",
    "postTime": "2022-11-08T06:08:51.586Z",
    "__v": 0
  }
}
```

### update my blog  (logged in users)

- Route: /user/update/:id
- Method: patch
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    "state": "Published"
}
```

- Responses

Success
```
{
  "status": true,
  "blog": {
    "author": {
      "email": "bigshow@gmail.com",
      "_id": "63667ea856c6eb4f2f960066",
      "fullname": "Timi Olubode"
    },
    "_id": "6369faf30b0896b4b5f26292",
    "title": "Json token",
    "authorID": "63667ea856c6eb4f2f960066",
    "state": "published",
    "body": "JWT is an authentication method",
    "description": "Intro to JWT",
    "tags": [
      "#JWT"
    ],
    "readCount": 1,
    "readTime": "2 secs",
    "postTime": "2022-11-08T06:08:51.586Z",
    "__v": 0
  }
}
```
---

### delete a  blog  (logged in user)

- Route: /user/delete/:id
- Method: delete
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
  "status": true,
  "blog": {
    "acknowledged": true,
    "deletedCount": 1
  }
}
```

## Owner
- Olubode Sunday Samuel