const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    description:{
        type:String,
        required: true
    },
    casts:{
        type:[String],
        require: true
    },
    trailerUrl :{
        type: String,
        required: true

    },
    posterUrl :{
        type: String,
        required: true

    },
    language :{
        type : String,
        required :true,
        default: "Hindi"

    },
    releaseDate :{
        type: String,
        required :true

    },
    director : {
        type: String,
        required :true
    },
    releaseStatus : {
        type : String,
        required : true,
        default : "RELEASED"
        //Other possible values could be UNRELEASED | BLOCKED
    },
    updatedAt: {
        type: Date,
        default: () => {
            return Date.now();
        }
    }  

});

const movieModel = mongoose.model('Movie',moviesSchema);
module.exports = movieModel;