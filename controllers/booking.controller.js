const {ticketCost, UserTypes} = require('../utils/constants');
const Booking = require('../models/booking.model');
const Users = require('../models/user.model');

async function createBooking(req, res){
    const bookingObj = {
        theatreId: req.body.theatreId,
        userId: req.id,
        movieId: req.body.movieId,
        timing: req.body.timing,
        noOfSeats: req.body.noOfSeats,
        totalCost: req.body.noOfSeats * ticketCost
    }

    try{
        const booking = await Booking.create(bookingObj);
        res.status(200).send(booking);
    }
    catch(error) {
        res.status(500).send({meg:"Internal server error"})
    }
}


async function getBookingById(req, res) {
    try{
        const bookingData = await Booking.findOne({
            _id:req.params.id
        })
        res.status(201).send(bookingData);
    }
    catch(error) {
        res.status(500).send({msg:"Internal server error"})
    }
}

async function updateBooking(req, res) {
    const booking = await Booking.findOne({
        _id: req.params.id
    })

    if(!booking) {
        res.status(400).send({
            msg:"Booking Id dose not exists"
        })
    }

    booking.theatreId = req.body.theatreId ? req.body.theatreId : booking.theatreId;
    booking.movieId = req.body.movieId != undefined ? req.body.movieId : booking.movieId;
    booking.userId = req.body.userId != undefined ? req.body.userId : booking.userId;
    booking.timing = req.body.timing != undefined ? req.body.timing : booking.timing;
    booking.status = req.body.status != undefined ? req.body.status : booking.status;
    booking.noOfSeats = req.body.noOfSeats != undefined ? req.body.noOfSeats : booking.noOfSeats;
    booking.totalCost = booking.noOfSeats * ticketCost;

    try{
        const updatedBooking = await booking.save();
        res.status(200).send(updatedBooking);
    }
    catch(error){
        res.status(500).send({msg:"Internal server error"});
    }
}

async function getAllBooking(req, res) {
    let tempQuery = {};
    const user = await Users.findOne({
        _id:req.id
    });

    if(user.userType !== UserTypes.admin){
        tempQuery.userId = req.id;
    }
    try{
        const booking = await Booking.find(tempQuery);
        res.status(201).send(booking);
    }
    catch(error){
        res.status(500).send({msg:"Internal server error"});
    }
}

module.exports = {
    createBooking,
    getBookingById,
    updateBooking,
    getAllBooking
}