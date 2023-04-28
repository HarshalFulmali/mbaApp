const mongoose = require('mongoose');
const { UserTypes, UserStatus } = require('../utils/constants')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    userId:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    userType:{
        type:String,
        required: true,
        default: UserTypes.customer
    },
    userStatus:{
        type:String,
        required: true,
        default: UserStatus.approved
    },
    createdAt:{
        type:Date,
        immutable: true,
        required:true,
        default: ()=>Date.now()
    },
    updatedAt:{
        type:Date,
        required:true,
        default: ()=>Date.now()
    }
})

module.exports = mongoose.model('Users', userSchema);