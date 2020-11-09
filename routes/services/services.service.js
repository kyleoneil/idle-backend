const pool = require('./../../db');

module.exports = {
    getServiceDetails: (id, cb) => {
        pool.query(
            `SELECT BS.name AS business_name, BR.name AS branch_name, S.name AS service_name, S.last_in_queue, S.current_queue FROM services S 
            INNER JOIN branches BR ON S.branch_id = BR.id 
            INNER JOIN businesses BS ON BR.business_id = BS.id WHERE S.id=?`,  
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
        pool.query('SELECT * from services',
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
