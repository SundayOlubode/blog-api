const express = require('express')
const blogRouter = express.Router()
const { getAllBlogs } = require('../controller/blogpost')
require('../authentication/passportJWT')


blogRouter.get('/allblogs', (req, res, next) => {
    getAllBlogs(req, next)
        .then((blogs) => {
            res.status(200).json(blogs)
        }).catch((err) => {
            res.status(401).json({ status: false, message: err.message })
        })
})



module.exports = blogRouter