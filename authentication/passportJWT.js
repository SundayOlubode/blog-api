require('dotenv').config()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportjwt = require('passport-jwt')
const userModel = require('../Models/userModel')
require('dotenv').config()
const localStrategy = require('passport-local').Strategy
const JWTStrategy = passportjwt.Strategy
const ExtractJWT = passportjwt.ExtractJwt


passport.use(
    new JWTStrategy({
        secretOrKey: process.env.SECRET_0R_KEY,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    }, async (token, done) => {
        if(!token){
            return done(null, false)
        }
        try {
            const user = {_id: token._id, email: token.email, fullname: token.fullname}
            if(!user){return done(null, false)}
            return done(null, user)
        } catch (error) {
            done(error)
        }
}))



passport.use(
    'signup',
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password', passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            let user = req.body
            user = await userModel.create(user)

            if(!user){return done(null, false)}

            return done(null, user)
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

            done(null, user)

        } catch (error) {
            done(error, false)
        }
    })
)