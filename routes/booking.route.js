const bookingController = require('../controllers/booking.controller');
const {createBookingValidator, validBookingUser} = require('../validators/booking.validator');
const {tokenVerify, isAdmin, isAdminOrUser} = require('../validators/auth.validator')

module.exports = (app)=>{

    app.get("/mba/api/v1/bookings",[tokenVerify],bookingController.getAllBooking);
    app.get("/mba/api/v1/bookings/:id",[tokenVerify, validBookingUser],bookingController.getBookingById);
    app.put("/mba/api/v1/bookings/:id",[tokenVerify, validBookingUser],bookingController.updateBooking)
    app.post("/mba/api/v1/bookings",[tokenVerify, createBookingValidator],bookingController.createBooking)
}