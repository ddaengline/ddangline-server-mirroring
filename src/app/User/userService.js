const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { jwtsecret } = require('../../../config/secret');
const { logger } = require('../../../config/winston');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userProvider = require('./userProvider');
const userDao = require('./userDao');


exports.createUser = async(postParams) => {
  try {
    const { username, email, social, password } = postParams
    if (!password) return errResponse(baseResponseStatus.SIGNUP_PASSWORD_EMPTY)
    if (!social) {
      if (!username) return errResponse(baseResponseStatus.SIGNUP_EMAIL_EMPTY)
      if (!email) return errResponse(baseResponseStatus.SIGNUP_NICKNAME_EMPTY)
    } else {
      if (!social.uniqueId) return errResponse(baseResponseStatus.SIGNIN_SOCIAL_ID_EMPTY)
      const socialIdCheck = await userProvider.socialIdCheck(social.uniqueId)
      if (socialIdCheck) return errResponse(baseResponseStatus.SIGNUP_REDUNDANT_SOCIAL_ID)
    }
    // 이메일 중복
    let userEmailCheck = email
    if (email) userEmailCheck = await userProvider.emailCheck(email)
    if (userEmailCheck) return errResponse(baseResponseStatus.SIGNUP_REDUNDANT_EMAIL)

    const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
    const insertUserInfoParams = { username, email, password: hashedPassword, social };

    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const userIdResult = await userDao.createUser(insertUserInfoParams);
    connection.disconnect();

    // access token 생성
    let token = await jwt.sign(
      { userId: userIdResult._id, },
      jwtsecret,
      // 유효기간 3시간
      { subject: 'userInfo', });

    return response(baseResponseStatus.SUCCESS, { userId: userIdResult._id, jwt: token });
  } catch(err) {
    logger.error(`App - createUser Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.postSignIn = async(resEmail, resPassword) => {
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
      { userId, },
      jwtsecret,
      // TODO: 유효기간 확인해야하지 않나
      // 유효기간 없음.
      { subject: 'userInfo', });
    return response(baseResponseStatus.SUCCESS, { userId, jwt: token })
  } catch(err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};
