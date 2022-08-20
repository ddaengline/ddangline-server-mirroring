const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const userDao = require('./userDao');
const { logger } = require("../../../config/winston");

exports.getUsers = async() => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const userList = await userDao.getUsers();
    connection.disconnect();
    return userList ? response(baseResponseStatus.SUCCESS, userList) : errResponse(baseResponseStatus.DB_ERROR)
  } catch(err) {
    logger.error(`App - getUsers Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
};

exports.getUser = async(id) => {
  const connection = await mongoose.connect(MONGO_URI, { dbName });
  connection.set('debug', true)
  const user = await userDao.getUser(id);
  connection.disconnect();
  return user ? response(baseResponseStatus.SUCCESS, user) : errResponse(baseResponseStatus.DB_ERROR)
}

exports.getUserByEmail = async(email) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const user = await userDao.getUserByEmail(email);
    connection.disconnect();
    return user;
  } catch(err) {
    logger.error(`App - getUserByEmail Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
};

exports.emailCheck = async(email) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const emailCheckResult = await userDao.emailCheck(email);
    return emailCheckResult;
  } catch(err) {
    logger.error(`App - emailCheck Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
};

exports.socialIdCheck = async(id) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const socialIdCheck = await userDao.socialIdCheck(id);
    return socialIdCheck;
  } catch(err) {
    logger.error(`App - socialIdCheck Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}