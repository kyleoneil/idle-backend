const {Business} = require('./../models');

module.exports = {
  findBusiness: (name) => Business.findOne({where: {name}})
}