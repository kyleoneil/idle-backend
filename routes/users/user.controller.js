const { create, getUserByUserId, getUsers, updateUser, deleteUser, getUserByUserEmail } = require('./user.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

let errorMsg = {};

module.exports = {
    createUser: (req, res) => {
        let user = req.body;
        let salt = bcrypt.genSaltSync(saltRounds);
        user.password = bcrypt.hashSync(user.password, salt);
        create(user, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "DB Connection error."
                })
            }
            return res.status(200).json({
                success: 1,
                data: results
            })
        })
    },
    getUserByUserId: (req, res) => {
        let id = req.params.id;
        getUserByUserId(id, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }else if (!result) {
                return res.json({
                    success: 0,
                    message: "Record Not Found"
                });
            }else{
                return res.json({
                    success: 1,
                    data: result
                })
            }
        });
    },
    getUsers: (req, res) => {
        getUsers((err, result) => {
            if(err){
                console.log(err);
                return;
            }else{
                return res.json({
                    success: 1,
                    data: result
                })
            }
        })
    },
    updateUser: (req, res) => {
        let user = req.body;
        let salt = bcrypt.genSaltSync(saltRounds);
        user.password = bcrypt.hashSync(user.password, salt);
        updateUser(user, (err, result) => {
            if(err) {
                console.log(err);
                return false;
            // }else if(!result){
            //     return res.json({
            //         success: 0,
            //         message: "User update failed."
            //     });
            }else{
                return res.json({
                    success: 1,
                    message: "User Updated!"
                });
            }
        });
    },
    deleteUser: (req, res) => {
        let data = req.body;
        deleteUser(data, (err, result) => {
            if(err){
                console.log(err);
                return;
            }else if(!result){
                return res.json({
                    success: 0,
                    message: "Record Not Found."
                });
            }else{
                return res.json({
                    success: 1,
                    message: "User Record Deleted!"
                })
            }
        })
    },
    login: (req, res) => {
        let jsonToken = "";
        let user = req.body;
        getUserByUserEmail(user.email, (err, result) => {
            if(err){
                console.log(err);
            }else if (!result){
                return res.json({
                    success: 0,
                    data: "Invalid Email or Password. 1"
                });
            }else{
                let sqlRes = bcrypt.compareSync(user.password, result.password);
                if(sqlRes) {
                    result.password = undefined;
                        jsonToken = jwt.sign({result: result}, process.env.SECRET_KEY, {
                        expiresIn: "3h"
                    });
                    return res.json({
                        success: 1,
                        data: "Successfully logged in",
                        token: jsonToken,
                    });
                }else{
                    return res.json({
                        success: 0,
                        data: "Invalid Email or Password.2",
                    });
                }
                
            }
        });
    }
}
