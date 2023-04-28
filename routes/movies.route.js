const movieController = require('../controllers/movies.controller');
const movieValidator = require('../validators/movies.validator');
const authValidator = require('../validators/auth.validator')

module.exports = (app)=>{

    app.get("/mba/api/v1/movies",[],movieController.getAllMovies);
    app.get("/mba/api/v1/movies/:id",[],movieController.getMovieById);
    app.post("/mba/api/v1/movies",[authValidator.tokenVerify, movieValidator.createMovieValidator], movieController.createMovie);
    app.put("/mba/api/v1/movies/:id",[authValidator.tokenVerify, movieValidator.idValidateor, movieValidator.releaseSatusValidator],
    movieController.updateMovie);
    app.delete("/mba/api/v1/movies/:id",[authValidator.tokenVerify, movieValidator.idValidateor], movieController.deleteMovie);
}