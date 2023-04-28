const Movies = require('../models/movies.model');
const { ReleaseSatus } = require('../utils/constants')

const createMovieValidator = (req, res, next)=>{
    if(!req.body.name){
        return res.status(400).send({
            message:'name feild is missing in movie creations'
        });
    }

    if(!req.body.releaseDate) {
        return res.status(400).send({
            message:'releaseDate feild is missing in movie creations'
        });
    }

    if(!req.body.director) {
        return res.status(400).send({
            message:'director feild is missing in movie creations'
        });
    }

    const defaultReleaseStatus = [ReleaseSatus.released, ReleaseSatus.unreleased, ReleaseSatus.blocked];
    const tempStatus = defaultReleaseStatus.includes(req.body.releaseStatus);
    if(!tempStatus) {
        return res.status(400).send({
            message:`releaseStatus should be among ${defaultReleaseStatus}`
        })
    }
    next();
}

const idValidateor = async (req, res, next)=>{
    try{
        if(req.params.movieId){
            var movie = await Movies.findById({
                _id:req.params.movieId
            })
        }
        
        if(req.params.id){
            var movie = await Movies.findById({
                _id:req.params.id
            })
        }
    
        if(!movie) {
            return res.status(400).send({message:`No movie is available with id ${req.params.id}`});
        }
    
        next();
    }
    catch(error) {
        res.status(500).send({message:"Internal server error"});
    }

}

const releaseSatusValidator = (req, res, next)=>{
    const defaultReleaseStatus = ["UNRELEASED","RELEASED","STATUS"];
    const tempStatus = defaultReleaseStatus.includes(req.body.releaseStatus);
    if(!tempStatus) {
        return res.status(400).send({
            message:`releaseStatus should be among ${defaultReleaseStatus}`
        })
    }
    next();
}

module.exports = {
    createMovieValidator,
    idValidateor,
    releaseSatusValidator
}