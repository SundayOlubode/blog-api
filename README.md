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

### Author
| field     | datatype | constraints      |
| --------- | -------- | ---------------- |
| email     | string   | required, unique |
| firstname | string   | required         |
| lastname  | string   | required         |
| password  | string   | required         |
| blogs     | array    | optional         |
| blog_count| string   |                  |


### Blog
| field       | datatype                | constraints                 |
| ----------- | ----------------------- | --------------------------- |
| title       | string                  | required , unique           |
| description | string                  |                             |
| author      | mongoose.Types.ObjectId | ref:'author'                  |
| state       | string                  | enum: ['Draft','Published'] |
| tags        | string                  |                             |
| body        | string                  | required                    |


## APIs
---

### Signup User

- Route: /auth/signup
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

- Route: /auth/login
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

- Route: /
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
    "docs": [
        {
            "_id": "63ad5f8ec6d65a72ab3f5927",
            "title": "How to Use Mongoose Population",
            "author": {
                "_id": "63ad5dec20414c5dd256018e",
                "firstname": "Pius",
                "lastname": "Ezekiel",
                "blog_count": 0
            },
            "state": "published",
            "body": "Mongoose population enables you to acess another document from a document",
            "description": "mongoose population with nodejs",
            "tags": [
                "mongoose",
                "population"
            ],
            "readCount": 0,
            "readTime": "5 secs",
            "postTime": "2022-12-29T09:35:48.666Z",
            "__v": 0
        },
        {
            "_id": "63ad643bfc27698b915d5394",
            "title": "AltSchool Blogs",
            "author": {
                "_id": "63ad6390fc27698b915d538f",
                "firstname": "Timi",
                "lastname": "Olubode",
                "blog_count": 0
            },
            "state": "published",
            "body": "Intro to Technical Writing",
            "description": "Tech Career in Technical Writing",
            "tags": [
                "technical Writing"
            ],
            "readCount": 0,
            "readTime": "2 secs",
            "postTime": "2022-12-29T09:44:06.692Z",
            "__v": 0
        },
        {
            "_id": "63ad64a7fc27698b915d5398",
            "title": "Data Structures and Algorithm",
            "author": {
                "_id": "63ad6390fc27698b915d538f",
                "firstname": "Timi",
                "lastname": "Olubode",
                "blog_count": 0
            },
            "state": "published",
            "body": "Data Structures and Algorithm provies fundamental knowledge to solving computational problems with programming languages",
            "description": "DSA for absolute beginners",
            "tags": [
                "DSA",
                "Algorithms"
            ],
            "readCount": 0,
            "readTime": "7 secs",
            "postTime": "2022-12-29T09:44:06.692Z",
            "__v": 0
        }
    ],
    "total": 4,
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 1
}
```


---
### Create a Blog (logged in user)

- Route: /blog/create
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    "title": "Recursion",
    "body": "Recursion in programming is an alternative to looping. It provides a way to execute a function in itself with varying inputs",
    "description": "Recursion in JS",
    "tags": ["DSA", "Recursion"]
}
```

- Responses

Success
```
{
    "status": true,
    "newblog": {
        "title": "Recursion",
        "author": "63bc5bf5c5dee7517f10d0af",
        "state": "draft",
        "body": "Recursion in programming is an alternative to looping. It provides a way to execute a function in itself with varying inputs",
        "description": "Recursion in JS",
        "tags": [
            "DSA",
            "Recursion"
        ],
        "readCount": 0,
        "readTime": "10 secs",
        "postTime": "2023-01-09T19:12:05.020Z",
        "_id": "63bc683144d29cbd2216a72f",
        "__v": 0
    }
}
```

### update my blog  (logged in users)

- Route: /blog/:id
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

- Route: /blog/delete/:id
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

### Get published blogs for user (logged in user)

- Route: /author/blogs
- Method: GET

- Responses

Success
```
{
  "status": true,
  "blogList": [blogs]
}
```

---
### Get a blog with id  (logged in user)

- Route: /author/myblogs/:blogId
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


## Owner
- Olubode Sunday Samuel