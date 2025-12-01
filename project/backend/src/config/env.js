const dotenv = require('dotenv'); //this is used to read .env files
dotenv.config();

function required(name){
    const v = process.env[name];
    if(!v) throw new Error(`missing env var: ${name}`);
    return v ;
}

module.exports.env = {
    PORT : parseInt(process.env.PORT || "4000" , 10),
    MONGO_URL : required("MONGO_URL") ,
    ELEVEN_API_KEY : process.env.ELEVEN_API_KEY || "" , 
    ELEVEN_VOICE_ID : process.env.ELEVEN_VOICE_ID || ""
};
