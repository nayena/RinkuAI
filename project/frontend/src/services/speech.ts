/**
 * SpeechAPI is a moduled desined to handle all the speech feature of the backend
 */
import{API } from "./api";  

export const SpeechAPI = {
    relationshipUrl: async(personId :string): Promise<string> =>{

        const {data} = await API.post("/speech/relationship", { personId});
       //data.url is a relative path on backend; build absolute
        const base = API.defaults.baseURL!.replace(/\/$/, "") ; 
        return `${base}${data.url}`; 

    },
};