const {User, Role} = require('./../models');
const bcrypt = require('bcrypt');
const {saltRounds} = require('./../config/config');
const roleService = require('./role.service');
const {ROLE_CUSTOMER} = require('./../constants/user');

const findByEmail = (email, loadRole = false) => {
  const findOptions = {where: {email}};
  if (loadRole) {
    findOptions.include = Role;
  }
  return User.findOne(findOptions)
};

module.exports = {

  //CREATE Operations
  /**
   *
   * @param {{firstname:string, lastname:string, birthdate:string, email:string,password:string,roleName:string}} body
   */
  create: async (body) => {
    const roleName = body.roleName ? body.roleName : ROLE_CUSTOMER;
    const role = await roleService.findByName(roleName)
    const copy = {RoleId: role.id, BusinessId: body.business_id, BranchId: body.branch_id, ...body};
    copy.name = `${body.lastname}, ${body.firstname}`
    copy.birthdate = new Date(body.birthdate);
    copy.password = bcrypt.hashSync(body.password, saltRounds)
    const user = await User.create(copy);
    return user.id;
  },

  //READ Operations
  userExists: async (email) => {
    const user = await findByEmail(email);
    return !!user; // or user != null
  },

  findById: async (id) => {
    const user = await User.findOne({
      where: {id: id},
      attributes: {exclude: ['password']}
    });
    return user;
  },

  findByEmail,
  /**
   *
   * @param pageNo
   * @param resultsPerPage
   * @returns {Promise<{totalRecords: number, data: [{}]}>}
   */
  findPaginated: async (pageNo, resultsPerPage) => {
    // TODO: Implement this. Note: make sure password is removed prior to return
    // TODO Completed 
    const pageOffset = resultsPerPage * (pageNo - 1);
    const total_queue_records = await User.count();
    const userPaginated = await User.findAll({
      offset: pageOffset,
      limit: resultsPerPage,
      attributes: {exclude: ['password']}
    })
    return {
      totalRecords: total_queue_records,
      data: userPaginated
    }
  },

  //UPDATE Operations
  update: async (uID, data) => {
    /**
     * @type {{firstname:string, lastname:string, birthdate:string, email:string, password:string}}
     */

    const user = await User.findOne({where: {id: uID}});
    user.BusinessId = data.business_id;
    user.BranchId = data.branch_id;
    user.name = `${data.lastname}, ${data.firstname}`;
    user.birthdate = new Date(data.birthdate);
    user.password = bcrypt.hashSync(data.password, saltRounds);

    await user.save();

    return user.id;
  }
}