const express = require('express')
const database = require('./database/mongoDB')
const bodyparser = require('body-parser')
const passport = require('passport')
const rateLimit = require("express-rate-limit");
require('./authentication/passportJWT')
require('dotenv').config()
const blogRoutes = require('./routes/blogRoutes')
const { generateJWT } = require('./controller/utils')
const userRouter = require('./routes/userRoutes')
const validation = require('./validation/validation')

const PORT = process.env.PORT

const app = express()


//Middlewares
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 15 minutes
	max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: 'Too many request from this user. Please try again after 2 mins',
    skipFailedRequests: true
})

//routes
app.use(limiter)

app.use('/home', blogRoutes)
app.use('/user', userRouter)
app.set('views engine', 'ejs')

//Connect to databse
database.connection()

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Altschool Student Blog'
    })
})


app.post('/signup', validation.validateSignup,
    passport.authenticate('signup', { session: false }),
    (req, res, next) => {
        res.status(200).json({
            status: 'success',
            message: 'Sign up successful!'
        })
})


app.post('/login', validation.validateLogin, async (req, res, next) => {
    passport.authenticate('login', { session: false }, async (err, user, info) => {
        try {
            if (err) { return next(err) }
            const token = generateJWT(user)
            res.status(200).json({ user, token })

        } catch (err) {
            res.status(401).json(err.message)
        }
    })(req, res, next)

})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
