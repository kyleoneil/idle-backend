const e = require('express');
const jwt = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('authorization');
        if(token){
            token = token.slice(7);
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if(err){
                    res.json({
                        success: 0,
                        message: "Invalid Bearer-Token"
                    });
                }else{
                    next();
                }
            });
        }else{
            res.json({
                success: 0,
                message: "Access Denied: Unauthorized User"
            });
        }
    }
}