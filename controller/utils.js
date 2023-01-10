const jwt = require('jsonwebtoken')
require('dotenv').config()
const userModel = require('../Models/author.model')
const blogModel = require('../Models/blog.model')
require('mongoose')



const updateAuthorsBlogsArray = async (newblog) => {
    try {
        const authorID = newblog.author
        const { _id, title } = newblog

        const author = await userModel.findById({ _id: authorID })
        await author.updateOne({ $push: { blogs: { _id, title } } })

    } catch (error) {
        return error
    }
}

const removeBlogFromAuthorsList = async (blog) => {
    try {
        const authorID = blog.author
        const { _id, title } = blog

        const author = await userModel.findById({ _id: authorID })
        await author.updateOne({ $pull: { blogs: { _id, title } } })

    } catch (error) {
        return error
    }
}

const incrementBlogsReadCount = async (b) => {
    try {
        const blogID = b._id
        console.log('blogID ',blogID);
        const blog = await blogModel.findById({ _id: blogID })
        console.log('blog', blog);
        await blog.updateOne({ $inc: { readCount: 1 } })
    } catch (error) { return error }
}

const incrementAuthorsBlogCount = async (blog) => {
    try {
        const authorID = blog.author
        const author = await userModel.findById({ _id: authorID })
        await author.updateOne({ $inc: { blog_count : 1 } })
    } catch (error) { return error }
}

const decrementAuthorsBlogCount = async (blog) => {
    try {
        const authorID = blog.author
        const author = await userModel.findById({ _id: authorID })
        await author.updateOne({ $inc: { blog_count: -1 } })
    } catch (error) { return error }
}

const readTimeCalcultor = (blog) => {
    const blogBody = blog.body
    const wordsInBlog = blogBody.split(' ')
    const lengthOfBlog = wordsInBlog.length

    // Calculation
    // Averagely, it takes 2mins (120secs) to read 250 words ==> Our standard
    // 200 words = 180secs
    // estiamtedReadTime = (120 x lengthOfBlog ) / 250

    const estimatedReadTime = ((120 * lengthOfBlog) / 250)
    if (estimatedReadTime < 60) {
        return Math.round(estimatedReadTime) + ' secs'
    }
    return Math.round(estimatedReadTime / 60) + ' mins'
}

const editBlog = async (req, blog, newBody) => {
    try {
        console.log(newBody);

        if (newBody === blog.body) {
            throw new Error(`Provided update same as current body!`)
        }
        return newBody

    } catch (error) {
        return error
    }
}

// Query blog by state
const queryBlogByState = async (req, res) => {
    var query = { state: req.query.state };
    var options = {
        offset: 3,
        limit: 3
    };
    const blog = await blogschema.paginate(query, options)
}

// Generate Jwt
const generateJWT = (user) => {
    try {
        
        const payload = { _id: user._id, email: user.email, password: user.password, fullname: user.firstname + ' ' + user.lastname }
        const token = jwt.sign(payload, 'shhh_secret', { expiresIn: '1h' })

        return token;
    } catch (error) { return error }
}


module.exports = {
    generateJWT,
    queryBlogByState,
    editBlog,
    readTimeCalcultor,
    decrementAuthorsBlogCount,
    incrementAuthorsBlogCount,
    removeBlogFromAuthorsList,
    updateAuthorsBlogsArray,
    incrementBlogsReadCount
}
