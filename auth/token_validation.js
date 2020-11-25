const e = require('express');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const appConfig = require('./../config/config');
const userService = require('./../services/user.service');

module.exports = {
    checkToken: async (req, res, next) => {
        let token = req.get('authorization');
        console.log({
            user: req.user,
            token: req.get('authorization')
        })
        if(!token){
            res.status(400).json({message: "Invalid Bearer-Token."});
        }else{
            await userService.findByEmail(req.user.email)
                .then((exists) => {
                    
                })
            next();
        }
    }
}