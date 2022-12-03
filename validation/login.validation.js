const { required } = require('joi')
const joi = require('joi')


const loginvalidation = (req, res, next) => {
    const loginPayload = req.body

    console.log('Here ',loginPayload);

    schema.validateAsync(loginPayload, {abortEarly: false})
        .then(() => {
            next()
        }).catch((error) => {
            console.log(error);
            next(error)
        }) 
}



const schema = joi.object({
    email: joi.string()
            .email()
            .required,
    password: joi.string()
            .required
})


module.exports = loginvalidation