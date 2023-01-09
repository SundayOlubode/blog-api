exports.signup = (req, res, next) => {
   
    res.status(200).json({
        status: 'success',
        message: 'Sign up successful!'
    })
}

exports.login = (req, res, next) => {
    try {
        const { user } = req
        res.status(200)
            .json({ user })
    } catch (err) {
        res.status(401).json(err.message)
    }
}