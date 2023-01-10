require('../authentication/passportJWT')

const passport = require('passport')
const express = require('express')
const userRouter = express.Router()
const validation = require('../validation/validation')
const blogController = require('../controller/blogpost')



// userRouter

userRouter.get('/profile', blogController.getProfile)

userRouter.get('/blogs', blogController.getMyBlogs)


module.exports = userRouter