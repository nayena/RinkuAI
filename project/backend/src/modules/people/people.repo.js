/**
 * People repository - all MongoDB I/O for people
 */
import { PersonModel } from '../../db/models/Person.js';

const PeopleRepo = {
  create: (data) => PersonModel.create(data),
  list: () => PersonModel.find().sort({ createdAt: -1 }),
  get: (id) => PersonModel.findById(id),
  update: (id, data) => PersonModel.findByIdAndUpdate(id, data, { new: true }),
  remove: (id) => PersonModel.findByIdAndDelete(id),
};

export default PeopleRepo;
