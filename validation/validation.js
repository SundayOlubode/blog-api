const joi = require('joi')

const validator = (schema) => (req, res, next) => {
    const payload = req.body

    schema.validateAsync(payload, { abortEarly: false })
        .then(() => {
            next()
        }).catch((error) => {
            next(error)
        })
}


const signupSchema = joi.object({
    email: joi.string()
        .email()
        .required(),
    password: joi.string()
        .min(4)
        .required(),
    firstname: joi.string()
        .min(2)
        .max(20)
        .required(),
    lastname: joi.string()
        .min(3)
        .max(30)
        .required()
})


const loginSchema = joi.object({
    email: joi.string()
        .email()
        .required(),
    password: joi.string()
        .min(4)
        .required()
})

const blogSchema = joi.object({
    author: joi.string()
        .min(4)
        .optional(),
    state: joi.string()
        .valid('published', 'draft')
        .optional()
})


exports.validateSignup = validator(signupSchema)
exports.validateLogin = validator(loginSchema)
exports.validateBlog = validator(blogSchema)