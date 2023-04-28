const {paymentCreateVerify, validPaymentUser} = require('../validators/payment.validator');
const {tokenVerify} = require('../validators/auth.validator');
const { createPayment, getAllPayment, getPaymentById} = require('../controllers/payment.controller');

module.exports = (app)=>{
    app.post("/mba/api/v1/payment",[tokenVerify,paymentCreateVerify],createPayment);
    app.get("/mba/api/v1/payment/:id",[tokenVerify,validPaymentUser],getPaymentById);
    app.get("/mba/api/v1/payment",[tokenVerify],getAllPayment);
}