const jwt = require('jsonwebtoken');


module.exports = function generateToken(user) {
    const {id, username, department} = user
    
    const payload = {
        subject: id,
        username: username,
    };
    const options = {
        expiresIn: '4h'
    }
    return jwt.sign(payload, process.env.JWT_SECRET, options) 
}