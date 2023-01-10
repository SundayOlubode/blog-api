//Express
const express = require('express')

const database = require('./database/mongoDB')

const bodyparser = require('body-parser')

//Security
const passport = require('passport')
const rateLimit = require("express-rate-limit");
require('./authentication/passportJWT')
require('dotenv').config()

//Middlewares
const account = require('./controller/account')
const authorRouter = require('./routes/author.route')
const blogRouter = require('./routes/blog.route')
const validation = require('./validation/validation')

const blogController = require('./controller/blogpost')

const PORT = process.env.PORT

const app = express()

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many request from this user. Please try again after 2 mins',
    skipFailedRequests: true
})

//Middlewares
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(limiter)







//Routers
app.use('/author', passport.authenticate('jwt', {session: false}), authorRouter)

app.use('/blog', passport.authenticate('jwt', {session: false}), blogRouter)







// //Databse
database.connection()

app.post('/auth/signup', validation.validateSignup, passport.authenticate('signup', { session: false }), account.signup)

app.post('/auth/login', validation.validateLogin, passport.authenticate('login', { session: false }), account.login)

app.get('/', blogController.getBlogs)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
