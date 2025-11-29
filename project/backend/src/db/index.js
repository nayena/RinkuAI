import mongoose from "mongoose";

export async function connectMongo(uri) {
    await mongoose.connect(uri);
    console.log("Mongo connected");
} 
