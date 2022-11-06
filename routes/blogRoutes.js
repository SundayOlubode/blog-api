const express = require('express')
const blogRouter = express.Router()
const { getAllBlogs } = require('../controller/blogpost')
require('../authentication/passportJWT')


blogRouter.get('/', (req, res) => {
    getAllBlogs(req, res)
        .then((blogs) => {
            res.status(200).json(blogs)
        }).catch((err) => {
            res.status(401).json({ status: false, message: err.message })
        })
})



module.exports = blogRouter