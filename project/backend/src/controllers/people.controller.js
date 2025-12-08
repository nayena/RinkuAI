/**
 * People controller - handles HTTP request/response for people routes
 */
import PeopleService from '../modules/people/people.service.js';

const PeopleController = {
  async create(req, res, next) {
    try {
      const person = await PeopleService.create(req.body);
      res.status(201).json(person);
    } catch (err) {
      next(err);
    }
  },

  async list(_req, res, next) {
    try {
      const people = await PeopleService.list();
      res.json(people);
    } catch (err) {
      next(err);
    }
  },

  async get(req, res, next) {
    try {
      const person = await PeopleService.getOrThrow(req.params.id);
      res.json(person);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const person = await PeopleService.update(req.params.id, req.body);
      res.json(person);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await PeopleService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};

export default PeopleController;
