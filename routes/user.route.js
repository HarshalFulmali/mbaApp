const userController = require('../controllers/user.controller');
const authValidator = require('../validators/auth.validator');
const userValidator = require('../validators/user.validator');

module.exports = (app)=>{
    app.get("/mba/api/v1/user",[authValidator.tokenVerify, authValidator.isAdmin], userController.getAllUsers);
    app.get("/mba/api/v1/user/:id",[authValidator.tokenVerify, authValidator.isAdminOrUser, userValidator.idParamsVerify], userController.getUserById);
    app.put("/mba/api/v1/updateStatus/:id",[authValidator.tokenVerify, authValidator.isAdmin, userValidator.idParamsVerify], userController.updateStatus);
    app.put("/mba/api/v1/updatePassword/:id",[authValidator.tokenVerify, authValidator.isAdminOrUser, userValidator.idParamsVerify], userController.updatePassword);
    app.put("/mba/api/v1/updateProfile/:id",[authValidator.tokenVerify, authValidator.isAdminOrUser, userValidator.idParamsVerify, userValidator.updateProfileVerify], userController.updateProfile);
    app.put("/mba/api/v1/updateUserId/:id",[authValidator.tokenVerify, authValidator.isAdmin, userValidator.idParamsVerify, userValidator.userIdVerify], userController.updateUserId);
}