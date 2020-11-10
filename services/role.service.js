const {Role} = require('./../models');

module.exports = {
  findByName: (name) => Role.findOne({where: {name}})
}