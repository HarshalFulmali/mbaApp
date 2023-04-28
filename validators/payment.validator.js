const ObjectId = require('mongoose').Types.ObjectId;
const Booking = require('../models/booking.model');
const Payment = require('../models/payment.model');
const { UserTypes,UserStatus } = require('../utils/constants');

async function paymentCreateVerify(req, res, next) {

    if(!req.body.bookingId) {
        return res.status(400).send({
            msg:"bookingId is required"
        })
    }

    if(!ObjectId.isValid(req.body.bookingId)){
        return res.status(400).send({
            msg:"bookingId formate is not correct"
        })
    }

    const booking = await Booking.findOne({
        _id:req.body.bookingId
    })

    if(!booking){
        return res.status(400).send({
            msg:`This Booking doesn't exists in DB`
        })
    }

    if(req.body.amount != booking.totalCost) {
        return res.status(400).send({
            msg:`Please enter correct amount whis is ${booking.totalCost}`
        })
    }

    next();
}

async function validPaymentUser(req, res, next) {

    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            msg:"paymentId formate is not correct"
        })
    }
    const payment = await Payment.findOne({
        _id:req.params.id
    });

    const booking = await Booking.findOne({
        _id:payment.bookingId
    })
    if((req.userType == UserTypes.admin || req.id == booking.userId) && req.userStatus == UserStatus.approved){
        next();
    }
    else{
        return res.status(401).send({msg:"you can't access this api"})
    }
}

module.exports = {
    paymentCreateVerify,
    validPaymentUser
}