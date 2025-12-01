const { Router } = require('express');
const PeopleController = require('../controllers/people.controller');
const { validate } = require('../middlewares/validate');
const { CreatePersonDTO, UpdatePersonDTO, ParamIdDTO } = require('../modules/people/people.types');

const peopleRouter = Router();

peopleRouter.post('/', validate(CreatePersonDTO), PeopleController.create);
peopleRouter.get('/', PeopleController.list);
peopleRouter.get('/:id', validate(ParamIdDTO), PeopleController.get);
peopleRouter.put('/:id', validate(UpdatePersonDTO), PeopleController.update);
peopleRouter.delete('/:id', validate(ParamIdDTO), PeopleController.remove);

module.exports = peopleRouter;

