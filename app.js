const express = require('express')
const database = require('./database/mongoDB')
const bodyparser = require('body-parser')
const passport = require('passport')
require('./authentication/passportJWT')
require('dotenv').config()
const blogRoutes = require('./routes/blogRoutes')
const {generateJWT} = require('./controller/utils')
const userRouter = require('./routes/userRoutes')
const account = require('./controller/account')


const PORT = process.env.PORT

const app = express()

//Middlewares
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

//routes
app.use('/blogs', blogRoutes)
app.use('/user', userRouter)



app.post('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Altschool Student Blog'
    })
})


app.post('/signup', passport.authenticate('signup', { session: false }), account.signup)
app.post('/login', passport.authenticate('login', { session: false }, account.login))


module.exports = app