const express = require('express')
const database = require('./database/mongoDB')
const bodyparser = require('body-parser')
const passport = require('passport')
const rateLimit = require("express-rate-limit");
require('./authentication/passportJWT')
require('dotenv').config()
// const blogRoutes = require('./routes/blogRoutes')
const { signup, login } = require('./controller/account')
const userRouter = require('./routes/user.route')
const validation = require('./validation/validation')

const { getBlogs, getblogById } = require('./controller/blogpost')

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
// app.use('/home', blogRoutes)
app.use('/user', passport.authenticate('jwt', {session: false}), userRouter)

// View Engine
app.set('views engine', 'ejs')

//Databse
database.connection()


app.get('/', getBlogs)
app.get('/:id', getblogById)


app.post('/signup', validation.validateSignup, passport.authenticate('signup', { session: false }), signup)
app.post('/login', validation.validateLogin, passport.authenticate('login', { session: false }), login)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
