require('../authentication/passportJWT')

const passport = require('passport')
const express = require('express')
const userRouter = express.Router()
const validation = require('../validation/validation')
const { getBlogById, 
    createABlog, 
    deleteBlogById, 
    updateBlog, 
    editBlog, 
    getMyBlogs 
} = require('../controller/blogpost')



// userRouter

userRouter.get('/myblogs', async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, token, info) => {
        if (err) {
            return next(err);
        }
        getMyBlogs(token)
            .then((blogList) => {
                res.status(200).json({ status: true, blogList })
            }).catch((err) => {
                console.log(err);
                res.status(401).json({ status: false, message: err.message })
            })
    })(req, res, next)
})


userRouter.get('/myblogs/:blogId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    getBlogById(req, res)
        .then((blog) => {
            res.status(200).json({ status: true, blog })
        }).catch((err) => {
            res.status(401).json({ status: false, message: err.message })
        })
})



userRouter.post('/create', async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) { return next(err); }
        createABlog(req, user)
            .then((newblog) => {
                res.status(200).json({ status: true, newblog })
            }).catch((err) => {
                res.status(401).json({ status: false, message: err.message })
            })
    })(req, res, next)
})

userRouter.patch('/:id', validation.validateBlog ,async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, token, info) => {
        if (err) { return next(err); }
        updateBlog(req, token)
            .then((blog) => {
                res.status(200).json({ status: true, blog })
            }).catch((err) => {
                res.status(405).json({ status: false, message: err.message })
            })
    })(req, res, next)
})
userRouter.delete('/delete/:id', async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) { return next(err); }
        deleteBlogById(req, req, user, next)
            .then(() => {
                res.status(200).json({ status: true, message: `Blog deleted successfully!` })
            }).catch((err) => {
                res.json({ status: false, message: err.message })
            })
    })(req, res, next)
})


module.exports = userRouter