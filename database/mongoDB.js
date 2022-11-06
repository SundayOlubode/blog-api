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

    // mongoose.connection.on("connected", () => {
    //     console.log("Connected to MongoDB Successfully!");
    // });

    // mongoose.connection.on("error", (err) => {
    //     console.log("An error occurred while connecting to MongoDB");
    //     console.log(err);
    // });
}

module.exports = { connection }