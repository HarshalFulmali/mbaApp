const theatreController = require('../controllers/theatre.controller');
const theatreValidator = require('../validators/theatre.validator');
const movieValidator = require('../validators/movies.validator');
const authValidator = require('../validators/auth.validator')


module.exports = (app)=>{
    app.get("/mba/api/v1/theatre", theatreController.getAllTheatre);
    app.get("/mba/api/v1/theatre/:id", theatreController.getTheatraById);
    app.post("/mba/api/v1/theatre", [authValidator.tokenVerify, theatreValidator.createTheatreVerify], theatreController.createTheatre);
    app.put("/mba/api/v1/theatre/:id", [authValidator.tokenVerify,  authValidator.isAdminOrOwner, theatreValidator.theatreIdVerify], theatreController.updateTheatre);
    app.delete("/mba/api/v1/theatre/:id", [authValidator.tokenVerify,  authValidator.isAdminOrOwner, theatreValidator.theatreIdVerify], theatreController.deleteTheatre);
    app.put("/mba/api/v1/theatre/:id/movies",[authValidator.tokenVerify,  authValidator.isAdminOrOwner, theatreValidator.theatreIdVerify], theatreController.updateMoviesInTheatre);
    app.get("/mba/api/v1/theatre/:theatreId/movies/:movieId",[theatreValidator.theatreIdVerify, movieValidator.idValidateor],
    theatreController.checkMovieInTheatre)
}