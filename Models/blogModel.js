const mongooose = require('mongoose')
const { Schema } = mongooose
const moment = require('moment')
const mongoosePaginate = require('mongoose-paginate')
const Users = require('./userModel')


const ObjectId = Schema.ObjectId;

const blogSchema = new Schema({
    title: {
        type: String,
        required : [true, 'Blog title is required!'],
        unique: [true, 'Title already exists!']
    },
    author:  {type: mongooose.Types.ObjectId, ref: 'users'},
    // author: {
    //     email: String,
    //     _id: ObjectId,
    //     fullname: String
    // },
    state: {
        type: String, 
        default: 'draft'
    },
    body: {
        type: String
    },
    description: String,
    tags: Array,
    readCount: {type: Number, default: 0},
    readTime: String,    
    postTime: {
        type: Date,
        default: moment().toDate()
    }
})



blogSchema.plugin(mongoosePaginate)

const blog = mongooose.model('blog', blogSchema)
module.exports = blog
