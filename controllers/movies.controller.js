const Movies = require('../models/movies.model');


const getAllMovies = async(req,res)=>{
    
    try{
        const reqObject = {};
        if(req.query.name) {
            reqObject.name = req.query.name
        }
        const movies = await Movies.find(reqObject);

        res.send(movies);
    }
    catch(error){
        console.log("error occured while fetching movies",error);
        res.status(500).send({message:"Internal server error"});
    }
}

const getMovieById = async(req, res)=>{
    try{
        const movie = await Movies.findById({
            _id:req.params.id
        })

        if(!movie) {
            return res.status(400).send({message:`No movie is available with id ${req.params.id}`});
        }

        res.status(200).send(movie);
    }
    catch(error) {
        console.log(`error occured while fetching movie by id ${req.params,id}`+error);
        res.status(500).send({message:"Internal server error"});
    }
}

async function createMovie(req, res){
    

    try{
        const movie = await Movies.create({
            name :req.body.name,
            description :req.body.description,
            casts :req.body.casts,
            trailerUrl :req.body.trailerUrl,
            posterUrl :req.body.posterUrl,
            language :req.body.language,
            releaseDate :req.body.releaseDate,
            director : req.body.director,
            releaseStatus : req.body.releaseStatus
        })

        res.status(201).send(movie);
    }
    catch(error) {
        res.status(500).send({message:"Internal server error"});
    }
}

async function updateMovie(req, res) {
    try{
        const savedMovie = await Movies.findOne({
            _id:req.params.id
        });

        savedMovie.name = req.body.name ?  req.body.name: savedMovie.name; 
        savedMovie.description = req.body.description ?  req.body.description : savedMovie.description; 
        savedMovie.casts = req.body.casts != undefined ? req.body.casts : savedMovie.casts;
        savedMovie.director = req.body.director != undefined ? req.body.director : savedMovie.director;
        savedMovie.trailerUrl = req.body.trailerUrl != undefined ? req.body.trailerUrl : savedMovie.trailerUrl;
        savedMovie.posterUrl = req.body.posterUrl != undefined ? req.body.posterUrl : savedMovie.posterUrl;
        savedMovie.language = req.body.language != undefined ? req.body.language : savedMovie.language;
        savedMovie.releaseDate = req.body.releaseDate != undefined ? req.body.releaseDate : savedMovie.releaseDate;
        savedMovie.releaseStatus = req.body.releaseStatus != undefined ? req.body.releaseStatus : savedMovie.releaseStatus;

        const updatedMovie = await savedMovie.save();
        res.status(201).send(updatedMovie)
    }
    catch(error) {
        res.status(500).send({message:"Internal server error"});
    }
}

async function deleteMovie(req, res) {
    try{
        await Movies.deleteOne({
            _id:req.params.id
        });
        res.status(200).send({message:`Movie deleted successfully by id ${req.params.id}`});
    }
    catch(error) {
        res.status(500).send({message:"Internal server error"});
    }
}

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
}