/**
 * All Mongo I/O for people Funtions: create(data), list(), get(id), update(id,data), remove(id)
 */
import {PeopleRepo} from "./people.repo.js"; 
export const PeopleService = {
    async create(input){
        return PeopleRepo.create(input);
    },
    async list(){
        return PeopleRepo.list();
    },
    async getOrThrow(id){
        const p = await PeopleRepo.get(id); 
        if (!p) throw {
            status: 404, 
            message: "Person not found",
        };
        return p ; 
    },
    async update (id,input) { return PeopleRepo.update(id, input);
     },
    async remove(id){
        return PeopleRepo.remove(id); 
    }
}; 