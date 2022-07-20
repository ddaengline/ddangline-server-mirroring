const mongoose = require('mongoose')
const { MONGO_URI, dbName } = require('../../../config/secret');
const userDao = require('./userDao')

exports.getUsers = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URI, { dbName });
        const userList = await userDao.getUsers();
        connection.disconnect()
        return userList
    } catch(err){
        console.log({err})
    }
}