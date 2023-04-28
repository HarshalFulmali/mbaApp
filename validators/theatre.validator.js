const Theatre = require('../models/theatre.model');


const createTheatreVerify = (req, res, next) =>{
    if(!req.body.name) {
        return res.status(400).send({
            message:'name feild is missing in theatre creations'
        })
    }

    if(!req.body.description) {
        return res.status(400).send({
            message:'description feild is missing in theatre creations'
        })
    }

    if(!req.body.city) {
        return res.status(400).send({
            message:'city feild is missing in theatre creations'
        })
    }

    if(!req.body.pinCode) {
        return res.status(400).send({
            message:'pinCode feild is missing in theatre creations'
        })
    }

    next();
}

const theatreIdVerify = async(req, res, next)=>{
    try{
        if(req.params.theatreId){
            var theatre = await Theatre.findById({
                _id:req.params.theatreId
            });
        }
        if(req.params.id){
            var theatre = await Theatre.findById({
                _id:req.params.id
            });
        }
        
        if(!theatre){
            return res.status(400).send({
                message:`Theatre is not present with ${req.params.id} id`
            })
        }
        next();
    }
    catch(error){
        res.status(500).send({message:"Internal server error"});
    }
}

module.exports = {
    createTheatreVerify,
    theatreIdVerify
}