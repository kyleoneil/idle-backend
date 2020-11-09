const {User, Role} = require('./../models');
const bcrypt = require('bcrypt');
const {saltRounds} = require('./../config/config');

const findByEmail = (email, loadRole = false) => {
  const findOptions = {where: {email}};
  if (loadRole) {
    findOptions.include = Role;
  }
  return User.findOne(findOptions)
};

module.exports = {
  /**
   *
   * @param {{firstname:string, lastname:string, birthdate:string, email:string,password:string}} body
   */
  create: async (body) => {
    const copy = {...body};
    copy.birthdate = new Date(body.birthdate);
    copy.password = bcrypt.hashSync(body.password, saltRounds)
    const user = await User.create(copy);
    return user.id;
  },
  userExists: async (email) => {
    const user = await findByEmail(email);
    return !!user; // or user != null
  },
  findById: async (id) => {
    const user = await User.findByPk(id);
    delete user.password; // Remove password prior to returning the user
    return user;
  },
  findByEmail,
  /**
   *
   * @param pageNo
   * @param resultsPerPage
   * @returns {Promise<{totalRecords: number, data: [{}]}>}
   */
  findPaginated: async (pageNo = 1, resultsPerPage = 10) => {
    // TODO: Implement this. Note: make sure password is removed prior to return
    return {
      totalRecords: 0,
      data: [{}]
    }
  }
}