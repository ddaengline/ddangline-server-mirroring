const { errResponse } = require('../../../config/response');
const userProvider = require('./userProvider');
const userService = require('./userService');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const mongoose = require("mongoose");

exports.postUser = async(req, res) => {
  const { username, email, social, password } = req.body;
  let postParams = {}
  if (email)
    if (email.length > 30) return res.send(errResponse(baseResponseStatus.SIGNUP_EMAIL_LENGTH))
    else postParams['email'] = email
  if (username) postParams['username'] = email
  if (social) postParams['social'] = social
  if (password) postParams['password'] = password

  const signUpResponse = await userService.createUser(postParams);
  return res.send(signUpResponse);
};

exports.getUsers = async(req, res) => {
  const userList = await userProvider.getUsers();
  return res.send(userList);
};

exports.getUser = async(req, res) => {
  const userIdFromJWT = req.verifiedToken.userId
  if (!mongoose.isValidObjectId(userIdFromJWT)) return res.send(errResponse(baseResponseStatus.USER_ID_NOT_MATCH))
  const user = await userProvider.getUser(userIdFromJWT)
  return res.send(user)
}

exports.updateUserName = async(req, res) => {
  const { userId, name } = req.body;
  let n = name.trim()
  const userIdFromJWT = req.verifiedToken.userId
  if (!mongoose.isValidObjectId(userId)) return res.send(errResponse(baseResponseStatus.USER_ID_NOT_MATCH))
  if (userId !== userIdFromJWT) return res.send(errResponse(baseResponseStatus.USER_USERID_JWT_WRONG))
  if (!n || n.length === 0) return res.send(errResponse(baseResponseStatus.USER_NICKNAME_EMPTY))
  if (n.length > 20) return res.send(errResponse(baseResponseStatus.SIGNUP_NICKNAME_LENGTH))
  const user = await userService.updateUserName(userIdFromJWT, n)
  return res.send(user)
}

exports.updateUserPassword = async(req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  const cp = currentPassword.trim()
  const np = newPassword.trim()
  const userIdFromJWT = req.verifiedToken.userId
  if (!mongoose.isValidObjectId(userId)) return res.send(errResponse(baseResponseStatus.USER_ID_NOT_MATCH))
  if (userId !== userIdFromJWT) return res.send(errResponse(baseResponseStatus.USER_USERID_JWT_WRONG))
  if (!cp || cp.length === 0) return res.send(errResponse(baseResponseStatus.SIGNUP_PASSWORD_EMPTY))
  if (!np || np.length === 0) return res.send(errResponse(baseResponseStatus.UPDATE_PASSWORD_EMPTY))
  if (cp === np) return res.send(errResponse(baseResponseStatus.UPDATE_PASSWORD_EQUAL))
  if (np.length < 6 || np.length > 20) return res.send(errResponse(baseResponseStatus.SIGNUP_PASSWORD_LENGTH))
  const user = await userService.updateUserPassword(userIdFromJWT, cp, np)
  return res.send(user)
}

exports.deleteUser = async(req, res) => {
  const { userId } = req.body;
  const userIdFromJWT = req.verifiedToken.userId
  if (!mongoose.isValidObjectId(userId)) return res.send(errResponse(baseResponseStatus.USER_ID_NOT_MATCH))
  if (userId !== userIdFromJWT) return res.send(errResponse(baseResponseStatus.USER_USERID_JWT_WRONG))
  const user = await userService.deleteUser(userIdFromJWT)
  return res.send(user)
}

exports.login = async(req, res) => {
  const { email, password } = req.body;
  if (!email) return res.send(errResponse(baseResponseStatus.SIGNUP_EMAIL_EMPTY));
  if (!password) return res.send(errResponse(baseResponseStatus.SIGNUP_PASSWORD_EMPTY));

  const signInRes = await userService.postSignIn(email, password);
  return res.send(signInRes);
};
