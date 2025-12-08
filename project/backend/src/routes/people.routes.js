/**
 * People routes - CRUD for loved ones
 */
import { Router } from 'express';
import PeopleController from '../controllers/people.controller.js';
import { validate } from '../middlewares/validate.js';
import { CreatePersonDTO, UpdatePersonDTO, ParamIdDTO } from '../modules/people/people.types.js';

const peopleRouter = Router();

peopleRouter.post('/', validate(CreatePersonDTO), PeopleController.create);
peopleRouter.get('/', PeopleController.list);
peopleRouter.get('/:id', validate(ParamIdDTO), PeopleController.get);
peopleRouter.put('/:id', validate(UpdatePersonDTO), PeopleController.update);
peopleRouter.delete('/:id', validate(ParamIdDTO), PeopleController.remove);

export default peopleRouter;
