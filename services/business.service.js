const {Business} = require('./../models');

module.exports = {
  findBusinessByName: (name) => Business.findOne({where: {name}}),
  findBusinessById: (id) => Business.findOne({where: {id}})
}