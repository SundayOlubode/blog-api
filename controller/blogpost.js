const {
    editBlog,
    readTimeCalcultor,
    decrementAuthorsBlogCount,
    incrementAuthorsBlogCount,
    removeBlogFromAuthorsList,
    updateAuthorsBlogsArray,
    incrementBlogsReadCount
} = require('./utils')


require('dotenv').config()
require('mongoose')

const blogModel = require('../Models/blog.model')
const authorModel = require('../Models/author.model')

// Get all blogs
exports.getBlogs = (req, res, next) => {
    console.log(req.query);

    var { query, options } = addQueryParams(query, options, req.query)

    console.log('query', query);

    options.populate = ({ path: 'author', select: 'firstname lastname blog_count' })

    blogModel
        .paginate(query, options)
        .then( async (blogs) => {
            let result = blogs;
            if(query._id){
                console.log('hi');
                await incrementBlogsReadCount(blogs.docs[0])
            }
            if (req.query.author) {
                result = blogs.docs
                    .filter((blog) => {
                        return blog.author.firstname === req.query.author
                    })
            }
            res.status(200).json(result)
        }).catch((err) => {
            res.status(401).json({
                status: false,
                message: err.message
            })
        })
}


exports.getMyBlogs = async (req, res, next) => {
    var query = {}
    var options = { offset: 0, limit: 2 };

    query.author = req.user._id

    if(req.query.id){
        query._id = req.query.id
    }

    blogModel
        .paginate(query, options)
        .then((blogs) => {
            if(blogs.docs.length < 1){
                return res.status(404).json({
                    status: false,
                    message: req.query.id? 'Blog with specified author not found!': 'No blog found!'
                })
            }
            res.status(200).json(blogs)
        }).catch((error) => {
            res.status(401).json({
                status: false,
                message: error.message
            })
        })
}

// Post a blog
exports.createABlog = (req, res, next) => {
    let blog = req.body
    let user = req.user

    if (!user) {
        throw new Error('Please sign in to continue!')
    }

    blog.readTime = readTimeCalcultor(blog)
    blog.author = req.user._id

    blogModel.create(blog)
        .then(async (newblog) => {
            await updateAuthorsBlogsArray(newblog)
            await incrementAuthorsBlogCount(newblog)
            res.status(200).json({ status: true, newblog })
        }).catch((err) => {
            res.status(401).json({ status: false, message: err.message })
        })

}

// Update blog's state
exports.updateBlog = async (req, res, next) => {

    const { id } = req.query;
    if(!id){
        res.status(400).json({
            status: false,
            message: 'Please provide and id!'
        })
    }
    const { state } = req.query;
    const newBody = req.body.body

    blogModel.findById({ _id: id })
        .then(async (blog) => {
            var author = blog.author
            var user = req.user._id

            if (author != user) throw new Error('You can not modify this blog')
            if (newBody) blog.body = await editBlog(req, blog, newBody)

            if (state) {
                if (state === blog.state || state != 'published') throw new Error(`Invalid Operation!`)
                blog.state = state;
            }
            await blog.save()
            res.status(200).json({ status: true, blog })
        })
        .catch((err) => {
            res.status(404).json({
                status: false,
                message: err.message
            })
        })
}


// Delete blog by id
exports.deleteBlogById = async (req, res, next) => {
    const { id } = req.query;

    if(!id){
        res.status(400).json({
            status: false,
            message: 'Please provide and id!'
        })
    }
    const blog = await blogModel.findById({ _id: id })

    try {
        var author = blog.author
    } catch {
        const error = new Error(`This blog with id ${id} does not exist`)
        return res.json({ status: false, message: error.message })
    }
    var user = req.user._id

    if (author != user) {
        const error = new Error('You are not authorized to delete this blog!')
        return res.json({ status: false, message: error.message })
    }
    blogModel.findByIdAndDelete({ _id: id })
        .then(async (blog) => {
            await removeBlogFromAuthorsList(blog)
            await decrementAuthorsBlogCount(blog)
            console.log('deleted!');
            res.status(200).json({ status: true, message: `Blog deleted successfully!` })
        }).catch((err) => {
            res.json({ status: false, message: err.message })
        })
}

exports.getblogById = async (req, res, next) => {
    const { id } = req.query;

    blogModel.findById({ _id: id })
        .then(async (blog) => {
            blog.readCount += 1;
            await blog.save()
            res.status(200).json({ blog })
        }).catch((err) => {
            res.status(401).json({ status: false, message: err.message })
        })
}

exports.getProfile = async (req, res, next) => {
    authorModel.findById(req.user._id)
        .then((author) => {
            res.status(200).json({
                status: true,
                author: author
            })
        }).catch((error) => {
            res.status(401).json({
                status: false,
                message: error.message
            })
        })
}

const addQueryParams = (query, options, params) => {
    let { title, tags, readCount, readTime, postTime, id } = params

    var query = { state: 'published' }

    var options = {}

    if (title) { query.title = title }
    if (tags) { query.tags = tags }
    if (readCount) { query.readCount = readCount }
    if (readTime) { query.readTime = readTime }
    if (postTime) { query.postTime = postTime }
    if (id) { query._id = id }

    return { query, options }
}