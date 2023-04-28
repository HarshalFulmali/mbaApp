const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');
const Users = require('../models/user.model');
const { UserTypes } = require('../utils/constants');
const sendMail = require('../utils/mail');

async function createPayment(req, res) {
    try{
        const booking = await Booking.findOne({
            _id: req.body.bookingId
        });

        const creationTime = booking.createdAt;
        const currentTime = Date.now();

        const minutes = Math.floor(((currentTime - creationTime)/1000)/60);

        if(minutes > 5) {
            booking.status = "EXPIRED";
            await booking.save();
            return res.status(400).send({
                msg:`Can't do the payment as the booking is delayed and expired`
            })
        } else{
            booking.status = "COMPLETED";
            await booking.save();

            const paymentObj = {
                bookingId: req.body.bookingId,
                amount: req.body.amount,
                status:"SUCCESS"
            }

            const payment = await Payment.create(paymentObj);

            const user = await Users.findOne({
                _id:req.id
            })

            const body = {
                paymentId:payment._id,
                paymentStatus: payment.status,
                
            }

            await sendMail(`Payment is successfully for ${payment.bookingId}`,JSON.stringify(body),user.email);

            return res.status(200).send({
                msg:"payment is done"
            })
        }
    }
    catch(error) {
        return res.status(500).send({
            msg:"payment creation failed",error
        })
    }
}

async function getPaymentById(req, res) {
    try{
        const payment = await Payment.findOne({
            _id:req.params.id
        })
        res.status(201).send(payment)
    }
    catch(error) {
        res.status(500).send({msg:"Internal server error"});
    }
}

async function getAllPayment(req, res) {
    let tempQuery = {}
    const user = await Users.findOne({
        _id: req.id
    });

    if(user.userType !== UserTypes.admin){
        const bookings = await Booking.find({
            userId: user._id
        })

        const bookingIds = bookings.map( a => a._id);
        // console.log('boookingiDs', bookingIds);
        tempQuery.bookingId = {$in: bookingIds }
    }

    try{
        const paymentData = await Payment.find(tempQuery);
        res.send({
            msg: "All Payments fetched successfully",
            paymentData
        })
    }
    catch(err){
        res.send({msg: 'get All booking api failed', err})
    }
}

module.exports = {
    createPayment,
    getPaymentById,
    getAllPayment
}