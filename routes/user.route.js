require('../authentication/passportJWT')

const passport = require('passport')
const express = require('express')
const userRouter = express.Router()
const validation = require('../validation/validation')
const { 
    createABlog, 
    deleteBlogById, 
    updateBlog, 
    getMyBlogs 
} = require('../controller/blogpost')



// userRouter

userRouter.get('/myblogs', getMyBlogs)

userRouter.post('/create', createABlog)

userRouter.patch('/update', updateBlog)

userRouter.delete('/delete', deleteBlogById)


module.exports = userRouter