const mongooose = require('mongoose')
const { Schema } = mongooose

const bcrypt = require('bcrypt')

const AuthorSchema = new Schema({
    email: {
        type: String,
        required : [true, 'Email is required!'], 
        unique: [true, 'Email already exist!']
    },
    firstname: {
        type: String,
        required: [true, 'Firstname is required!']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required!']
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    blogs: Array,
    blog_count : {
        type: Number,
        default: 0
    }

})


AuthorSchema.pre('save', async function (next) {
    if(this.blog){
      this.blog_count = await this.blogs.length;  
    }

    this.password = await bcrypt.hash(this.password, 10)

    next()
})

AuthorSchema.methods.isValidPassword = async function (password)  {
    const compare = await bcrypt.compare(password, this.password)  
    return compare;
}

const Author = mongooose.model('author', AuthorSchema)
module.exports = Author