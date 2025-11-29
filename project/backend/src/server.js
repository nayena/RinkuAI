/**
 * server is the one that runs the app and connects it to the ports and the incomming variables
 */
import {createApp} from "./app.js"; 
import {env} from "./config/env.js" ; 
import {connectMongo} from  "./db/index.js";

async function main(){
    await connectMongo(env.MONGO_URL); 
    const app = createApp(); 
    app.listen(env.PORT, () => {
        console.log(`App listening on ${env.PORT}`);

    });
}

main().catch((e) => {
    console.error("Fatal", e);
    process.exit(1)
}); 
