const Users = require('../models/user.model');
const bcrypt = require('bcrypt');
const { UserStatus } = require('../utils/constants');
const sendMail = require('../utils/mail');

async function getAllUsers(req, res){
    try{
        const users = await Users.find({});
        res.status(200).send(users);
    }
    catch(error) {
        res.status(500).send({msg:'Internal server error'});
    }
}

async function getUserById(req, res){
    try{
        const user = await Users.findOne({
            _id:req.params.id
        });
        if(!user){
            return res.status(400).send({msg:`user is not present with ${req.params.id} id`});
        }
        res.status(201).send(user);
    }
    catch(error) {
        res.status(500).send({msg:'Internal server error'});
    }
}

async function updateStatus(req, res){
    try{
     await Users.findOneAndUpdate({
            _id:req.params.id
        },{
            userStatus : req.body.userStatus
        }).exec();

        res.status(201).send({
            success : true,
            msg:'Status updated successfully'
        })
    }
    catch(error) {
        res.status(500).send({msg:'Internal server error'});
    }
}

async function updateUserId(req, res){
    try{
     await Users.findOneAndUpdate({
            _id:req.params.id
        },{
            userId : req.body.userId
        }).exec();

        res.status(201).send({
            success : true,
            msg:'UserId updated successfully'
        })
    }
    catch(error) {
        res.status(500).send({msg:'Internal server error'});
    }
}

async function updatePassword(req, res) {
    try{
        await Users.findOneAndUpdate({
            _id:req.params.id
        },{
            password:bcrypt.hashSync(req.body.password, 8)
        }).exec()

        
        res.status(201).send({
            success : true,
            msg:'Password updated successfully'
        })
    }
    catch(error) {
        res.status(500).send({msg:'Internal server error',error});
    }
}

async function updateProfile(req, res) {
    try{
        let savedUser = await Users.findOne({
            _id:req.params.id
        });

        savedUser.name = req.body.name ? req.body.name : savedUser.name;
        savedUser.email = req.body.email ? req.body.email : savedUser.email;
        savedUser.userType = req.body.userType ? req.body.userType : savedUser.userType;

        const updatedUser = await savedUser.save()

        await sendMail(`${updatedUser.name} your profile is updated`,
        JSON.stringify({name:updatedUser.name,email:updatedUser.email,userType:updatedUser.userType}),
        updatedUser.email);
        res.status(201).send({
            success : true,
            msg:'Profile updated successfully'
        })
    }
    catch(error) {
        res.status(500).send({msg:'Internal server error'});
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateStatus,
    updatePassword,
    updateProfile,
    updateUserId
}