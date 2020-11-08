const { getServiceDetails ,getQueue} = require('./services.service');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const { checkToken } = require('../../auth/token_validation');

let errorMsg = {};

module.exports = {
    getServiceDetails: (req, res) => {
        let id = req.params.id;
        getServiceDetails(id, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }else if (!result) {
                return res.status(404).json({
                    success: 0,
                    message: "Not Found"
                });
            }else{
                return res.json({
                    success: 1,
                    data: result
                    
                })
            }
        });
       // }
    },
    getQueue: (req,res)=>(req, res) => {
        let id = req.params.id;
        getQueue(id, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }else if (!result) {
                return res.status(403).json({
                    success: 0,
                    message: "User is not authorized to get the list of queues."
                });
            }else{
                return res.json({
                    success: 1,
                    data: result
                })
            }
        });
        }

}