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


// Get all blogs
const getAllBlogs = async (req, res) => {

    let { author, title, tags, readCount, readTime, postTime } = req.query

    var query = { state: 'published' }

    if (title) { query.title = title }
    if (tags) { query.tags = tags }
    if (author) {
        author = { fullname: author }
        query.author = author
    }

    var options = { offset: 0, limit: 20 };

    // sort by 
    if (readCount) {
        readCount = readCount.toLowerCase()
        if (readCount === 'asc') {
            readCount = -1
            options.sort = { readCount: readCount }

        } else {
            readCount = 1
            options.sort = { readCount: readCount }
        }
    }
    if (readTime) {
        readTime = readTime.toLowerCase()
        if (readTime === 'asc') {
            readTime = -1
            options.sort = { readTime: readTime }

        } else {
            readTime = 1
            options.sort = { readTime: readTime }
        }
    }
    if (postTime) {
        postTime = postTime.toLowerCase()
        if (postTime === 'asc') {
            postTime = -1
            options.sort = { postTime: postTime }

        } else {
            postTime = 1
            options.sort = { postTime: postTime }
        }

    }

    blogs = await blogModel.paginate(query, options)
    blogs = blogs.docs

    return blogs
}

// Get blog by id
const getBlogById = async (req, res) => {
    const { blogId } = req.params;
    const blog = await blogModel.findById(blogId)

    if (!blog) {
        throw new Error(`blog with ID ${blogId} not found!`)
    }

    blog.readCount += 1;
    await blog.save()

    return blog
}

const getMyBlogs = async (user) => {

    let userID = user._id

    const author = await userModel.findById({ _id: userID })
    if (!author) {
        throw new Error('Please log in to access you blog list')
    }

    let blogs = await blogModel.find()

    if (!blogs) {
        throw new Error('You do not have any blog yet!')
    }

    var query = { authorID: userID };
    var options = { offset: 3, limit: 3 };

    blogs = await blogModel.paginate(query, options)
    blogs = blogs.docs

    return blogs;
}

// Post a blog
const createABlog = async (req, user) => {
    try {
        let blog = req.body

        console.log('Users', user);

        blog.readTime = readTimeCalcultor(blog)
        blog.authorID = user._id
        blog.author = user

        const newblog = await blogModel.create(blog)
        await updateAuthorsBlogsArray(newblog)
        await incrementAuthorsBlogCount(newblog)

        return newblog;

    } catch (error) {
        return (error)
    }
}

// Update blog's state
const updateBlog = async (req, token) => {

    const { id } = req.params;
    const { state } = req.body;
    const newBody = req.body.body

    const blog = await blogModel.findById(id)

    if (!blog) { throw new Error(`blog with ID ${id} not found!`) }

    var authorID = blog.authorID
    var userID = token._id

    if (authorID != userID) {
        throw new Error('You do not have access to modify this blog')
    }

    if (newBody) { blog.body = await editBlog(req, blog, newBody) }

    if (state) {
        if (state === blog.state || state !== 'published') {
            throw new Error(`Invalid Operation!`)
        }
        blog.state = state;
    }

    await blog.save()
    return blog
}


// Delete blog by id
const deleteBlogById = async (req, res, token, next) => {
    const { id } = req.params;
    var authorID = blog.authorID
    var userID = token._id


    console.log('titlt: ', title);
    if (authorID != userID) {
        throw new Error('You do not have access to delete this blog')
    }

    console.log('Verified!');

    blogModel.findByIdAndDelete({ _id: id })
        .then(async (blog) => {
            await removeBlogFromAuthorsList(blog)
            await decrementAuthorsBlogCount(blog)
            console.log('deleted!');
            return title;
        }).catch((error) => {
            return error
        })


}

module.exports = {
    getAllBlogs,
    getBlogById,
    createABlog,
    deleteBlogById,
    updateBlog,
    getMyBlogs
}