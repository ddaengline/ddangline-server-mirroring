const mongoose = require('mongoose')
const { MONGO_URI, dbName } = require('../../../config/secret');
// const {logger} = require('../../../config/winston')

const userProvider = require('./userProvider')
const userDao = require('./userDao')
const {response, errResponse }= require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');

const jwt = require('jsonwebtoken')
const crypto = require('crypto');

exports.createUser = async(username, email, password) => {
    try {
        // 비밀번호 중복 확인 해야함.

        const hashedPassword = await crypto
            .createHash('sha512')
            .update(password)
            .digest('hex')

        const insertUserInfoParams = {username, email, password: hashedPassword}
        const connection = await mongoose.connect(MONGO_URI, { dbName });

        const userIdResult = await userDao.createUser(connection, insertUserInfoParams)
        console.log(userIdResult._id)   // Object ID
        connection.disconnect()
        return response(baseResponseStatus.SUCCESS, userIdResult._id)

    } catch(err){
        // logger.error(`App - createUser Service error\n: ${err.message}`)
        console.log({err})
        return errResponse(baseResponseStatus.DB_ERROR)
    }
}