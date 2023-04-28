const express = require('express');
const mongoose = require('mongoose');

const serverConfig = require('./configs/server.config');
const dbConfig = require('./configs/db.config');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();

const Movies = require('./models/movies.model');
const Theatre = require('./models/theatre.model');
const Users = require('./models/user.model');
const {UserTypes} = require('./utils/constants')

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

(async ()=>{
    try{
        mongoose.connect(dbConfig.DB_URL);
        console.log("db connect");
        // await init();
    }
    catch(error) {
        console.error("error occured while connecting db",error);
    }
})()

async function init(){
    try{
        await Movies.collection.drop();
        const movie1 = await Movies.create({
            name: "Bachhan Pandey",
            description: "Comedy Masala Movie",
            casts: ["Akshay Kumar", "Jacqueline Fernandiz"],
            director: "Farhad Samji",
            trailerUrl: "http://bacchanpandey/trailers/1",
            posterUrl: "http://bacchanpandey/posters/1",
            language: "Hindi",
            releaseDate: "18-03-2022",
            releaseSatus: "RELEASED"
        });
        const movie2 = await Movies.create({
            name: "Jalsa",
            description: "Intense Drama Movie",
            casts: ["Vidya Balan", "Shefali Shah"],
            director: "Suresh Triveni",
            trailerUrl: "http://jalsa/trailers/1",
            posterUrl: "http://jalsa/posters/1",
            language: "Hindi",
            releaseDate: "18-03-2022",
            releaseSatus: "RELEASED"
        });
        const movie3 = await Movies.create({
            name: "Jhund",
            description: "Comedy Drama Movie",
            casts: ["Amitabh Bachchan", "Abhinay Raj"],
            director: "Nagraj Manjule",
            trailerUrl: "http://jhund/trailers/1",
            posterUrl: "http://jhund/posters/1",
            language: "Hindi",
            releaseDate: "04-03-2022",
            releaseSatus: "RELEASED"
        });
        const movie4 = await Movies.create({
            name: "Radhe Shyam",
            description: "Comedy Drama Movie",
            casts: ["Prabhas", "Pooja Hegde"],
            director: "Radha Krishna Kumar",
            trailerUrl: "http://RadheShyam/trailers/1",
            posterUrl: "http://RadheShyam/posters/1",
            language: "Hindi",
            releaseDate: "11-03-2022",
            releaseSatus: "RELEASED"
        });
        const movie5 = await Movies.create({
            name: "The Kashmir Files",
            description: "Intense Movie",
            casts: ["Mithun Chakraborty", "Anupam Kher"],
            director: "Vivek Agnihotri",
            trailerUrl: "http://TheKashmirFiles/trailers/1",
            posterUrl: "http://TheKashmirFiles/posters/1",
            language: "Hindi",
            releaseDate: "11-03-2022",
            releaseSatus: "RELEASED"
        });
        console.log("Movies inserted in the db");

        await Users.collection.drop();
        await Users.create({
            name:"admin",
            email:"admin@gmail.com",
            userId:"admin",
            password:bcrypt.hashSync("admin",8),
            userType:UserTypes.admin,
            userStatus:"APPROVED"
        })
        const client1 = await Users.create({
            name:"client1",
            email:"client1@gmail.com",
            userId:"client1",
            password:bcrypt.hashSync("admin",8),
            userType:UserTypes.client,
            userStatus:"APPROVED"
        });
        const client2 = await Users.create({
            name:"client2",
            email:"client2@gmail.com",
            userId:"client2",
            password:bcrypt.hashSync("admin",8),
            userType:UserTypes.client,
            userStatus:"APPROVED"
        });
       
        const client3 = await Users.create({
            name:"client3",
            email:"client3@gmail.com",
            userId:"client3",
            password:bcrypt.hashSync("admin",8),
            userType:UserTypes.client,
            userStatus:"APPROVED"
        })
        console.log("User created");


        await Theatre.collection.drop();
        await Theatre.create({
            name : "FunCinemas" ,
            city : "Bangalore",
            description : "Top class theatre" ,
            pinCode : 560052,
            movies:[movie1._id,movie3._id],
            OwnerId:client1._id
        });
        await Theatre.create({
            name : "PVR Cinemas - Kormangala" ,
            city : "Bangalore",
            description : "PVR franchise theatre" ,
            pinCode : 560095, 
            movies:[movie2._id,movie4._id],
            OwnerId:client2._id
        });
        await Theatre.create({
            name : "IMax" ,
            city : "Bangalore",
            description : "IMax franchise theatre" ,
            pinCode : 560095,
            movies:[movie2._id,movie5._id],
            OwnerId:client3._id
    
        });
        await Theatre.create({
            name : "Vaibhav Theatre" ,
            city : "Bangalore",
            description : "Economical theatre" ,
            pinCode : 560094,
            movies:[movie1._id,movie2._id],
            OwnerId:client2._id
    
        });
    
        await Theatre.create({
            name : "Inox" ,
            city : "Pune",
            description : "Top class theatre" ,
            pinCode : 411001,
            movies:[movie4._id,movie5._id],
            OwnerId:client1._id
    
        });
        await Theatre.create({
            name : "Sonmarg Theatre" ,
            city : "Pune",
            description : "Economical theatre" ,
            pinCode : 411042,
            movies:[movie1._id,movie4._id],
            OwnerId:client3._id
        });
    
        console.log("Theatres created");

        
    }
    catch(error) {
        console.log("Error occured while inserting default entery in db", error);
    }
}


require('./routes/auth.route')(app);
require('./routes/movies.route')(app);
require('./routes/theatre.route')(app);
require('./routes/user.route')(app);
require('./routes/booking.route')(app);
require('./routes/payment.route')(app);

app.listen(serverConfig.PORT, ()=>{
    console.log(`App is running on ${serverConfig.PORT}  http://localhost:${serverConfig.PORT}`);
})