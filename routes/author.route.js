require('../authentication/passportJWT')

const passport = require('passport')
const express = require('express')
const authorRouter = express.Router()
const validation = require('../validation/validation')
const blogController = require('../controller/blogpost')



// authorRouter

authorRouter.get('/profile', blogController.getProfile)

authorRouter.get('/blogs', blogController.getMyBlogs)


module.exports = authorRouter