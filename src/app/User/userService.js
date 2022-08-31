const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { jwtsecret } = require('../../../config/secret');
const { logger } = require('../../../config/winston');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const crypto = require('crypto');
const userProvider = require('./userProvider');
const userDao = require('./userDao');
const collectionDao = require('../Collection/collectionDao')


exports.createUser = async(postParams) => {
  try {
    const { username, email, social, password } = postParams
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    let insertUserInfoParams;
    let hashedPassword;
    if (!social) {
      if (!username) return errResponse(baseResponseStatus.SIGNUP_NICKNAME_EMPTY)
      if (!email) return errResponse(baseResponseStatus.SIGNUP_EMAIL_EMPTY)
      if (!password) return errResponse(baseResponseStatus.SIGNUP_PASSWORD_EMPTY)
      hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
    } else {
      if (!social.uniqueId) return errResponse(baseResponseStatus.SIGNIN_SOCIAL_ID_EMPTY)
      const socialId = await userProvider.getSocialId(social.uniqueId)
      if (socialId) { // 소셜 아이디 있으면 바로 로그인
        let token = await jwt.sign(
          { userId: socialId._id, },
          jwtsecret,
          { subject: 'userInfo', });
        return response(baseResponseStatus.SUCCESS, { userId: socialId._id, jwt: token });
      }
    }
    // 이메일 중복
    let userEmailCheck = email
    if (email) userEmailCheck = await userProvider.emailCheck(email)
    if (userEmailCheck) return errResponse(baseResponseStatus.SIGNUP_REDUNDANT_EMAIL)

    insertUserInfoParams = { username, email, password: hashedPassword, social };
    const userIdResult = await userDao.createUser(insertUserInfoParams);
    const userId = userIdResult._id;
    await collectionDao.createCollection(userId)
    connection.disconnect();
    // access token 생성
    let token = await jwt.sign(
      { userId: userId, },
      jwtsecret,
      { subject: 'userInfo', });
    return response(baseResponseStatus.SUCCESS, { userId, jwt: token });
  } catch(err) {
    logger.error(`App - createUser Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.updateUserName = async(id, name) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const updatedUser = await userDao.updateUserName(id, name);
    return response(baseResponseStatus.SUCCESS, updatedUser)
  } catch(err) {
    logger.error(`App - updateUserName Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

exports.updateUserPassword = async(id, currentPassword, newPassword) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const pw = await userDao.getPassword(id)
    const hashedCurrentPw = await crypto.createHash('sha512').update(currentPassword).digest('hex');
    if (pw.password !== hashedCurrentPw) return errResponse(baseResponseStatus.SIGNIN_PASSWORD_WRONG)
    const hashedPassword = await crypto.createHash('sha512').update(newPassword).digest('hex');
    await userDao.updateUserPassword(id, hashedPassword);
    const { isSuccess, code } = baseResponseStatus.SUCCESS;
    return response({ isSuccess, code, message: '비밀번호 변경 성공' })
  } catch(err) {
    logger.error(`App - updateUserPassword Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

exports.deleteUser = async(id) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    connection.set('debug', true)
    await userDao.deleteUser(id);
    const { isSuccess, code } = baseResponseStatus.SUCCESS;
    return response({ isSuccess, code, message: '회원 탈퇴 성공' })
  } catch(e) {
    logger.error(`App - deleteUser Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

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
      // 유효기간 없음.
      { subject: 'userInfo', });
    return response(baseResponseStatus.SUCCESS, { userId, jwt: token })
  } catch(err) {
    logger.error(`App - postSignIn Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};
