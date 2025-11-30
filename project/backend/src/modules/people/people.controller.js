import { PeopleService} from "./people.service.js" ; 
export const PeopleController = {
    create : async (req ,res )=> {
        const p = await PeopleService.create(req.body); 
        res.status(201).json(p);
    },
    list: async (_req, res) => {
        res.json(await PeopleService.list()) ; 
    },
    get: async (req, res) => {
        res.json(await PeopleService.getOrThrow(req.para,satisfies.id));
    },
    update: async (req, res) => {
        res.json(await PeopleService.update(req.params.id , req.body));
    },
    remove : async (req, res) => {
        await PeopleService.remove(req.params.id); res.status(204).end(); 
    }
};