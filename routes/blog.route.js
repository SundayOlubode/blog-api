const express = require('express')
const blogRouter = express.Router()
const { getAllBlogs } = require('../controller/blogpost')
require('../authentication/passportJWT')


blogRouter.get('/allblogs', getAllBlogs)


module.exports = blogRouter