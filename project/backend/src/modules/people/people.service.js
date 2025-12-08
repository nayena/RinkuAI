/**
 * People service - business logic for people operations
 */
import PeopleRepo from './people.repo.js';

const PeopleService = {
  async create(input) {
    return PeopleRepo.create(input);
  },

  async list() {
    return PeopleRepo.list();
  },

  async getOrThrow(id) {
    const person = await PeopleRepo.get(id);
    if (!person) {
      const err = new Error('Person not found');
      err.status = 404;
      throw err;
    }
    return person;
  },

  async update(id, input) {
    const person = await PeopleRepo.update(id, input);
    if (!person) {
      const err = new Error('Person not found');
      err.status = 404;
      throw err;
    }
    return person;
  },

  async remove(id) {
    return PeopleRepo.remove(id);
  },
};

export default PeopleService;
