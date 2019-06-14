const db = require('../database/dbConfig');


module.exports = {
    register,
    login
}

function register(newuser){
    return db('users')
    .insert(newuser)
    .then(([id]) => {
        return db('users')
        .where({id})
        .first()
    })
}

function login(username){
    return db('users')
    .where(username)
    .first()
}
