const { PersonModel } = require('../../db/models/Person');

const PeopleRepo = {
    create: (data) => PersonModel.create(data),
    list: () => PersonModel.find().sort({ createdAt: -1 }),
    get: (id) => PersonModel.findById(id),
    update: (id, data) =>  PersonModel.findByIdAndUpdate(id, data, { new: true }),
    remove: (id) => PersonModel.findByIdAndDelete(id),
};

module.exports = PeopleRepo;