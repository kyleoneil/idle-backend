const pool = require('./../../db');

module.exports = {
    getServiceDetails: (id, cb) => {
        pool.query(
            `SELECT s.name, s.last_in_queue, s.current_queue, br.name, bs.name FROM services AS s INNER JOIN branches AS br ON s.branch_id = br.id INNER JOIN businesses AS bs ON br.business_id = bs.id WHERE s.id = ?`,
          [id],
          (err, res, fields) => {
            if (err) {
              cb(err);
            }
            return cb(null, res[0]);
          }
        )
      },
      getQueue:(id,cb)=>{
        pool.query('SELECT  from services',
          [id],
          (err,res,fields)=>{
            if (err) {
              cb(err);
            }
            return cb(null, res[0]);
          }
        )
      }
};