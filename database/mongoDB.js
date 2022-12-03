const mongoose = require('mongoose')
require('dotenv').config()

const DBUrl = process.env.DBConnectionUrl

function connection () {
    mongoose.connect(DBUrl)
        .then(() => {
            console.log('Connected to MongoDB Successfully!');
        }).catch((err) => {
            console.log(err.message);
        })

}

module.exports = { connection }