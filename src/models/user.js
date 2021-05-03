const mongoose = require('mongoose')
//load in validator to check email
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    
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

    password: {
        type: String,
        required: true,
        //minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not include the word password')
            }
        }
        
    },

    address: {
        streetAddress: {
            type: String,
            required: true,
            trim: true,
            lowercase: true

        },
        streetAddress2: {
            type: String,
            trim: true,
            lowercase: true

        },
        city: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        state: {
            type: String,
            uppercase: true,
            required: true,
            enum: statesArray
        },
        zipCode: {
            type: String,
            required: true,
            trim: true,
            validate(value)  {
                zipExpression = /^[0-9]{5}(?:[-/s][0-9]{4})?$/;

                if (!zipExpression.test(value)) {
                    throw new Error('Zip code is invalid')
                }
            }
            
        }

    },

    location: {
        type: { type: String, default: 'Point'},
        coordinates: {
            type: [Number]
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
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

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

userSchema.index({ location: "2dsphere" })

const User = mongoose.model('User', userSchema)

module.exports = User