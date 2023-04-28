const Users = require('../models/user.model');
const {UserTypes, UserStatus} = require('../utils/constants');
const sendMail = require('../utils/mail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');

async function signUp(req, res) {
    let userstatus = UserStatus.approved;
    if(req.body.userType && req.body.userType != UserTypes.customer) {
        userstatus = UserStatus.pending
    }

    const userObj = {
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        password: bcrypt.hashSync(req.body.password,8),
        userType:req.body.userType,
        userStatus: userstatus
    }

    try{
        const user = await Users.create(userObj);

        const body={
            name:user.name,
            email:user.email,
            userId:user.userId,
            msg:'User has been created successfully'
        };

        await sendMail(`user ${user.name} is created`,JSON.stringify(body),user.email);
        res.status(201).send({
            msg:'User has been created successfully'
        });
    }
    catch(error) {
        res.status(400).send({
            msg:'User have not been created successfully'
        });
    }
}

async function signIn(req, res) {
    const user = await Users.findOne({
        userId:req.body.userId
    });

    if(!user) {
        return res.status(400).send({
            msg:'userId/password does not match in db'
        });
    }

    let isPassword = bcrypt.compareSync(req.body.password, user.password);

    if(!isPassword){
        return res.status(400).send({
            msg:'userId/password does not match in db'
        });
    }

    let token = jwt.sign({userId:user.userId, userType:user.userType, userStatus:user.userStatus, _id:user._id},
        authConfig.secret,{expiresIn:86400});

    let responseObj = {
        id:user._id,
        token: token
    }   

    res.status(200).send({
        msg:'user login successfully',
        responseObj
    });

}

module.exports = {
    signUp,
    signIn
}