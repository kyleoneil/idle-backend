
const {User, Role} = require('./../models');
const bcrypt = require('bcrypt');
const {saltRounds} = require('./../config/config');
const roleService = require('./role.service');
const { static } = require('express');

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
   * @param {{firstname:string, lastname:string, birthdate:string, email:string,password:string,roleName:string}} body
   */
  create: async (body) => {
    const roleName = body.roleName ? body.roleName : 'CUSTOMER';
    const role = await roleService.findByName(roleName)
    const copy = {RoleId: role.id, ...body};
    copy.name = `${body.lastname}, ${body.firstname}`
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
    const user = await User.findOne({
      where: {id: id},
      attributes: { exclude: ['password'] }
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
      attributes: { exclude: ['password'] }
    })
    return {
      totalRecords: total_queue_records,
      data: userPaginated
    }
  }
}