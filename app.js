const express = require('express')
const database = require('./database/mongoDB')
const bodyparser = require('body-parser')
const passport = require('passport')
require('./authentication/passportJWT')
require('dotenv').config()
const blogRoutes = require('./routes/blogRoutes')
const {generateJWT} = require('./controller/utils')
const userRouter = require('./routes/userRoutes')


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


app.post('/signup',
    passport.authenticate('signup', { session: false }),
    (req, res, next) => {
        res.status(200).json({
            status: 'success',
            message: 'Sign up successful!'
        })
    })


app.post('/login', async (req, res, next) => {    
    passport.authenticate('login', { session: false }, async (err, user, info) => {        
        try {

            if (err) { return next(err) }
            const token = generateJWT(user)
            res.status(200).json({ user, token })

        }catch (err) {
            res.status(401).json(err.message)
        }
    })(req, res, next)

})


module.exports = app