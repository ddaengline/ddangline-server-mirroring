const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { jwtsecret } = require('../../../config/secret');
// const {logger} = require('../../../config/winston')

const userProvider = require('./userProvider');
const userDao = require('./userDao');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.createUser = async (postParams) => {
  try {
    const { username, email, uniqueId, password } = postParams
    if(!password) return errResponse(baseResponseStatus.SIGNUP_PASSWORD_EMPTY)
    if(!uniqueId){
      if(!username) return errResponse(baseResponseStatus.SIGNUP_EMAIL_EMPTY)
      if(!email) return errResponse(baseResponseStatus.SIGNUP_NICKNAME_EMPTY)
    }
    // 이메일 중복
    const userEmailCheck = await userProvider.emailCheck(email)
    if (userEmailCheck) return errResponse(baseResponseStatus.SIGNUP_REDUNDANT_EMAIL)

    const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
    const insertUserInfoParams = { username, email, password: hashedPassword, uniqueId};
    
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const userIdResult = await userDao.createUser(insertUserInfoParams);
    connection.disconnect();
    
    // access token 생성
    let token = await jwt.sign(
      { userId : userIdResult._id, } ,
      jwtsecret,
      // 유효기간 3시간
      { subject: 'userInfo', });

    return response(baseResponseStatus.SUCCESS, {userId: userIdResult._id, jwt: token});
  } catch (err) {
    // logger.error(`App - createUser Service error\n: ${err.message}`)
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.postSignIn = async (resEmail, resPassword) => {
  try {
    // user 자체
    const userByEmail = await userProvider.getUserByEmail(resEmail);
    if (!userByEmail) return errResponse(baseResponseStatus.USER_USEREMAIL_NOT_EXIST);
    const hashedPassword = await crypto.createHash('sha512').update(resPassword).digest('hex');
    
    const { _id: userId, password, status } = userByEmail;

    // password 확인
    if (password !== hashedPassword) return errResponse(baseResponseStatus.SIGNIN_PASSWORD_WRONG);

    // 계정 상태 확인
    if (status === 'SLEEP') return errResponse(baseResponseStatus.SIGNIN_INACTIVE_ACCOUNT)
    if (status === 'WITHDRAWAL') return errResponse(baseResponseStatus.SIGNIN_WITHDRAWAL_ACCOUNT)

    // access token 생성
    let token = await jwt.sign(
      { userId, } ,
      jwtsecret,
      // TODO: 유효기간 확인해야하지 않나
      // 유효기간 없음.
      { subject: 'userInfo', });
      return response(baseResponseStatus.SUCCESS, {userId , jwt: token})
  } catch (err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};
