const ObjectId = require('mongoose').Types.ObjectId;
const Theatre = require('../models/theatre.model');
const { UserTypes, UserStatus } = require('../utils/constants');
const Booking = require('../models/booking.model');


async function createBookingValidator(req, res, next) {
    if(!req.body.theatreId){
        return res.status(400).send({
            msg:"theatreId is required"
        })
    }

    if(!ObjectId.isValid(req.body.theatreId)){
        return res.status(400).send({
            msg:"theatreId formate is not correct"
        })
    }

    const theatre = await Theatre.findOne({
        _id:req.body.theatreId
    });

    if(!theatre) {
        return res.status(400).send({
            msg:"This theatre is not present in DB"
        })
    }

    if(!req.body.movieId){
        return res.status(400).send({
            msg:"movieId is required"
        })
    }
    if(!ObjectId.isValid(req.body.movieId)){
        return res.status(400).send({
            msg:"movieId formate is not correct"
        })
    }

    if(!theatre.movies.includes(req.body.movieId)) {
        return res.status(400).send({
            msg:`this movieId ${req.body.movieId} doesn't exists in this theatreId ${req.body.theatreId}`
        })
    }

    if(!req.body.timing) {
        return res.status(400).send({
            msg:"timing is required"
        })
    }

    if(!req.body.noOfSeats){
        return res.status(400).send({
            msg:"noOfSeats is required"
        })
    }

    next();
}


async function validBookingUser(req, res, next) {

    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            msg:"movieId formate is not correct"
        })
    }
    const booking = await Booking.findOne({
        _id:req.params.id
    })
    if((req.userType == UserTypes.admin || req.id == booking.userId) && req.userStatus == UserStatus.approved){
        next();
    }
    else{
        return res.status(401).send({msg:"you can't access this api"})
    }
}

module.exports = {
    createBookingValidator,
    validBookingUser
}

