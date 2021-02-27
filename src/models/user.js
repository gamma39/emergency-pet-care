const mongoose = require('mongoose')
//load in validator to check email
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    userName: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not include the word password')
            }
        }
        
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})


//hash password before saving user
userSchema.pre('save', async function(next) {
    const user = this
    
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//find user by credentials 
userSchema.statics.findByCredentials = async (userName, password) => {
    const user = await User.findOne({ userName })

    if(!user) {
        throw new Error('Unable to log in')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to log in')
    }

    return user
}

//generate a JWT for user
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET, { expiresIn: '7 days'})

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}   

const User = mongoose.model('User', userSchema)

module.exports = User