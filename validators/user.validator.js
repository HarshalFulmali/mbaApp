const Users = require('../models/user.model');
const { UserStatus, UserTypes } = require('../utils/constants')

async function userStatusVerify(req, res, next) {
    try{
        

        if(user.userStatus != UserStatus.approved) {
            return res.status(400).send({msg:`${user.userId} user is not approved`});
        }
        next();
    }
    catch(error) {
        res.status(400).send({msg:'Internal server error'});
    }
}

function statusVerify(req, res, next) {
    const avaliableStatus = [UserStatus.approved, UserStatus.pending, UserStatus.rejected];
    let isStatusValid = avaliableStatus.includes(req.body.userStatus);
    if(!isStatusValid) {
        return res.status(400).send({msg:`userStatus should be amoung ${avaliableStatus}`}); 
    }
    next()
}

const isValidEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

async function userIdVerify(req, res, next) {
    const user = await Users.findOne({
        userId:req.body.userId
    })

    if(user) {
        return res.status(400).send({msg:`${req.body.userId} userId is not available`}); 
    }
    next();
}

async function updateProfileVerify(req, res, next) {
    const user = await Users.findOne({
        email:req.body.email
    })

    if(user) {
        return res.status(400).send({msg:`${req.body.email} email is not available`}); 
    }

    const availableUserType = [UserTypes.admin, UserTypes.client, UserTypes.customer];
    let isUserType = availableUserType.includes(req.body.userType)
    if(req.body.userType && (!isUserType)){
        return res.status(400).send({msg:`userType should be amoung ${availableUserType}`}); 
    }
    next();
}

async function idParamsVerify(req, res, next){
    const user = await Users.findOne({
        _id:req.params.id
    })

    if(!user) {
        return res.status(400).send({msg:`User is not available with ${req.params.id}`}); 
    }
    next(); 
}
module.exports = {
    userStatusVerify,
    userIdVerify,
    updateProfileVerify,
    idParamsVerify
}