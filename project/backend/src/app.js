/**
 * This is the core app and server. Imports all the routes and creates the  path/ routes
 * CORS =  cross-origin resource sharing
 */

import express from  "express" ; 
import cors from "cors";
import {errorHandler} from "./middlewares/errorHandler.js"
import {healthRouter} from "./modules/health/health.routes.js" ; 
import {peopleRouter} from  "./modules/people/people.routes.js"; 
import {speechRouter} from "./modules/speech/speech.routes.js"; 

export function createApp() {

    const app = express(); 
    app.use(cors()) ; //middle
    app.use(express.json());  //middleware

    app.use("/heath", healthRouter) ; 
    app.use("/people",peopleRouter);
    app.use("/speech", speechRouter); 

    app.use(errorHandler); 
    return app;
}

