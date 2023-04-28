const Theatre = require('../models/theatre.model');
const Movie = require('../models/movies.model');
const Users = require('../models/user.model');
const sendMail = require('../utils/mail');
const createTheatre = async(req, res) =>{

    try{
        const theatre = await Theatre.create({
            name : req.body.name ,
            city : req.body.city,
            description : req.body.description ,
            pinCode : req.body.pinCode,
            OwnerId: req.body.OwnerId
        });

        const user = await Users.findOne({
            _id:theatre.OwnerId
        })

        await sendMail(`This theatre ${theatre.name} is available`,JSON.stringify(theatre),user.email);
        res.status(201).send(theatre)
    }
    catch(error) {
        res.status(500).send({message:'Internal server error'});
    }
    
}

const getAllTheatre = async(req, res)=>{
    try{
        let reqObject = {};
        if(req.query.name) {
            reqObject.name = req.query.name
        }
        if(req.query.city) {
            reqObject.city = req.query.city
        }
        if(req.query.pinCode) {
            reqObject.pinCode = req.query.pinCode
        }

        let theaters = await Theatre.find(reqObject);


        if(req.query.movieId) {
            theaters = theaters.filter(theater => theater.movies.includes(req.query.movieId));
        }
        // if(req.query.movieId){
        //     theaters = theaters.filter(theater =>{
        //         theater.movies.includes(req.query.movieId);
        //         console.log(theater.movies)
        //     })
        // }
        
        res.status(200).send(theaters);
    }
    catch(error) {
        console.log('error occured while fetching theatre',error);
        res.status(500).send({message:'Internal server error',error})
    }
}

const getTheatraById = async(req, res)=>{
    try{
        const theatre = await Theatre.findById({
            _id:req.params.id
        });

        if(!theatre) {
            return res.status(400).send({message:`No theatre is present by id ${req.params.id}`})
        }
        res.status(200).send(theatre);
    }
    catch(error) {
        res.status(500).send({message:'Internal server error'});
    }
}

const updateTheatre = async(req, res)=>{
    try{
        const savedTheatre = await Theatre.findById({
            _id: req.params.id
        });

        savedTheatre.name = req.body.name != undefined ? req.body.name : savedTheatre.name;
        savedTheatre.description = req.body.description != undefined ? req.body.description : savedTheatre.description;
        savedTheatre.city = req.body.city != undefined ? req.body.city : savedTheatre.city;
        savedTheatre.pinCode = req.body.pinCode != undefined ? req.body.pinCode : savedTheatre.pinCode;
        savedTheatre.OwnerId = req.body.OwnerId != undefined ? req.body.OwnerId : savedTheatre.OwnerId;

        const updatedTheatre = await savedTheatre.save();
        const user = await Users.findOne({
            _id:updatedTheatre.OwnerId
        })

        await sendMail(`This theatre ${updatedTheatre.name} is updated`,JSON.stringify(updatedTheatre),user.email);
        res.status(201).send(updatedTheatre);
    }
    catch(error) {
        res.status(500).send({message:'Internal server error'});
    }
}

const deleteTheatre = async (req, res)=>{
    

    try{
        await Theatre.deleteOne({
            _id:req.params.id
        });
        res.status(200).send({message:`Theatre deleted successfully with id ${req.params.id}`})
    }
    catch(error){
        res.status(500).send({message:'Internal server error'});
    }
}

const updateMoviesInTheatre = async(req, res)=>{
    try{
        let savedTheatre = await Theatre.findOne({
            _id:req.params.id
        });

        let movies = req.body.movieIds;

        if(req.body.insert) {
            movies.forEach(movieId => {
                savedTheatre.movies.push(movieId);
            });
        } else {
            // [1,2,3,4] savedThe ------>[1,2]
            // [3,4] movies
            movies.forEach(movieId =>{
                savedTheatre.movies = savedTheatre.movies.filter(elem => elem != movieId)
            })
        }

        const updatedTheatre = await savedTheatre.save();
        res.status(201).send(updatedTheatre);
    }
    catch(error) {
        res.status(500).send({message:'Internal server error'});
    }
}

async function checkMovieInTheatre(req, res){
    let savedTheatre = await Theatre.findOne({
        _id:req.params.theatreId
    })

    let movie = await Movie.findOne({
        _id:req.params.movieId
    });

    let response = {
        msg:''
    }

    if(savedTheatre.movies.includes(movie._id)){
        response.msg = 'Movie is running'
    }else{
        response.msg = 'Movie is not running'
    }

    res.send(response);
}

module.exports = {
    createTheatre,
    getAllTheatre,
    getTheatraById,
    updateTheatre,
    deleteTheatre,
    updateMoviesInTheatre,
    checkMovieInTheatre
}