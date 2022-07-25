const { response, errResponse } = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const userProvider = require('./userProvider');
const userService = require('./userService');
const userDao = require('./userDao');
const baseResponseStatus = require('../../../config/baseResponseStatus');

// const regexEmail = require('')

exports.postUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
  if (email.length > 30) return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
  if (!password) return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
  if (!username) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const signUpResponse = await userService.createUser(username, email, password);
  return res.send(signUpResponse);
};

exports.getUsers = async (req, res) => {
  const userList = await userProvider.getUsers();
  return res.send(response(baseResponseStatus.SUCCESS, userList));
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
  if (!password) return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));

  const signInRes = await userService.postSignIn(email, password);
  return res.send(signInRes);
};
