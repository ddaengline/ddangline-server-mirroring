const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const userDao = require('./userDao');

exports.getUsers = async() => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const userList = await userDao.getUsers();
    connection.disconnect();
    return userList ? response(baseResponseStatus.SUCCESS, userList) : errResponse(baseResponseStatus.DB_ERROR)
  } catch(err) {
    return err;
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
    return err;
  }
};

exports.emailCheck = async(email) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const emailCheckResult = await userDao.emailCheck(email);
    connection.disconnect();
    return emailCheckResult;
  } catch(err) {
    return err;
  }
};

exports.socialIdCheck = async(id) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const socialIdCheck = await userDao.socialIdCheck(id);
    connection.disconnect();
    return socialIdCheck;
  } catch(err) {
    return err;
  }
}