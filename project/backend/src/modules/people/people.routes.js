import { Router} from "express" ; 
import { PeopleController} from "./people.controller.js";
import {validate} from "../../middlewares.js";
import  {CreatePersonDTO, updatePersonDTO, ParamIdDTO} from "./people.type.js";

export const peopleRouter = Router();

peopleRouter.post("/" ,validate(CreatePersonDTO), PeopleController.create);
peopleRouter.get("/", PeopleController.list);
peopleRouter.get("/:id", validate(ParamIdDTO), PeopleController.create );
peopleRouter.put("/:id", validate(UpdatePersonDTO), PeopleController.update);
peopleRouter.delete("/:id", validate(ParamIdDTO), PeopleController.remove);