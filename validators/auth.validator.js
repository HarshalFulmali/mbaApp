const Users = require('../models/user.model');
const Theatre = require('../models/theatre.model');
const { UserTypes, UserStatus } = require('../utils/constants');
const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');

async function singUpVerify(req, res, next) {
    if(!req.body.name) {
        return res.status(400).send({msg:'name feild is missing in signUp'});
    }
    if(!req.body.userId) {
        return res.status(400).send({msg:'userId feild is missing in signUp'});
    }
    if(!req.body.email) {
        return res.status(400).send({msg:'email feild is missing in signUp'});
    }
    if(!req.body.password) {
        return res.status(400).send({msg:'password feild is missing in signUp'});
    }
    
  
    let avalableUserType = [UserTypes.admin, UserTypes.client, UserTypes.customer];
    let validUserType = avalableUserType.includes(req.body.userType)
    if(req.body.userType && !validUserType) {
        return res.status(400).send({msg:`userType should be among ${avalableUserType}`});
    }
    
    var user = await Users.findOne({
        userId:req.body.userId
    });
    if(user) {
        return res.status(400).send({msg:`userId = ${req.body.userId} alredy exists`});
    }

    user = await Users.findOne({
        email:req.body.email
    });

    if(user) {
        return res.status(400).send({msg:`eamil = ${req.body.email} alredy exists`});
    }

    next();
}

function signInVerify(req, res, next) {
    if(!req.body.userId) {
        return res.status(400).send({msg:'userId feild is missing in signUp'});
    }
    if(!req.body.password) {
        return res.status(400).send({msg:'password feild is missing in signUp'});
    }
    next();
}

async function tokenVerify(req, res, next){
    const token = req.headers['x-access-token'];
    if(!token){
        return res.status(400).send({msg:'token is not provided'});
    }

    try{
        const decoded = jwt.verify(token,authConfig.secret);
        if(!decoded){
            return res.status(400).send({msg:'token is not correct'});
        }

        req.id = decoded._id;
        req.userId = decoded.userId;
        req.userType = decoded.userType;
        req.userStatus = decoded.userStatus;

        next();
    }
    catch(error) {
        res.status(400).send({msg:'token is not correct'});
    }
}

function isAdmin(req, res, next) {
   
    if(req.userType != UserTypes.admin && req.userStatus == UserStatus.approved) {
        return res.status(400).send({msg:'you can not access this api'});
    }
    next();
}

function isAdminOrUser(req, res, next) {
    try{
        // const user = await Users.findOne({
        //     _id:req.params.id
        // });

        if(req.userType == UserTypes.admin || req.id == req.params.id)  {
            if(req.userStatus == UserStatus.approved) {
                next();
            }
            else{
                return res.status(400).send({msg:'you can not access this api'});
            }
           
            
        } else{
            return res.status(400).send({msg:'you can not access this api'});
        }
        
    }
    catch(error) {
        res.status(500).send({msg:'Internal server error'});
    }
}


async function isAdminOrOwner(req, res, next) {
    try{
        if(req.userStatus == UserStatus.approved && (req.userType == UserTypes.admin) || (req.userType ==UserTypes.client)) {
            let reqObject = {};
            if(req.userType == UserTypes.client) {
                reqObject.OwnerId = req.id
                
                const theater = await Theatre.findOne({
                    OwnerId: req.id,
                    _id:req.params.id
                })

                if(!theater){
                    return res.status(401).send({msg:`${req.id} user doesent have theatre `});
                }
            }

            next();
        } else{
            return res.status(401).send({msg:`${req.id} user doesent have theatre `});
        }
        
    }
    catch(error) {
        return res.status(500).send({msg:'internal server error'})
    }
}


module.exports = {
    singUpVerify,
    signInVerify,
    tokenVerify,
    isAdmin,
    isAdminOrUser,
    isAdminOrOwner
}