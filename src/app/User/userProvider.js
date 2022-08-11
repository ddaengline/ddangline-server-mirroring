const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const userDao = require('./userDao');

exports.getUsers = async() => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const userList = await userDao.getUsers();
    connection.disconnect();
    return userList;
  } catch(err) {
    console.log({ err });
    return err;
  }
};

exports.getUserByEmail = async(email) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const user = await userDao.getUserByEmail(email);
    connection.disconnect();
    return user;
  } catch(err) {
    console.log({ err });
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
    console.log({ err });
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
    console.log({ err })
    return err;
  }
}