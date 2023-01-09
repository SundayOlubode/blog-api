require('dotenv').config()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportjwt = require('passport-jwt')
const userModel = require('../Models/author.model')
require('dotenv').config()
const localStrategy = require('passport-local').Strategy
const JWTStrategy = passportjwt.Strategy
const ExtractJWT = passportjwt.ExtractJwt
const { generateJWT } = require('../controller/utils')


passport.use(
    new JWTStrategy({
        secretOrKey: 'shhh_secret',
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    }, async (token, done) => {
        if (!token) {
            return done(null, false)
        }
        try {
            const user = { _id: token._id, email: token.email, fullname: token.fullname }
            if (!user) { return done(null, false) }
            return done(null, user)
        } catch (error) {
            done(error)
        }
    })
)



passport.use(
    'signup',
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password', passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            let user = req.body
            userModel.create(user)
                .then((user) => {
                    return done(null, user)
                }).catch(() => {
                    return done(null, false)
                })
        } catch (error) {
            done(error)
        }
    }
    )
)



passport.use(
    'login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email })
            if (!user) { return done(null, false, { message: 'User not found!' }) }

            const validate = await user.isValidPassword(password);
            if (!validate) { return done(null, false) }

            const token = generateJWT(user)
            done(null, {user, token})
        } catch (error) {
            return done(error, false)
        }
    })
)