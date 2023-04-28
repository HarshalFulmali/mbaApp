const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator')

module.exports = (app)=>{
    app.post("/mba/api/v1/signup",[authValidator.singUpVerify], authController.signUp);
    app.post("/mba/api/v1/signin",[authValidator.signInVerify], authController.signIn);
}