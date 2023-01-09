const express = require('express')
const blogRouter = express.Router()

const blogController = require('../controller/blogpost')
require('../authentication/passportJWT')


blogRouter.post('/create', blogController.createABlog)

blogRouter.delete('/delete', blogController.deleteBlogById)

blogRouter.patch('/update', blogController.updateBlog)


module.exports = blogRouter