const pool = require('./../../db');

module.exports = {
  create: (data, cb) => {
    pool.query(
        `INSERT INTO users(email, password, name, birthdate, role_id) 
            VALUES (?,?,?,?,?)`,
      [
        data.email,
        data.password,
        data.username,
        data.dob,
        data.role
      ],
      (error, res, fields) => {
        if (error) {
          return cb(error);
        }
        return cb(null, res);
      }
    );
  },
  getUsers: cb => {
    pool.query(
        `SELECT * FROM users `,
      [],
      (err, res, fields) => {
        if (err) {
          return cb(err);
        }
        return cb(null, res);
      }
    )
  },
  getUserByUserId: (id, cb) => {
    pool.query(
        `SELECT * FROM users WHERE id = ?`,
      [id],
      (err, res, fields) => {
        if (err) {
          cb(err);
        }
        return cb(null, res[0]);
      }
    )
  },
  updateUser: (data, cb) => {
    pool.query(
        `UPDATE users SET email=?, password=?, name=?, birthdate=?, role_id=? WHERE id = ?`,
      [
        data.email,
        data.password,
        data.username,
        data.dob,
        data.role,
        data.id
      ],
      (err, res, fields) => {
        if (err) {
          cb(err);
        }
        return cb(null, res[0]);
      }
    )
  },
  deleteUser: (data, cb) => {
    pool.query(
        `DELETE FROM users WHERE id = ?`,
      [data.id],
      (err, res, fields) => {
        if (err) {
          cb(err);
        }
        return cb(null, res[0]);
      }
    )
  },
  getUserByUserEmail: (email, cb) => {
    pool.query(
        `SELECT * FROM users WHERE email = ?`,
      [email],
      (err, result, fields) => {
        if (err) {
          cb(err);
        }
        return cb(null, result[0]);
      }
    )
  }
};
