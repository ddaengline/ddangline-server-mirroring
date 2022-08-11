const { errResponse } = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const userProvider = require('./userProvider');
const userService = require('./userService');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const mongoose = require("mongoose");

exports.postUser = async(req, res) => {
  const { username, email, social, password } = req.body;
  let postParams = {}

  if (email)
    if (email.length > 30) return res.send(errResponse(baseResponse.SIGNUP_EMAIL_LENGTH))
    else postParams['email'] = email
  if (username) postParams['username'] = email
  if (social) postParams['social'] = social
  if (password) postParams['password'] = password

  const signUpResponse = await userService.createUser(postParams);
  return res.send(signUpResponse);
};

exports.getUsers = async(req, res) => {
  const userList = await userProvider.getUsers(userIdFromJWT);
  return res.send(userList);
};

exports.getUser = async(req, res) =>{
  const { userId } = req.params;
  const userIdFromJWT = req.verifiedToken.userId
  if(!mongoose.isValidObjectId(userId)) return res.send(errResponse(baseResponseStatus.USER_USERID_WRONG))
  if(userId !== userIdFromJWT) return res.send(errResponse(baseResponseStatus.USER_USERID_JWT_WRONG))
  const user = await userProvider.getUser(userIdFromJWT)
  return res.send(user)
}


exports.login = async(req, res) => {
  const { email, password } = req.body;
  if (!email) return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
  if (!password) return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));

  const signInRes = await userService.postSignIn(email, password);
  return res.send(signInRes);
};
