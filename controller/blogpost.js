const {
    editBlog,
    readTimeCalcultor,
    decrementAuthorsBlogCount,
    incrementAuthorsBlogCount,
    removeBlogFromAuthorsList,
    updateAuthorsBlogsArray
} = require('./utils')


require('dotenv').config()
require('mongoose')

const blogModel = require('../Models/blogModel')
const userModel = require('../Models/userModel')
const blog = require('../Models/blogModel')


// Get all blogs
exports.getBlogs = (req, res, next) => {

    let { author, title, tags, readCount, readTime, postTime } = req.query
    var query = { state: 'draft' }
    var options = { offset: 0, limit: 2 };

    if (author) {
        query = { state: 'published', "author.fullname": author }
        if (title) { query.title = title }
        if (tags) { query.tags = tags }

  
    }


    blogModel.paginate(query, options)
    // .populate('users')
    .then((blogs) => {
        res.status(200).json(blogs)
    }).catch((err) => {
        res.status(401).json({ status: false, message: err.message })
    })
}

exports.getBlogsWithQuery = async () => {

    let { author, title, tags, readCount, readTime, postTime } = req.query
    var query = { state: 'published' }

    if (author) {
        query = { state: 'published', "author.fullname": author }
    }
    if (title) { query.title = title }
    if (tags) { query.tags = tags }

    var options = { offset: 0, limit: 20 };

    blogs = await blogModel.paginate(query, options)
    blogs = blogs.docs

    return blogs

}


exports.getMyBlogs = async (req, res, next) => {
    var query = {}
    var options = { offset: 0, limit: 2 };

    const blogId = req.query.id
    if (blogId) query._id = blogId

    const author = await userModel.findById({ _id: req.user._id })
    if (!author) { throw new Error('Please log in to access you blog list') }

    let blogs = await blogModel.find({ author: req.user._id })
    if (!blogs) { throw new Error('You do not have any blog yet!') }

    query.author = req.user._id;

    try {
        blogs = await blogModel.paginate(query, options)
        blogs = blogs.docs
        res.status(200).json({ status: true, blogs })

    } catch (error) {
        res.status(401).json({ status: false, message: err.message })
    }
}

// Post a blog
exports.createABlog = (req, res, next) => {
    let blog = req.body
    let user = req.user

    console.log('User', user);

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
    const { state } = req.query;
    const newBody = req.body.body

    blogModel.findById({_id: id})
        .then(async (blog) => {
            var author = blog.author
            var user = req.user._id
            
            if( author != user ){
                throw new Error('You can not modify this blog')
            }

            if(newBody) blog.body = await editBlog(req, blog, newBody)

            if (state) {
                if (state === blog.state || state != 'published') {
                    throw new Error(`Invalid Operation!`)
                }
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
    console.log(id);
    const blog = await blogModel.findById({_id: id})

    var author = blog.author
    var user = req.user._id

    if (author != user) {
        const error = new Error('You can not delete this blog!')
        return next(error)
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

    console.log(id);

    blogModel.findById({ _id: id })
        .then(async (blog) => {
            blog.readCount += 1;
            await blog.save()
            res.status(200).json({ blog })
        }).catch((error) => {
            res.status(401).json({ status: false, message: err.message })
        })
}
