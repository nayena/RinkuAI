/**
 * server is the one that runs the app and connects it to the ports and the incomming variables
 */
require ("dotenv").config(); 
const express  = require("express");
const mongoose = require("mongoose");
const cors = require("cors") ; 

const errorHandler= require("./middlewares/errorHandler.js"); 
const healthRouter=  require("./routes/health.routes.js") ; 
const peopleRouter = require("./routes/people.routes.js"); 
const speechRouter = require("./routes/speech.routes.js"); 

const App = express() ; 
//middleware 
App.use(cors());
App.use(express.json());

//routes 

App.use("/heath", healthRouter) ; 
App.use("/people",peopleRouter);
App.use("/speech", speechRouter); 
App.use(errorHandler); 

//connect to mongoDB and start server
const PORT = process.env.PORT || 4000
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MONGO DB");
        App.listen(PORT, () =>{
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((err) =>{
        console.log("Failed to Connect to MongoDB" , err) 
    }) ;